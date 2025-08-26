import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

export async function postScan(req: Request, res: Response) {
  try {
    const { code, when, driver_id, kind } = req.body || {};
    if (!code) return res.status(400).json({ ok: false, error: 'missing code' });
    const scanType = kind || 'delivery_verify';
    // Validate: find order by id (uuid) or order_number
    const isUuid = (v: unknown) =>
      typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);
    let order: any = null;
    if (isUuid(code)) {
      const r = await supabaseAdmin
        .from('orders')
        .select('id, order_number, status')
        .eq('id', code)
        .maybeSingle();
      order = r.data || null;
    }
    if (!order) {
      const r2 = await supabaseAdmin
        .from('orders')
        .select('id, order_number, status')
        .eq('order_number', String(code))
        .maybeSingle();
      order = r2.data || null;
    }
    if (!order) return res.status(404).json({ ok: false, error: 'order not found' });
    // Optional: verify driver assignment exists
    if (driver_id) {
      const today = new Date().toISOString().slice(0,10);
      const { data: assignment } = await supabaseAdmin
        .from('driver_assignments')
        .select('id')
        .eq('driver_id', driver_id)
        .eq('order_id', order.id)
        .eq('shift_date', today)
        .maybeSingle();
      if (!assignment && scanType !== 'preload_verify') {
        return res.status(403).json({ ok: false, error: 'not assigned' });
      }
    }

    // State machine guards
    const nextState: Record<string, { from: string; to?: string }> = {
      pickup_verify: { from: 'awaiting_pickup_customer', to: 'in_transit_to_facility' },
      facility_arrival: { from: 'in_transit_to_facility', to: 'arrived_at_facility' },
      preload_verify: { from: 'ready_for_delivery' },
      delivery_verify: { from: 'in_transit_to_customer' }, // final status set on POD
    } as const;
    const rule = nextState[scanType];
    if (!rule) return res.status(400).json({ ok: false, error: 'unknown scan kind' });
    if (order.status !== rule.from) {
      return res.status(409).json({ ok: false, error: `invalid state: expected ${rule.from}, got ${order.status}` });
    }

    // Duplicate scan detection (5 min window)
    const { data: lastScan } = await supabaseAdmin
      .from('scans')
      .select('id, created_at')
      .eq('order_id', order.id)
      .eq('type', scanType)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    let duplicate = false;
    if (lastScan) {
      const t = new Date(lastScan.created_at).getTime();
      if (Date.now() - t < 5 * 60 * 1000) duplicate = true;
    }

    await supabaseAdmin.from('scans').insert({ order_id: order.id, driver_id: driver_id ?? null, type: scanType, ok: true, meta: { code, when } });
    if (rule.to) {
      await supabaseAdmin.from('orders').update({ status: rule.to }).eq('id', order.id);
    }
    return res.json({ ok: true, order_id: order.id, duplicate });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'scan failed' });
  }
}

export async function postPod(req: Request, res: Response) {
  try {
    const { order_id, driver_id, photo_url, signature_url, note } = req.body || {};
    if (!order_id) return res.status(400).json({ ok: false, error: 'missing order_id' });
    await supabaseAdmin.from('pod').insert({ order_id, driver_id: driver_id ?? null, photo_url, signature_url, note, delivered_at: new Date().toISOString() });
    await supabaseAdmin.from('orders').update({ status: 'delivered' }).eq('id', order_id);
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'pod failed' });
  }
}

export async function postLocation(req: Request, res: Response) {
  try {
    const { driver_id, lat, lng, heading, speed, recorded_at } = req.body || {};
    if (!driver_id || lat === undefined || lng === undefined) return res.status(400).json({ ok: false, error: 'missing fields' });
    await supabaseAdmin.from('driver_locations').insert({ driver_id, lat, lng, heading, speed, recorded_at });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'loc failed' });
  }
}


