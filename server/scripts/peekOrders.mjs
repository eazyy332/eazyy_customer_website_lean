import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supa = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const { data, error } = await supa.from('orders').select('*').limit(1);
if (error) {
  console.error('select error:', error.message);
  process.exit(1);
}
if (!data || data.length === 0) {
  console.log('no rows');
  process.exit(0);
}
const row = data[0];
console.log('columns:', Object.keys(row));
console.log('row sample:', row);


