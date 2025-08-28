import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseServiceKey,
  urlValid: supabaseUrl.startsWith('https://'),
  urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
});

// Create a placeholder client if environment variables are not available
// This allows the dev server to start even before Supabase is connected
let supabaseAdmin: any;

if (supabaseUrl && 
    supabaseServiceKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('your_supabase_url_here') &&
    !supabaseServiceKey.includes('your_supabase_service_role_key_here')) {
  console.log('Creating real Supabase client');
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.log('Using mock Supabase client - configuration invalid or missing');
  // Placeholder client that returns errors for all operations with proper method chaining
  const mockResponse = { data: null, error: { message: 'Supabase not configured' } };
  const createChainableObject = () => ({
    select: () => createChainableObject(),
    insert: () => createChainableObject(),
    update: () => createChainableObject(),
    delete: () => createChainableObject(),
    eq: () => createChainableObject(),
    in: () => createChainableObject(),
    order: () => createChainableObject(),
    limit: () => createChainableObject(),
    maybeSingle: () => Promise.resolve(mockResponse),
    single: () => Promise.resolve(mockResponse),
    then: (resolve: any) => Promise.resolve(mockResponse).then(resolve),
    catch: (reject: any) => Promise.resolve(mockResponse).catch(reject),
    get count() { return Promise.resolve({ data: 0, error: { message: 'Supabase not configured' } }); }
  });

  supabaseAdmin = {
    from: () => createChainableObject(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } })
    }
  };
}

export { supabaseAdmin };