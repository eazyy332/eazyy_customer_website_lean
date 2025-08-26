import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const [orderId, newStatus] = process.argv.slice(2);
if (!orderId || !newStatus) {
  console.error('Usage: node server/scripts/updateOrderStatus.mjs <orderId> <status>');
  process.exit(1);
}

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supa
  .from('orders')
  .update({ status: newStatus, last_status_update: new Date().toISOString() })
  .eq('id', orderId);

if (error) {
  console.error('update error:', error.message);
  process.exit(1);
}

console.log('updated', orderId, '->', newStatus);


