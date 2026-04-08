import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUsers() {
    const { data: profiles, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log('Profiles found:', profiles.length);
        profiles.forEach(p => console.log(`- ${p.full_name} (${p.role}) - ID: ${p.id}`));
    }

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error fetching auth users:', authError);
    } else {
        console.log('Auth users found:', authUsers.users.length);
        authUsers.users.forEach(u => console.log(`- ${u.email} (${u.id})`));
    }
}

checkUsers();
