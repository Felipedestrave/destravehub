import { supabaseAdmin } from './src/lib/supabase-admin.js';

async function run() {
    const { data } = await supabaseAdmin.from('profiles').select('id, full_name, whatsapp');
    console.log(JSON.stringify(data, null, 2));
}

run();
