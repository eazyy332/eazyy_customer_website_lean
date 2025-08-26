import { supabaseAdmin } from "../lib/supabase";

async function main() {
  const candidates = [
    "contact_messages",
    "orders",
    "order_items",
    "services",
    "products",
    "customers",
    "users",
  ];

  console.log("Probing public tables (exists + row count):\n");
  for (const tableName of candidates) {
    try {
      const { count, error } = await supabaseAdmin
        .from(tableName)
        .select("*", { head: true, count: "exact" });
      if (error) throw error;
      console.log(`- ${tableName}: exists (rows=${count ?? 0})`);
    } catch (e: any) {
      console.log(`- ${tableName}: not found or no access (${e?.message ?? e})`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


