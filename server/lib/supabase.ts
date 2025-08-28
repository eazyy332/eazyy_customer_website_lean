import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) as string | undefined;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

let supabaseAdmin;

if (!supabaseUrl || 
    supabaseUrl === 'your_supabase_url_here' || 
    !supabaseUrl.startsWith('https://') ||
    !supabaseUrl.includes('.supabase.co')) {
  console.warn('Supabase URL not configured. Please click "Connect to Supabase" in the top right.');
  // Create a mock client that won't crash the server
  const mockClient = {
    from: (table: string) => {
      const mockQuery = {
        select: function(columns?: string) { return this; },
        eq: function() { return this; },
        order: function() { return this; },
        limit: function() { return this; },
        single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
        maybeSingle: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
        then: function(resolve: any) { return resolve({ data: [], error: { message: 'Supabase not configured' } }); }
      };
      
      const mockInsert = {
        select: function() { return this; },
        single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
        then: function(resolve: any) { return resolve({ data: null, error: { message: 'Supabase not configured' } }); }
      };
      
      const mockUpdate = {
        eq: function() { return this; },
        select: function() { return this; },
        single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
        then: function(resolve: any) { return resolve({ data: null, error: { message: 'Supabase not configured' } }); }
      };

      return {
        ...mockQuery,
        insert: () => mockInsert,
        update: () => mockUpdate,
        delete: () => mockQuery,
      };
    },
  };
  supabaseAdmin = mockClient as any;
} else {
  let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

  if (!supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_role_key_here') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found - server-side operations will be limited')
    // Create a client with anon key as fallback for development
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey || anonKey === 'your_supabase_anon_key_here') {
      console.warn('No valid Supabase keys found. Please configure Supabase.');
      // Create a mock client
      const mockClient = {
        from: (table: string) => ({
          select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
          insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        }),
      };
      supabaseAdmin = mockClient as any;
    } else {
      supabaseAdmin = createClient(supabaseUrl, anonKey);
    }
  } else {
    // Temporary startup diagnostics
    console.log("Supabase URL:", String(supabaseUrl));
    console.log(
      "Supabase KEY PREVIEW:",
      typeof supabaseServiceKey === "string" ? supabaseServiceKey.slice(0, 12) + "..." : "<missing>"
    );

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
}

export { supabaseAdmin };