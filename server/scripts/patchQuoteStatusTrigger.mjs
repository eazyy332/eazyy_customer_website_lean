import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const sql = `
CREATE OR REPLACE FUNCTION public.enforce_quote_status_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Skip validation on INSERT; only enforce on status updates
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Define valid transitions
  IF OLD.status = 'pending' AND NEW.status IN ('quoted', 'declined') THEN
    RETURN NEW;
  ELSIF OLD.status = 'quoted' AND NEW.status IN ('accepted', 'declined') THEN
    RETURN NEW;
  ELSIF NEW.status = OLD.status THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
END;
$function$;
`;

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('enforce_quote_status_transition function patched');
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });


