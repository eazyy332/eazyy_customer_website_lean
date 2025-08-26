import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();

  const q = (table) => `
    select conname, pg_get_constraintdef(c.oid) as def
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public' and t.relname = '${table}' and c.contype = 'c'
  `;

  const distinct = async (table, col) => {
    try {
      const { rows } = await client.query(`select distinct ${col} from ${table} where ${col} is not null limit 20`);
      return rows.map(r => r[col]);
    } catch {
      return [];
    }
  };

  const disc = await client.query(q('discrepancy_items'));
  const quote = await client.query(q('custom_price_quotes'));

  console.log('discrepancy_constraints');
  console.log(JSON.stringify(disc.rows, null, 2));
  console.log('custom_quote_constraints');
  console.log(JSON.stringify(quote.rows, null, 2));

  const discStatuses = await distinct('discrepancy_items', 'status');
  const quoteStatuses = await distinct('custom_price_quotes', 'status');
  console.log('discrepancy_status_samples');
  console.log(JSON.stringify(discStatuses, null, 2));
  console.log('custom_quote_status_samples');
  console.log(JSON.stringify(quoteStatuses, null, 2));

  await client.end();
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });


