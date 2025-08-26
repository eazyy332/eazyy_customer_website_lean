import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const orderId = process.argv[2];
const driverId = process.argv[3] || 'DRV-QA-1';
if (!orderId) {
  console.error('Usage: node server/scripts/seedAssignment.mjs <orderId> [driverId]');
  process.exit(1);
}

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const today = new Date().toISOString().slice(0, 10);
const { error } = await supa.from('driver_assignments').insert({
  driver_id: driverId,
  order_id: orderId,
  shift_date: today,
  role: 'dropoff',
  sequence: 1,
});
if (error) {
  console.error('seed assignment error:', error.message);
  process.exit(1);
}
console.log('seeded assignment for', orderId, 'driver', driverId, 'date', today);


