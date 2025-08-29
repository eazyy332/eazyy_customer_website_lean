import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

async function checkSupabaseConnection() {
  console.log('🔍 CHECKING SUPABASE CONNECTION\n');
  
  // Check environment variables
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment Variables:');
  console.log(`  VITE_SUPABASE_URL: ${url ? url.substring(0, 30) + '...' : 'NOT SET'}`);
  console.log(`  VITE_SUPABASE_ANON_KEY: ${anonKey ? anonKey.substring(0, 20) + '...' : 'NOT SET'}`);
  console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? serviceKey.substring(0, 20) + '...' : 'NOT SET'}\n`);
  
  if (!url) {
    console.error('❌ VITE_SUPABASE_URL is not set');
    return false;
  }
  
  if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
    return false;
  }
  
  if (!url.startsWith('https://')) {
    console.error('❌ Invalid Supabase URL format');
    return false;
  }
  
  if (!url.includes('.supabase.co')) {
    console.error('❌ URL does not appear to be a valid Supabase URL');
    return false;
  }
  
  console.log('✅ Environment variables are properly set\n');
  
  // Test connection with service role key
  console.log('Testing Supabase connection...');
  try {
    const supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase database\n');
    
    // Test table access
    console.log('Testing table access...');
    const tables = ['orders', 'order_items', 'services', 'categories', 'items'];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: accessible (${count || 0} rows)`);
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }
    
    console.log('\n🎉 Supabase connection check completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function main() {
  const success = await checkSupabaseConnection();
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});