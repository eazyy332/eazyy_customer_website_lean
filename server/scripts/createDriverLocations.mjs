import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  await client.query(`create table if not exists public.driver_locations (
    id uuid primary key default gen_random_uuid(),
    driver_id text not null,
    lat double precision not null,
    lng double precision not null,
    heading double precision,
    speed double precision,
    recorded_at timestamptz default now()
  );`);
  await client.query(`create index if not exists idx_driver_locations_driver_time on public.driver_locations (driver_id, recorded_at desc);`);
  console.log('driver_locations ensured');
  await client.end();
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });
