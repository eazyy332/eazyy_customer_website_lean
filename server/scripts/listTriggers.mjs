import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  const triggersSql = `
    select t.tgname as trigger_name,
           c.relname as table_name,
           p.proname as function_name,
           p.oid as function_oid
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_proc p on p.oid = t.tgfoid
    where n.nspname = 'public' and c.relname = 'orders' and not t.tgisinternal;
  `;
  const { rows } = await client.query(triggersSql);
  for (const r of rows) {
    console.log('Trigger:', r.trigger_name, 'Function:', r.function_name);
    const def = await client.query('select pg_get_functiondef($1::oid) as def', [r.function_oid]);
    console.log(def.rows[0]?.def || '<no def>');
  }
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });


