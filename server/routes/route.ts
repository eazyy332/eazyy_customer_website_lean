import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

type Stop = {
  id: string;
  orderId: string;
  type: 'customer_pickup' | 'customer_dropoff';
  lat: number;
  lng: number;
  address: string;
  sequence: number;
};

export async function planRoute(req: Request, res: Response) {
  try {
    const { driver_id } = req.body || {};
    if (!driver_id) return res.status(400).json({ ok: false, error: 'missing driver_id' });

    const today = new Date().toISOString().slice(0, 10);
    const { data: assignments, error } = await supabaseAdmin
      .from('driver_assignments')
      .select('id, order_id, role, sequence')
      .eq('driver_id', driver_id)
      .eq('shift_date', today)
      .order('sequence', { ascending: true });
    // If table doesn't exist or other error, treat as no assignments
    if (error && (error.message?.includes('does not exist') || error.message?.includes('relation'))) {
      // noop; we'll fallback below
    } else if (error) {
      throw error;
    }

    const orderIds = (assignments || []).map((a: any) => a.order_id).filter(Boolean);
    let ordersById: Record<string, any> = {};
    if (orderIds.length > 0) {
      const { data: orders, error: ordersErr } = await supabaseAdmin
        .from('orders')
        .select('id, shipping_address')
        .in('id', orderIds);
      if (ordersErr) throw ordersErr;
      for (const o of orders || []) ordersById[o.id as string] = o;
    }

    const mapRole = (r: string) => (r === 'pickup' ? 'customer_pickup' : 'customer_dropoff') as Stop['type'];
    let stops: Stop[] = (assignments || []).map((a: any, idx: number) => {
      const o = ordersById[a.order_id] || {};
      const lat = 0;
      const lng = 0;
      const address = (o.shipping_address || 'Unknown') as string;
      return {
        id: a.id,
        orderId: a.order_id,
        type: mapRole(a.role),
        lat,
        lng,
        address,
        sequence: a.sequence ?? idx,
      };
    });

    // Fallback: derive stops from recent orders if no assignments
    if (!stops.length) {
      const { data: recentOrders, error: roErr } = await supabaseAdmin
        .from('orders')
        .select('id, shipping_address')
        .order('created_at', { ascending: false })
        .limit(3);
      if (roErr) throw roErr;
      stops = (recentOrders || []).map((o: any, idx: number) => ({
        id: o.id,
        orderId: o.id,
        type: (idx === 0 ? 'customer_dropoff' : 'customer_pickup') as Stop['type'],
        lat: 0,
        lng: 0,
        address: (o.shipping_address || 'Unknown') as string,
        sequence: idx,
      }));
    }

    let polyline: string | undefined = undefined;
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (key && stops.length >= 2) {
      const origin = `${stops[0].lat},${stops[0].lng}`;
      const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
      const waypoints = stops.slice(1, -1).map(s => `${s.lat},${s.lng}`).join('|');
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=optimize:false|${encodeURIComponent(waypoints)}` : ''}&mode=driving&key=${key}`;
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        polyline = json?.routes?.[0]?.overview_polyline?.points;
      } catch (_) {
        // ignore, fallback to undefined polyline
      }
    }

    // Store route plan
    await supabaseAdmin.from('route_plans').insert({
      driver_id,
      shift_date: today,
      polyline: polyline ?? null,
      stops,
    });

    return res.json({ ok: true, polyline, stops });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'route planning failed' });
  }
}


