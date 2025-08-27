import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured. Please connect to Supabase to enable authentication.' } 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured. Please connect to Supabase to enable authentication.' } 
    }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
      single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      maybeSingle: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      then: function(resolve) { return resolve({ data: [], error: { message: 'Supabase not configured' } }); }
    }),
    insert: () => ({
      select: function() { return this; },
      single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      then: function(resolve) { return resolve({ data: null, error: { message: 'Supabase not configured' } }); }
    }),
    update: () => ({
      eq: function() { return this; },
      select: function() { return this; },
      single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      then: function(resolve) { return resolve({ data: null, error: { message: 'Supabase not configured' } }); }
    }),
    delete: () => ({
      eq: function() { return this; },
      then: function(resolve) { return resolve({ data: null, error: { message: 'Supabase not configured' } }); }
    }),
    eq: function() { return this; },
    order: function() { return this; },
    limit: function() { return this; },
    single: function() { return this; },
    maybeSingle: function() { return this; },
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
});

// Check if Supabase is properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockClient() as any;

