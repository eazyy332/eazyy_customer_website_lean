import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const table = process.argv[2] || 'orders';

async function main() {
  const connString = process.env.SUPABASE_DB_URL;
  if (!connString) throw new Error('SUPABASE_DB_URL missing');
  const client = new Client({ connectionString: connString });
  await client.connect();
  const sql = `
    select column_name, data_type, character_maximum_length, is_nullable
    from information_schema.columns
    where table_schema='public' and table_name=$1
    order by ordinal_position
  `;
  const { rows } = await client.query(sql, [table]);
  console.log(JSON.stringify(rows, null, 2));
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });


