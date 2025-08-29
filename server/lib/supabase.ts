import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseServiceKey,
  urlValid: supabaseUrl.startsWith('https://'),
  urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
});

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}

if (!supabaseUrl.startsWith('https://')) {
  throw new Error('Invalid Supabase URL. Must start with https://');
}

console.log('Creating Supabase client with URL:', supabaseUrl.substring(0, 30) + '...');

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});