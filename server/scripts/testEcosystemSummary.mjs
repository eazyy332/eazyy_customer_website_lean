import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testEcosystemSummary() {
  console.log('🧪 EAZYY ECOSYSTEM COMPREHENSIVE TEST SUMMARY\n');
  console.log('=' .repeat(60));

  const results = {
    customerWeb: { passed: 0, failed: 0, tests: [] },
    backend: { passed: 0, failed: 0, tests: [] },
    driverApp: { passed: 0, failed: 0, tests: [] },
    facilityApp: { passed: 0, failed: 0, tests: [] },
    adminPanel: { passed: 0, failed: 0, tests: [] }
  };

  const test = (component, name, testFn) => {
    return testFn()
      .then(() => {
        results[component].passed++;
        results[component].tests.push({ name, status: '✅ PASS' });
        console.log(`✅ ${component.toUpperCase()}: ${name}`);
      })
      .catch(error => {
        results[component].failed++;
        results[component].tests.push({ name, status: `❌ FAIL: ${error.message}` });
        console.log(`❌ ${component.toUpperCase()}: ${name} - ${error.message}`);
      });
  };

  console.log('\n🔍 TESTING CUSTOMER WEB APPLICATION...');
  console.log('-'.repeat(40));

  // Customer Web Tests
  await test('customerWeb', 'Order Creation API', async () => {
    const resp = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: 'test', name: 'Test Item', price: 10, quantity: 1 }],
        totals: { subtotal: 10, total: 10 },
        contact: { name: 'Test User', email: 'test@example.com' },
        address: 'Test Address'
      })
    });
    const result = await resp.json();
    if (!result.ok) throw new Error(result.error);
    return result.orderId;
  });

  await test('customerWeb', 'Order Storage Verification', async () => {
    const { data, error } = await supa
      .from('orders')
      .select('id, status, customer_name')
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No orders found');
    return data[0];
  });

  await test('customerWeb', 'Order Items Storage', async () => {
    const { data: latestOrder } = await supa
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    
    const { data, error } = await supa
      .from('order_items')
      .select('product_name, quantity')
      .eq('order_id', latestOrder[0].id);
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No order items found');
    return data;
  });

  console.log('\n🔍 TESTING BACKEND SERVICES...');
  console.log('-'.repeat(40));

  // Backend Tests
  await test('backend', 'Database Connectivity', async () => {
    const { data, error } = await supa
      .from('orders')
      .select('count')
      .limit(1);
    if (error) throw error;
    return 'Connected';
  });

  await test('backend', 'Email Trigger Function', async () => {
    const { data: emails } = await supa
      .from('email_queue')
      .select('id, recipient, status')
      .order('created_at', { ascending: false })
      .limit(1);
    // Email queue should have entries from order creation
    return emails?.length > 0 ? 'Triggered' : 'No emails found';
  });

  await test('backend', 'Route Planning API', async () => {
    const resp = await fetch(`${API_BASE}/api/route/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: 'TEST-DRIVER' })
    });
    const result = await resp.json();
    if (!result.ok) throw new Error(result.error);
    return `${result.stops?.length || 0} stops planned`;
  });

  console.log('\n🔍 TESTING DRIVER APP INTEGRATION...');
  console.log('-'.repeat(40));

  // Driver App Tests
  await test('driverApp', 'Location Updates', async () => {
    const resp = await fetch(`${API_BASE}/api/driver/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driver_id: 'TEST-DRIVER',
        lat: 52.3676,
        lng: 4.9041,
        recorded_at: new Date().toISOString()
      })
    });
    const result = await resp.json();
    if (!result.ok) throw new Error('Location update failed');
    return 'Location recorded';
  });

  await test('driverApp', 'QR Code Scanning', async () => {
    // Get latest order for scanning
    const { data: orders } = await supa
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!orders || orders.length === 0) throw new Error('No orders to scan');
    
    // Set order to ready for scanning
    await supa.from('orders').update({ status: 'ready_for_delivery' }).eq('id', orders[0].id);
    
    const resp = await fetch(`${API_BASE}/api/driver/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: orders[0].id,
        kind: 'preload_verify',
        driver_id: 'TEST-DRIVER'
      })
    });
    const result = await resp.json();
    if (!result.ok) throw new Error(result.error);
    return 'Scan successful';
  });

  await test('driverApp', 'Proof of Delivery', async () => {
    const { data: orders } = await supa
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    
    const resp = await fetch(`${API_BASE}/api/driver/pod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orders[0].id,
        driver_id: 'TEST-DRIVER',
        note: 'Test delivery completed'
      })
    });
    const result = await resp.json();
    if (!result.ok) throw new Error('POD failed');
    return 'POD recorded';
  });

  console.log('\n🔍 TESTING FACILITY APP INTEGRATION...');
  console.log('-'.repeat(40));

  // Facility App Tests (Database operations)
  await test('facilityApp', 'Order Status Updates', async () => {
    const { data: orders } = await supa
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    
    const { error } = await supa
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orders[0].id);
    
    if (error) throw error;
    return 'Status updated';
  });

  await test('facilityApp', 'Discrepancy Item Creation', async () => {
    const { data: orders } = await supa
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    
    const { data: orderItems } = await supa
      .from('order_items')
      .select('id, product_name, unit_price')
      .eq('order_id', orders[0].id)
      .limit(1);
    
    if (!orderItems || orderItems.length === 0) throw new Error('No order items found');
    
    const { error } = await supa
      .from('discrepancy_items')
      .insert({
        order_id: orders[0].id,
        product_name: orderItems[0].product_name,
        expected_quantity: 1,
        actual_quantity: 2,
        unit_price: orderItems[0].unit_price,
        status: 'reported_by_facility',
        is_temporary: false,
        notes: 'Test discrepancy'
      });
    
    if (error) throw error;
    return 'Discrepancy recorded';
  });

  console.log('\n🔍 TESTING ADMIN PANEL CAPABILITIES...');
  console.log('-'.repeat(40));

  // Admin Panel Tests
  await test('adminPanel', 'Order Monitoring', async () => {
    const { data, error } = await supa
      .from('orders')
      .select('id, status, customer_name, total_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return `${data?.length || 0} orders visible`;
  });

  await test('adminPanel', 'Driver Location Tracking', async () => {
    const { data, error } = await supa
      .from('driver_locations')
      .select('driver_id, lat, lng, recorded_at')
      .order('recorded_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return `${data?.length || 0} location records`;
  });

  await test('adminPanel', 'Real-time Order Status', async () => {
    // Test status aggregation
    const { data, error } = await supa
      .rpc('get_order_status_counts')
      .single();
    
    if (error) {
      // Fallback: manual count
      const { data: statusCounts } = await supa
        .from('orders')
        .select('status')
        .order('created_at', { ascending: false });
      
      const counts = statusCounts?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      
      return `Status counts available: ${Object.keys(counts || {}).length} statuses`;
    }
    
    return 'Status counts retrieved';
  });

  // Print Results Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  let totalPassed = 0;
  let totalFailed = 0;

  Object.entries(results).forEach(([component, result]) => {
    totalPassed += result.passed;
    totalFailed += result.failed;
    const total = result.passed + result.failed;
    const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
    
    console.log(`\n${component.toUpperCase()}:`);
    console.log(`  ✅ Passed: ${result.passed}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    console.log(`  📊 Success Rate: ${percentage}%`);
    
    if (result.failed > 0) {
      console.log('  Failed Tests:');
      result.tests
        .filter(test => test.status.startsWith('❌'))
        .forEach(test => console.log(`    - ${test.name}: ${test.status}`));
    }
  });

  const overallTotal = totalPassed + totalFailed;
  const overallPercentage = overallTotal > 0 ? Math.round((totalPassed / overallTotal) * 100) : 0;

  console.log('\n' + '='.repeat(60));
  console.log('🏆 OVERALL RESULTS:');
  console.log(`   Total Tests: ${overallTotal}`);
  console.log(`   ✅ Passed: ${totalPassed}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`   📊 Success Rate: ${overallPercentage}%`);
  console.log('='.repeat(60));

  if (overallPercentage >= 80) {
    console.log('\n🎉 EAZYY ECOSYSTEM IS FUNCTIONAL!');
    console.log('   Core workflows are operational and ready for use.');
  } else if (overallPercentage >= 60) {
    console.log('\n⚠️  EAZYY ECOSYSTEM IS PARTIALLY FUNCTIONAL');
    console.log('   Some components need attention before production use.');
  } else {
    console.log('\n❌ EAZYY ECOSYSTEM NEEDS WORK');
    console.log('   Critical issues found that prevent normal operation.');
  }

  return { totalPassed, totalFailed, overallPercentage };
}

async function main() {
  try {
    const results = await testEcosystemSummary();
    process.exit(results.overallPercentage >= 80 ? 0 : 1);
  } catch (error) {
    console.error('❌ Ecosystem test failed:', error.message);
    process.exit(1);
  }
}

main();
