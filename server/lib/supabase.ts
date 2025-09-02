import { createClient } from "@supabase/supabase-js";

// Load environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Server Supabase configuration:', {
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseServiceKey ? 'configured' : 'missing'
});

// Declare supabaseAdmin at top level
let supabaseAdmin: any;

// Only throw error if we're in production or if explicitly required
const isProduction = process.env.NODE_ENV === 'production';
const requireSupabase = process.env.REQUIRE_SUPABASE === 'true';

if ((!supabaseUrl || !supabaseServiceKey) && (isProduction || requireSupabase)) {
  console.error('Missing Supabase environment variables for server. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  throw new Error('Supabase configuration missing. Please set up your environment variables.');
}

// Create a mock client if Supabase is not configured
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase not configured - using mock client for development');
  
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
              service_id: data.service_id || `mock-service-${Date.now()}`,
              service_name: data.service_name || 'Mock Service',
              category_id: data.category_id || `mock-category-${Date.now()}`,
              category_name: data.category_name || 'Mock Category',
              ...data 
            }, 
            error: null 
          }),
        }),
      }),
      update: () => ({ data: null, error: null }),
    }),
  };
  
  supabaseAdmin = mockClient;
} else {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });

  // Test connection only if properly configured
  supabaseAdmin.from('orders').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
    if (error) {
      console.error('Supabase admin connection test failed:', error.message);
    } else {
      console.log('Supabase admin connection successful. Orders count:', count);
    }
  }).catch(err => {
    console.error('Supabase admin connection test error:', err);
  });
}

export { supabaseAdmin };