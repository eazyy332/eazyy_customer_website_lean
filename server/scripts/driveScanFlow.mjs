import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function main() {
  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Get latest order
  const { data: latest, error: selErr } = await supa
    .from('orders')
    .select('id, status')
    .order('created_at', { ascending: false })
    .limit(1);
  if (selErr) throw selErr;
  if (!latest || latest.length === 0) throw new Error('No orders found');
  const orderId = latest[0].id;
  console.log('Using order:', orderId);

  // Set ready_for_delivery
  let upd = await supa.from('orders').update({ status: 'ready_for_delivery' }).eq('id', orderId);
  if (upd.error) throw upd.error;
  console.log('Set status -> ready_for_delivery');

  // Preload verify scan
  let resp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: orderId, kind: 'preload_verify', driver_id: 'DRV-QA-1' }),
  });
  console.log('preload_verify:', await resp.text());

  // Move to in_transit_to_customer
  upd = await supa.from('orders').update({ status: 'in_transit_to_customer' }).eq('id', orderId);
  if (upd.error) throw upd.error;
  console.log('Set status -> in_transit_to_customer');

  // Delivery verify scan
  resp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: orderId, kind: 'delivery_verify', driver_id: 'DRV-QA-1' }),
  });
  console.log('delivery_verify:', await resp.text());

  // POD
  resp = await fetch(`${API_BASE}/api/driver/pod`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, driver_id: 'DRV-QA-1', note: 'QA delivered' }),
  });
  console.log('pod:', await resp.text());
}

main().catch((e) => {
  console.error('driveScanFlow error:', e?.message || e);
  process.exit(1);
});


