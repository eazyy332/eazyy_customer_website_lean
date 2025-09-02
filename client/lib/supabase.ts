import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase configuration:', {
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseAnonKey ? 'configured' : 'missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection
supabase.from('services').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
  if (error) {
    console.error('Supabase connection test failed:', error.message);
  } else {
    console.log('Supabase connection successful. Services count:', count);
  }
});