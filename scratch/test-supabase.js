import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key Present:', !!supabaseAnonKey);
console.log('Service Role Key Present:', !!serviceRoleKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Keys not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || '');

async function test() {
  try {
    // 1. Test connection by selecting profiles (a public/authenticated table)
    console.log('Testing anon client...');
    const { data: anonData, error: anonError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (anonError) {
      console.error('Anon client test failed:', anonError);
    } else {
      console.log('Anon client test succeeded, profiles count:', anonData);
    }

    // 2. Test admin client
    console.log('Testing admin client...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .limit(3);

    if (adminError) {
      console.error('Admin client test failed:', adminError);
    } else {
      console.log('Admin client test succeeded, sample profiles:', adminData);
    }

  } catch (err) {
    console.error('Unhandled test error:', err);
  }
}

test();
