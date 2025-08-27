import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) as
  | string
  | undefined;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL (or VITE_SUPABASE_URL) is required in env");
}

let supabaseAdmin;

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found - server-side operations will be limited')
  // Create a client with anon key as fallback for development
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!anonKey) {
    throw new Error('Either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required')
  }
  supabaseAdmin = createClient(supabaseUrl, anonKey)
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

export { supabaseAdmin };