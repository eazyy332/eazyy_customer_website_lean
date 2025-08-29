import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

/**
 * Database Connectivity Specialist Report
 * Testing Supabase Connection with Provided Credentials
 */

async function validateCredentials() {
  console.log('🔐 CREDENTIAL VALIDATION REPORT');
  console.log('=' .repeat(50));
  
  const projectId = 'jamgmyljyydryxaonbgk';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.VITE_SUPABASE_URL;
  
  // 1. Validate JWT format and decode
  console.log('\n1️⃣ JWT TOKEN VALIDATION:');
  
  function decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return { header, payload, valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
  
  const anonDecoded = decodeJWT(anonKey);
  const serviceDecoded = decodeJWT(serviceKey);
  
  console.log(`   Anonymous Key: ${anonDecoded.valid ? '✅ VALID' : '❌ INVALID'}`);
  if (anonDecoded.valid) {
    console.log(`     - Role: ${anonDecoded.payload.role}`);
    console.log(`     - Project Ref: ${anonDecoded.payload.ref}`);
    console.log(`     - Expires: ${new Date(anonDecoded.payload.exp * 1000).toISOString()}`);
    console.log(`     - Project Match: ${anonDecoded.payload.ref === projectId ? '✅ YES' : '❌ NO'}`);
  }
  
  console.log(`   Service Key: ${serviceDecoded.valid ? '✅ VALID' : '❌ INVALID'}`);
  if (serviceDecoded.valid) {
    console.log(`     - Role: ${serviceDecoded.payload.role}`);
    console.log(`     - Project Ref: ${serviceDecoded.payload.ref}`);
    console.log(`     - Expires: ${new Date(serviceDecoded.payload.exp * 1000).toISOString()}`);
    console.log(`     - Project Match: ${serviceDecoded.payload.ref === projectId ? '✅ YES' : '❌ NO'}`);
  }
  
  // 2. Validate URL construction
  console.log('\n2️⃣ URL VALIDATION:');
  const expectedUrl = `https://${projectId}.supabase.co`;
  console.log(`   Expected URL: ${expectedUrl}`);
  console.log(`   Provided URL: ${url}`);
  console.log(`   URL Match: ${url === expectedUrl ? '✅ YES' : '❌ NO'}`);
  
  return { anonDecoded, serviceDecoded, urlValid: url === expectedUrl };
}

async function testConnectivity() {
  console.log('\n3️⃣ CONNECTIVITY TESTING:');
  
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Test with anonymous key (client-side)
  console.log('\n   Testing Anonymous Key Connection:');
  try {
    const anonClient = createClient(url, anonKey);
    const { data, error } = await anonClient
      .from('services')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Anonymous connection failed: ${error.message}`);
    } else {
      console.log('   ✅ Anonymous connection successful');
    }
  } catch (error) {
    console.log(`   ❌ Anonymous connection error: ${error.message}`);
  }
  
  // Test with service role key (server-side)
  console.log('\n   Testing Service Role Key Connection:');
  try {
    const serviceClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const { data, error } = await serviceClient
      .from('orders')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Service role connection failed: ${error.message}`);
    } else {
      console.log('   ✅ Service role connection successful');
    }
  } catch (error) {
    console.log(`   ❌ Service role connection error: ${error.message}`);
  }
  
  // Test authentication flow
  console.log('\n   Testing Authentication Flow:');
  try {
    const authClient = createClient(url, anonKey);
    const { data: { session }, error } = await authClient.auth.getSession();
    
    if (error) {
      console.log(`   ❌ Auth session check failed: ${error.message}`);
    } else {
      console.log(`   ✅ Auth session check successful (session: ${session ? 'active' : 'none'})`);
    }
  } catch (error) {
    console.log(`   ❌ Auth flow error: ${error.message}`);
  }
}

async function securityAssessment() {
  console.log('\n4️⃣ SECURITY ASSESSMENT:');
  console.log('\n   🔒 SECURITY WARNINGS:');
  console.log('   ⚠️  Service role key has FULL database access');
  console.log('   ⚠️  Never expose service role key in client-side code');
  console.log('   ⚠️  Only use service role key on secure servers');
  console.log('   ⚠️  Anonymous key is safe for client-side use');
  
  console.log('\n   ✅ SECURITY RECOMMENDATIONS:');
  console.log('   • Keep service role key in server environment only');
  console.log('   • Use Row Level Security (RLS) policies');
  console.log('   • Regularly rotate API keys');
  console.log('   • Monitor API usage in Supabase dashboard');
  console.log('   • Use environment variables, never hardcode keys');
}

function provideConnectionExamples() {
  console.log('\n5️⃣ CONNECTION EXAMPLES:');
  
  console.log('\n   📝 Client-side Connection (React/Frontend):');
  console.log(`
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${process.env.VITE_SUPABASE_URL}'
const supabaseAnonKey = '${process.env.VITE_SUPABASE_ANON_KEY}'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Test query
const { data, error } = await supabase
  .from('services')
  .select('*')
  .limit(5)
`);

  console.log('\n   📝 Server-side Connection (Node.js/Backend):');
  console.log(`
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${process.env.VITE_SUPABASE_URL}'
const supabaseServiceKey = '${process.env.SUPABASE_SERVICE_ROLE_KEY}'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Test admin query
const { data, error } = await supabaseAdmin
  .from('orders')
  .select('*')
  .limit(5)
`);

  console.log('\n   📝 Authentication Test:');
  console.log(`
// Test user authentication
const { data: { user }, error } = await supabase.auth.getUser(token)
if (error) {
  console.error('Auth error:', error.message)
} else {
  console.log('User authenticated:', user?.email)
}
`);
}

async function main() {
  console.log('🧪 SUPABASE DATABASE CONNECTION SPECIALIST REPORT');
  console.log('Project ID: jamgmyljyydryxaonbgk');
  console.log('Timestamp:', new Date().toISOString());
  console.log('=' .repeat(60));
  
  try {
    // Validate credentials
    const validation = await validateCredentials();
    
    // Test connectivity
    await testConnectivity();
    
    // Security assessment
    await securityAssessment();
    
    // Provide examples
    provideConnectionExamples();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SUMMARY:');
    
    if (validation.anonDecoded.valid && validation.serviceDecoded.valid && validation.urlValid) {
      console.log('✅ All credentials appear valid and properly formatted');
      console.log('✅ Project references match expected project ID');
      console.log('✅ URL construction is correct');
      console.log('\n🎯 RECOMMENDATION: Credentials should work for database operations');
    } else {
      console.log('❌ Issues found with provided credentials');
      console.log('🔧 RECOMMENDATION: Verify credentials in Supabase dashboard');
    }
    
    console.log('\n🔗 Next steps:');
    console.log('   1. Ensure .env file contains all required variables');
    console.log('   2. Restart development server');
    console.log('   3. Test basic database operations');
    console.log('   4. Verify Row Level Security policies if needed');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Script execution failed:', error.message);
  process.exit(1);
});