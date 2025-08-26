import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl.includes('your_supabase_url_here')) {
  throw new Error('Supabase URL not configured. Please click "Connect to Supabase" in the top right.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your_supabase_anon_key_here')) {
  throw new Error('Supabase anon key not configured. Please click "Connect to Supabase" in the top right.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});


