import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Server Supabase configuration:', {
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseServiceKey ? 'configured' : 'missing'
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables for server. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  throw new Error('Supabase configuration missing. Please set up your environment variables.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

// Test connection
supabaseAdmin.from('orders').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
  if (error) {
    console.error('Supabase admin connection test failed:', error.message);
  } else {
    console.log('Supabase admin connection successful. Orders count:', count);
  }
}).catch(err => {
  console.error('Supabase admin connection test error:', err);
});