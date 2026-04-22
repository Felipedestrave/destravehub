
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkSchema() {
    console.log('Checking profiles table schema...');
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
        console.error('Error selecting from profiles:', error);
    } else if (data && data.length > 0) {
        console.log('Columns found in profiles:', Object.keys(data[0]));
        if ('equipped' in data[0]) {
            console.log('SUCCESS: "equipped" column exists.');
        } else {
            console.error('FAILURE: "equipped" column is MISSING!');
        }
    } else {
        console.log('No rows in profiles, checking table info via RPC or just trying to update...');
        // Try a dummy update to see if it fails
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ equipped: {} } as any)
            .eq('id', '00000000-0000-0000-0000-000000000000');
        
        if (updateError && updateError.message.includes('column "equipped" of relation "profiles" does not exist')) {
            console.error('FAILURE: "equipped" column definitely MISSING.');
        } else {
            console.log('Update attempt did not report missing column (or table is empty).');
        }
    }
}

checkSchema();
