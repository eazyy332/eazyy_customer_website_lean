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

// Create a mock client when Supabase is not configured
const createMockClient = () => ({
  from: (table: string) => ({
    select: (fields?: string) => ({
      eq: () => ({ 
        order: () => ({ 
          limit: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => ({ 
        limit: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({ 
          order: () => ({ 
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      limit: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      in: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured - please set up your environment variables' } 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured - please set up your environment variables' } 
    }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    })
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Storage not available' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
});

export const supabase = !isSupabaseConfigured 
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

// Only test connection if we have real credentials
if (isSupabaseConfigured) {
  // Don't run connection test immediately to avoid blocking startup
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
} else {
  console.log('Supabase not configured - using mock client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}