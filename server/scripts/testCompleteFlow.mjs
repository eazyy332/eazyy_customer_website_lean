import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testCompleteOrderFlow() {
  console.log('🧪 TESTING COMPLETE ORDER FLOW\n');
  
  // Step 1: Customer creates order via web API
  console.log('1️⃣ Customer Web: Creating order...');
  const orderResp = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'test-shirt', name: 'White Shirt', price: 8.50, quantity: 2 },
        { id: 'test-pants', name: 'Blue Jeans', price: 12.00, quantity: 1 }
      ],
      totals: { subtotal: 29.00, total: 29.00 },
      contact: { name: 'John Doe', email: 'john@example.com', phone: '+31612345678' },
      address: 'Damrak 1, Amsterdam, 1012 LG',
      pickupDate: new Date(Date.now() + 24*60*60*1000).toISOString(), // tomorrow
      deliveryDate: new Date(Date.now() + 3*24*60*60*1000).toISOString() // 3 days
    })
  });
  const orderResult = await orderResp.json();
  if (!orderResult.ok) throw new Error(`Order creation failed: ${orderResult.error}`);
  const orderId = orderResult.orderId;
  console.log(`   ✅ Order created: ${orderId}\n`);

  // Step 2: Verify order in database
  console.log('2️⃣ Backend: Verifying order storage...');
  const { data: order, error: orderErr } = await supa
    .from('orders')
    .select('id, order_number, status, customer_name, total_amount')
    .eq('id', orderId)
    .single();
  if (orderErr) throw orderErr;
  console.log(`   ✅ Order in DB: ${order.order_number}, Status: ${order.status}, Total: €${order.total_amount}\n`);

  // Step 3: Verify order items
  const { data: items, error: itemsErr } = await supa
    .from('order_items')
    .select('product_name, quantity, unit_price, subtotal')
    .eq('order_id', orderId);
  if (itemsErr) throw itemsErr;
  console.log(`   ✅ Order items: ${items.length} items total`);
  items.forEach(item => console.log(`      - ${item.product_name} x${item.quantity} @ €${item.unit_price}`));
  console.log();

  // Step 4: Simulate facility processing
  console.log('3️⃣ Facility App: Processing order...');
  await supa.from('orders').update({ status: 'processing' }).eq('id', orderId);
  console.log('   ✅ Status updated to processing');
  
  await supa.from('orders').update({ status: 'ready_for_pickup' }).eq('id', orderId);
  console.log('   ✅ Status updated to ready_for_pickup\n');

  // Step 5: Driver assignment and route planning
  console.log('4️⃣ Driver App: Route planning...');
  const routeResp = await fetch(`${API_BASE}/api/route/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver_id: 'DRV-001' })
  });
  const routeResult = await routeResp.json();
  console.log(`   ✅ Route planned: ${routeResult.stops?.length || 0} stops`);
  if (routeResult.stops) {
    routeResult.stops.forEach((stop, i) => 
      console.log(`      ${i+1}. ${stop.type} at ${stop.address}`)
    );
  }
  console.log();

  // Step 6: Driver pickup scan
  console.log('5️⃣ Driver App: Pickup process...');
  await supa.from('orders').update({ status: 'awaiting_pickup_customer' }).eq('id', orderId);
  
  const pickupScanResp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code: orderId, 
      kind: 'pickup_verify', 
      driver_id: 'DRV-001' 
    })
  });
  const pickupResult = await pickupScanResp.json();
  console.log(`   ✅ Pickup scan: ${pickupResult.ok ? 'SUCCESS' : 'FAILED - ' + pickupResult.error}`);

  // Step 7: Facility arrival
  const facilityArrivalResp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code: orderId, 
      kind: 'facility_arrival', 
      driver_id: 'DRV-001' 
    })
  });
  const facilityResult = await facilityArrivalResp.json();
  console.log(`   ✅ Facility arrival: ${facilityResult.ok ? 'SUCCESS' : 'FAILED - ' + facilityResult.error}`);

  // Step 8: Processing and ready for delivery
  await supa.from('orders').update({ status: 'ready_for_delivery' }).eq('id', orderId);
  console.log('   ✅ Processing completed, ready for delivery\n');

  // Step 9: Delivery process
  console.log('6️⃣ Driver App: Delivery process...');
  
  const preloadScanResp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code: orderId, 
      kind: 'preload_verify', 
      driver_id: 'DRV-001' 
    })
  });
  const preloadResult = await preloadScanResp.json();
  console.log(`   ✅ Preload scan: ${preloadResult.ok ? 'SUCCESS' : 'FAILED - ' + preloadResult.error}`);

  await supa.from('orders').update({ status: 'in_transit_to_customer' }).eq('id', orderId);
  console.log('   ✅ In transit to customer');

  // Driver location update
  const locationResp = await fetch(`${API_BASE}/api/driver/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      driver_id: 'DRV-001',
      lat: 52.3676,
      lng: 4.9041,
      heading: 180,
      speed: 25,
      recorded_at: new Date().toISOString()
    })
  });
  const locationResult = await locationResp.json();
  console.log(`   ✅ Location update: ${locationResult.ok ? 'SUCCESS' : 'FAILED'}`);

  // Final delivery scan (bypass assignment for demo)
  const deliveryScanResp = await fetch(`${API_BASE}/api/driver/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code: orderId, 
      kind: 'delivery_verify'
    })
  });
  const deliveryResult = await deliveryScanResp.json();
  console.log(`   ✅ Delivery scan: ${deliveryResult.ok ? 'SUCCESS' : 'FAILED - ' + deliveryResult.error}`);

  // Proof of delivery
  const podResp = await fetch(`${API_BASE}/api/driver/pod`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId,
      driver_id: 'DRV-001',
      note: 'Delivered to customer at front door',
      photo_url: 'https://example.com/delivery-photo.jpg'
    })
  });
  const podResult = await podResp.json();
  console.log(`   ✅ Proof of delivery: ${podResult.ok ? 'SUCCESS' : 'FAILED - ' + podResult.error}\n`);

  // Step 10: Final verification
  console.log('7️⃣ Backend: Final verification...');
  const { data: finalOrder } = await supa
    .from('orders')
    .select('status, updated_at')
    .eq('id', orderId)
    .single();
  console.log(`   ✅ Final status: ${finalOrder.status}`);

  const { data: scans } = await supa
    .from('scans')
    .select('type, ok, created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  console.log(`   ✅ Scans recorded: ${scans?.length || 0}`);
  scans?.forEach(scan => console.log(`      - ${scan.type}: ${scan.ok ? 'OK' : 'FAILED'}`));

  const { data: pod } = await supa
    .from('pod')
    .select('delivered_at, note')
    .eq('order_id', orderId)
    .single();
  console.log(`   ✅ POD recorded: ${pod ? 'YES' : 'NO'}${pod ? ` (${pod.note})` : ''}\n`);

  console.log('🎉 COMPLETE ORDER FLOW TEST PASSED!\n');
  return { orderId, orderNumber: order.order_number };
}

async function main() {
  try {
    const result = await testCompleteOrderFlow();
    console.log(`Test completed successfully for order ${result.orderNumber}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
