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

// Create a mock client for development when not configured
const mockClient = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: () => ({ data: [], error: null, count: 0 }),
      order: () => ({ data: [], error: null, count: 0 }),
      limit: () => ({ data: [], error: null, count: 0 }),
      single: () => ({ data: null, error: { message: 'Mock client - no data' } }),
      maybeSingle: () => ({ data: null, error: null }),
    }),
    insert: (data: any) => ({
      select: (columns?: string) => ({
        single: () => ({ 
          data: { 
            id: `mock-${Date.now()}`, 
            order_number: `EZ-${Date.now().toString(36).toUpperCase()}-MOCK`,
            ...data 
          }, 
          error: null 
        }),
      }),
    }),
    update: () => ({ data: null, error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication not available' } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client - authentication not available' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Mock client - storage not available' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Declare the export at top level
let supabase: any;

if (!isSupabaseConfigured) {
  console.warn('Supabase not configured - using mock client for development');
  supabase = mockClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  // Test connection only if properly configured
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
}

export { supabase };