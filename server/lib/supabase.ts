import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Server Supabase configuration:', {
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseServiceKey ? 'configured' : 'missing'
});

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null, count: 0 }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
});

export const supabaseAdmin = (!supabaseUrl || !supabaseServiceKey) 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });

// Test connection only if we have real credentials
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin.from('orders').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
    if (error) {
      console.error('Supabase admin connection test failed:', error.message);
    } else {
      console.log('Supabase admin connection successful. Orders count:', count);
    }
  });
} else {
  console.warn('Supabase not configured - using mock client for development');
}