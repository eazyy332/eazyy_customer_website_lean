import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const TEST_EMAIL = 'frix779@gmail.com';

async function testOrderConfirmationEmail() {
  console.log('📧 Testing Order Confirmation Email...');
  
  const payload = {
    email: TEST_EMAIL,
    firstName: 'Test User',
    orderNumber: 'EZ-TEST-001',
    customerName: 'Test User',
    totalAmount: 45.50,
    pickupDate: new Date(Date.now() + 24*60*60*1000).toISOString(), // Tomorrow
    deliveryDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(), // 3 days from now
    address: 'Damrak 1, 1012 LG Amsterdam, Netherlands',
    items: [
      { name: 'White Dress Shirt', quantity: 2, price: 8.50 },
      { name: 'Blue Jeans', quantity: 1, price: 15.00 },
      { name: 'Cotton T-Shirt', quantity: 3, price: 6.00 }
    ]
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Order confirmation email sent successfully');
      console.log(`   📨 Message ID: ${result.messageId}`);
    } else {
      console.log('   ❌ Failed to send order confirmation email');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('   ❌ Network error sending order confirmation email');
    console.log(`   Error: ${error.message}`);
  }
}

async function testDiscrepancyEmail() {
  console.log('\n📧 Testing Discrepancy Notification Email...');
  
  const payload = {
    email: TEST_EMAIL,
    firstName: 'Test User',
    orderNumber: 'EZ-TEST-002',
    discrepancyItems: [
      {
        product_name: 'White Dress Shirt',
        expected_quantity: 2,
        actual_quantity: 3,
        notes: 'Customer provided one extra shirt that was not in the original order'
      },
      {
        product_name: 'Black Trousers',
        expected_quantity: 1,
        actual_quantity: 0,
        notes: 'Item was not found in the provided laundry bag'
      }
    ],
    facilityName: 'Amsterdam Central Facility',
    cta_url: `https://eazyy.app/discrepancy/EZ-TEST-002`
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-discrepancy-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Discrepancy notification email sent successfully');
      console.log(`   📨 Message ID: ${result.messageId}`);
    } else {
      console.log('   ❌ Failed to send discrepancy notification email');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('   ❌ Network error sending discrepancy notification email');
    console.log(`   Error: ${error.message}`);
  }
}

async function testCustomQuoteEmail() {
  console.log('\n📧 Testing Custom Quote Email...');
  
  const payload = {
    email: TEST_EMAIL,
    firstName: 'Test User',
    quoteId: 'QT-TEST-001',
    itemName: 'Vintage Silk Evening Gown',
    quotedPrice: 89.99,
    estimatedDays: 5,
    facilityNotes: 'This delicate silk gown requires specialized cleaning with our gentle silk treatment process. The beading will be carefully protected during cleaning.',
    cta_url: `https://eazyy.app/quote-approval/QT-TEST-001`
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-quote-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Custom quote email sent successfully');
      console.log(`   📨 Message ID: ${result.messageId}`);
    } else {
      console.log('   ❌ Failed to send custom quote email');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('   ❌ Network error sending custom quote email');
    console.log(`   Error: ${error.message}`);
  }
}

async function testEmailQueueProcessor() {
  console.log('\n📧 Testing Email Queue Processor...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-email-queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Email queue processor executed successfully');
      console.log(`   📊 Processed: ${result.processed} emails`);
      console.log(`   ❌ Failed: ${result.failed} emails`);
      console.log(`   📈 Total: ${result.total} emails in queue`);
    } else {
      console.log('   ❌ Failed to process email queue');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('   ❌ Network error processing email queue');
    console.log(`   Error: ${error.message}`);
  }
}

async function main() {
  console.log('🧪 TESTING EAZYY EMAIL SYSTEM');
  console.log('=' .repeat(50));
  console.log(`📬 Test emails will be sent to: ${TEST_EMAIL}`);
  console.log(`🌐 Supabase URL: ${SUPABASE_URL}`);
  console.log('=' .repeat(50));

  if (!SUPABASE_URL) {
    console.error('❌ SUPABASE_URL not configured');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured');
    process.exit(1);
  }

  // Test all email functions
  await testOrderConfirmationEmail();
  await testDiscrepancyEmail();
  await testCustomQuoteEmail();
  await testEmailQueueProcessor();

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 EMAIL TESTING COMPLETED');
  console.log('=' .repeat(50));
  console.log('\n📱 Check your email inbox at frix779@gmail.com');
  console.log('📧 You should receive 3 test emails if everything is working');
  console.log('\n💡 If emails don\'t arrive:');
  console.log('   1. Check spam/junk folder');
  console.log('   2. Verify Supabase Edge Functions are deployed');
  console.log('   3. Check Resend API key is valid');
  console.log('   4. Review Supabase function logs for errors');
}

main().catch(error => {
  console.error('❌ Email test failed:', error.message);
  process.exit(1);
});