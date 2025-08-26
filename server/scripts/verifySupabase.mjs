import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

async function main() {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("URL:", url);
  console.log("KEY PREVIEW:", key ? key.slice(0, 12) + "..." : "<missing>");
  const supa = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supa.from("orders").select("id").limit(1);
  console.log("select error:", error?.message || null);
  console.log("data:", data);
}

main().catch((e) => {
  console.error("script error:", e?.message || e);
  process.exit(1);
});


