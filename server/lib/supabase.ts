import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env first, then override with .env.local so local secrets win over repo defaults
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) as
  | string
  | undefined;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL (or VITE_SUPABASE_URL) is required in env");
}
if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required in env");
}

// Temporary startup diagnostics
console.log("Supabase URL:", String(supabaseUrl));
console.log(
  "Supabase KEY PREVIEW:",
  typeof supabaseServiceKey === "string" ? supabaseServiceKey.slice(0, 12) + "..." : "<missing>"
);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});


