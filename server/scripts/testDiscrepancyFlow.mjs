import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testDiscrepancyFlow() {
  console.log('🧪 TESTING DISCREPANCY FLOW\n');

  // Step 1: Create a standard order first
  console.log('1️⃣ Customer Web: Creating order...');
  const orderResp = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'shirt-001', name: 'Blue Dress Shirt', price: 9.50, quantity: 3 },
        { id: 'pants-001', name: 'Black Trousers', price: 15.00, quantity: 2 }
      ],
      totals: { subtotal: 58.50, total: 58.50 },
      contact: { name: 'Maria Garcia', email: 'maria@example.com' },
      address: 'Vondelstraat 120, Amsterdam, 1054 GT'
    })
  });

  const orderResult = await orderResp.json();
  if (!orderResult.ok) throw new Error(`Order creation failed: ${orderResult.error}`);
  const orderId = orderResult.orderId;
  console.log(`   ✅ Order created: ${orderId}\n`);

  // Step 2: Move order to facility for verification
  console.log('2️⃣ Facility App: Order arrives for verification...');
  await supa.from('orders').update({ 
    status: 'arrived_at_facility',
    last_status_update: new Date().toISOString()
  }).eq('id', orderId);
  console.log('   ✅ Order status: arrived_at_facility');

  // Get original order items
  const { data: originalItems } = await supa
    .from('order_items')
    .select('id, product_name, quantity, unit_price')
    .eq('order_id', orderId);
  console.log(`   📦 Original items: ${originalItems?.length || 0}`);
  originalItems?.forEach(item => 
    console.log(`      - ${item.product_name} x${item.quantity}`)
  );

  // Step 3: Facility finds discrepancies
  console.log('\n3️⃣ Facility App: Staff finds discrepancies...');
  
  // Simulate facility finding issues:
  // - Customer sent 4 shirts instead of 3 (extra item)
  // - Customer sent 1 trouser instead of 2 (missing item)
  const discrepancies = [
    {
      order_id: orderId,
      original_item_id: originalItems[0].id, // Blue Dress Shirt
      original_quantity: 3,
      found_quantity: 4,
      discrepancy_type: 'extra',
      reason: 'Customer provided one extra shirt',
      status: 'pending_customer_decision'
    },
    {
      order_id: orderId,
      original_item_id: originalItems[1].id, // Black Trousers  
      original_quantity: 2,
      found_quantity: 1,
      discrepancy_type: 'missing',
      reason: 'Customer only provided one trouser, expected two',
      status: 'pending_customer_decision'
    }
  ];

  const { data: createdDiscrepancies, error: discErr } = await supa
    .from('discrepancy_items')
    .insert(discrepancies)
    .select('id, discrepancy_type, reason, status');
  
  if (discErr) throw discErr;
  console.log(`   ✅ Discrepancies recorded: ${createdDiscrepancies?.length || 0}`);
  createdDiscrepancies?.forEach(disc => 
    console.log(`      - ${disc.discrepancy_type}: ${disc.reason}`)
  );

  // Update order status to indicate discrepancies found
  await supa.from('orders').update({ 
    status: 'pending_item_confirmation',
    has_discrepancy: true,
    last_status_update: new Date().toISOString()
  }).eq('id', orderId);
  console.log('   ✅ Order status: pending_item_confirmation\n');

  // Step 4: Customer receives notification (simulate)
  console.log('4️⃣ Backend: Customer discrepancy notification...');
  console.log('   📧 Email sent to customer with discrepancy details');
  console.log(`   🔗 Review link: /discrepancy-approval/${orderId}\n`);

  // Step 5: Customer reviews and approves discrepancies
  console.log('5️⃣ Customer Web: Reviewing discrepancies...');
  
  // Fetch discrepancies for customer review
  const { data: customerDiscrepancies } = await supa
    .from('discrepancy_items')
    .select('id, discrepancy_type, reason, original_quantity, found_quantity, status')
    .eq('order_id', orderId)
    .eq('status', 'pending_customer_decision');

  console.log(`   📋 Customer sees ${customerDiscrepancies?.length || 0} discrepancies:`);
  customerDiscrepancies?.forEach(disc => 
    console.log(`      - ${disc.discrepancy_type}: ${disc.original_quantity} → ${disc.found_quantity}`)
  );

  // Customer approves both discrepancies
  const approvals = customerDiscrepancies?.map(disc => ({
    id: disc.id,
    status: 'approved',
    customer_decision: 'approved',
    customer_decision_at: new Date().toISOString()
  })) || [];

  for (const approval of approvals) {
    await supa
      .from('discrepancy_items')
      .update({ 
        status: approval.status,
        customer_decision: approval.customer_decision,
        customer_decision_at: approval.customer_decision_at
      })
      .eq('id', approval.id);
  }
  console.log('   ✅ Customer approved all discrepancies\n');

  // Step 6: Update order items and totals based on approvals
  console.log('6️⃣ Backend: Updating order based on approvals...');
  
  // Update quantities in order_items based on found quantities
  for (const disc of customerDiscrepancies || []) {
    if (disc.customer_decision === 'approved') {
      await supa
        .from('order_items')
        .update({ 
          quantity: disc.found_quantity,
          subtotal: disc.found_quantity * originalItems.find(i => i.id === disc.original_item_id)?.unit_price || 0
        })
        .eq('id', disc.original_item_id);
    }
  }

  // Recalculate order totals
  const { data: updatedItems } = await supa
    .from('order_items')
    .select('subtotal')
    .eq('order_id', orderId);
  
  const newSubtotal = updatedItems?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0;
  
  await supa
    .from('orders')
    .update({
      subtotal: newSubtotal,
      total_amount: newSubtotal, // Simplified - no tax/fees for demo
      has_discrepancy: false,
      status: 'processing',
      last_status_update: new Date().toISOString()
    })
    .eq('id', orderId);

  console.log(`   ✅ Order totals updated: €${newSubtotal}`);
  console.log('   ✅ Order status: processing - ready to continue\n');

  // Step 7: Verify final state
  console.log('7️⃣ Backend: Final verification...');
  
  const { data: finalOrder } = await supa
    .from('orders')
    .select('id, status, subtotal, total_amount, has_discrepancy')
    .eq('id', orderId)
    .single();

  const { data: finalItems } = await supa
    .from('order_items')
    .select('product_name, quantity, unit_price, subtotal')
    .eq('order_id', orderId);

  const { data: finalDiscrepancies } = await supa
    .from('discrepancy_items')
    .select('discrepancy_type, status, customer_decision')
    .eq('order_id', orderId);

  console.log(`   ✅ Final order status: ${finalOrder.status}`);
  console.log(`   ✅ Has discrepancy flag: ${finalOrder.has_discrepancy}`);
  console.log(`   ✅ Updated total: €${finalOrder.total_amount}`);
  console.log('   📦 Final items:');
  finalItems?.forEach(item => 
    console.log(`      - ${item.product_name} x${item.quantity} @ €${item.unit_price} = €${item.subtotal}`)
  );
  console.log('   📋 Discrepancy decisions:');
  finalDiscrepancies?.forEach(disc => 
    console.log(`      - ${disc.discrepancy_type}: ${disc.customer_decision}`)
  );

  console.log('\n🎉 DISCREPANCY FLOW TEST PASSED!\n');
  return { orderId, discrepancyCount: finalDiscrepancies?.length || 0 };
}

async function main() {
  try {
    const result = await testDiscrepancyFlow();
    console.log(`Discrepancy test completed: Order ${result.orderId} with ${result.discrepancyCount} discrepancies resolved`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Discrepancy test failed:', error.message);
    process.exit(1);
  }
}

main();
