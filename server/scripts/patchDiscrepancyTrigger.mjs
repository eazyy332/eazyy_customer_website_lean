import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const sql = `
CREATE OR REPLACE FUNCTION public.log_discrepancy_created()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_order_record record;
  v_user_email text;
  v_user_name text;
  v_facility_name text;
  v_discrepancy_items jsonb;
  v_payload jsonb;
  v_discrepancy_count integer;
BEGIN
  -- Log trigger execution (safe)
  INSERT INTO debug_logs (context, data)
  VALUES (
    'discrepancy_trigger_fired',
    jsonb_build_object(
      'discrepancy_id', NEW.id,
      'order_id', NEW.order_id,
      'product_name', NEW.product_name,
      'expected_quantity', NEW.expected_quantity,
      'actual_quantity', NEW.actual_quantity,
      'timestamp', NOW(),
      'trigger_event', 'INSERT'
    )
  );

  -- Get order/customer details
  SELECT 
    o.*,
    COALESCE(c.name, o.customer_name) as customer_name,
    COALESCE(c.email, o.email) as customer_email
  INTO v_order_record
  FROM orders o
  LEFT JOIN customers c ON c.id = o.customer_id
  WHERE o.id = NEW.order_id;

  -- Facility name may not exist in live schema; use safe default
  v_facility_name := 'Our Facility';

  -- Determine user email
  SELECT 
    COALESCE(p.first_name, v_order_record.customer_name, 'Valued Customer'),
    COALESCE(v_order_record.customer_email, au.email)
  INTO v_user_name, v_user_email
  FROM auth.users au
  LEFT JOIN profiles p ON p.id = au.id
  WHERE au.id = v_order_record.user_id;

  IF v_user_email IS NULL OR v_user_email = '' THEN
    v_user_email := v_order_record.customer_email;
  END IF;

  -- Count discrepancies
  SELECT COUNT(*) INTO v_discrepancy_count
  FROM discrepancy_items
  WHERE order_id = NEW.order_id;

  -- Aggregate discrepancy items
  SELECT jsonb_agg(
    jsonb_build_object(
      'product_name', product_name,
      'expected_quantity', COALESCE(expected_quantity, 0),
      'actual_quantity', actual_quantity,
      'notes', COALESCE(notes, '')
    )
  ) INTO v_discrepancy_items
  FROM discrepancy_items
  WHERE order_id = NEW.order_id;

  -- Only attempt email if first discrepancy and email exists
  IF v_user_email IS NOT NULL AND v_user_email != '' AND v_discrepancy_count = 1 THEN
    v_payload := jsonb_build_object(
      'email', v_user_email,
      'firstName', v_user_name,
      'orderNumber', v_order_record.order_number,
      'discrepancyItems', COALESCE(v_discrepancy_items, '[]'::jsonb),
      'facilityName', v_facility_name,
      'cta_url', 'https://eazyy.app/orders/' || v_order_record.id || '/discrepancy'
    );
    BEGIN
      PERFORM net.http_post(
        url := 'https://jamgmyljyydryxaonbgk.supabase.co/functions/v1/send-discrepancy-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbWdteWxqeXlkcnl4YW9uYmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjEzNTA1MiwiZXhwIjoyMDU3NzExMDUyfQ.N3v4C2PtSuW_VZ9ngyyjEMC06brPchLL4r8bsMjwXic'
        ),
        body := v_payload
      );
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO debug_logs (context, data)
      VALUES (
        'discrepancy_email_error',
        jsonb_build_object('order_id', NEW.order_id, 'error_message', SQLERRM, 'error_state', SQLSTATE)
      );
    END;
  END IF;

  RETURN NEW;
END;
$function$;
`;

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('log_discrepancy_created function patched');
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });


