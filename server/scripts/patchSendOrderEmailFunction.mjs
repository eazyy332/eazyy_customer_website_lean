import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const sql = `
CREATE OR REPLACE FUNCTION public.send_order_notification_email()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  email_subject TEXT;
  email_content TEXT;
  pickup_date TEXT;
  delivery_date TEXT;
  address_string TEXT;
  service_names TEXT;
BEGIN
  -- Guard: require recipient
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;

  pickup_date := COALESCE(to_char(NEW.pickup_date, 'YYYY-MM-DD'), '');
  delivery_date := COALESCE(to_char(NEW.delivery_date, 'YYYY-MM-DD'), '');
  address_string := COALESCE(NEW.shipping_address, '');

  -- service names from metadata if present
  IF NEW.metadata IS NOT NULL AND NEW.metadata ? 'selectedServices' THEN
    SELECT string_agg(svc->>'name', ', ')
    INTO service_names
    FROM jsonb_array_elements(NEW.metadata->'selectedServices') AS svc;
  ELSE
    service_names := COALESCE(NEW.service_name, 'Laundry Service');
  END IF;

  email_subject := 'Order Confirmation - Eazyy Order #' || COALESCE(NEW.order_number::text, '');

  email_content := COALESCE(
    '<html><body>' ||
    '<h2>Thanks for your order</h2>' ||
    '<p>Order #: ' || COALESCE(NEW.order_number::text, '') || '</p>' ||
    '<p>Name: ' || COALESCE(NEW.customer_name, '') || '</p>' ||
    '<p>Service: ' || COALESCE(service_names, '') || '</p>' ||
    '<p>Pickup: ' || pickup_date || '</p>' ||
    '<p>Delivery: ' || delivery_date || '</p>' ||
    '<p>Address: ' || address_string || '</p>' ||
    '<p>Total: ' || COALESCE(NEW.total_amount::text, '') || '</p>' ||
    '</body></html>',
    'Order ' || COALESCE(NEW.order_number::text, '')
  );

  INSERT INTO public.email_queue (recipient, subject, content, status, metadata)
  VALUES (NEW.email, email_subject, email_content, 'pending', jsonb_build_object('order_id', NEW.id));

  RETURN NEW;
END;
$function$;
`;

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('send_order_notification_email function patched');
}

main().catch((e) => { console.error(e); process.exit(1); });


