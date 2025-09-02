import { createClient } from "@supabase/supabase-js";

// Lazy initialization to avoid errors during Vite config loading
let _supabaseAdmin: any = null;

function createSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  console.log('Supabase configuration check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey,
    urlValid: supabaseUrl.startsWith('https://'),
    urlPreview: supabaseUrl ? supabaseUrl.substring(0, 50) + '...' : 'missing'
  });

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
    // Return a mock client instead of throwing
    return createMockSupabaseAdmin();
  }

  if (!supabaseUrl.startsWith('https://')) {
    console.error('Invalid Supabase URL. Must start with https://');
    return createMockSupabaseAdmin();
  }

  console.log('Creating Supabase admin client...');

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });

  return _supabaseAdmin;
}

function createMockSupabaseAdmin() {
  return {
    from: (table: string) => ({
      select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      eq: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
      single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
      maybeSingle: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
    }),
  };
}

export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    const client = createSupabaseAdmin();
    return client[prop];
  }
});