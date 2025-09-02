import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase configuration:', {
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseAnonKey ? 'configured' : 'missing'
});

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseUrl !== 'your-project-url.supabase.co' &&
  !supabaseUrl.includes('your-project');

if (!isSupabaseConfigured) {
  console.warn('Supabase not configured - please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  throw new Error('Supabase configuration missing. Please set up your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection
setTimeout(() => {
  supabase.from('services').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
    if (error) {
      console.error('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection successful. Services count:', count);
    }
  }).catch(err => {
    console.error('Supabase connection test error:', err);
  });
}, 1000);