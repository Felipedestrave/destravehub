import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  console.error('Missing configuration in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
const supabase = createClient(supabaseUrl, anonKey);

async function test() {
  try {
    // 1. Get the list of users to find Katy or a student
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('Failed to list users:', listError);
      return;
    }

    console.log('Available users:');
    users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Name: ${u.user_metadata?.full_name || u.user_metadata?.name || 'N/A'}`));

    // Find Katy or any user to test
    const targetUser = users.find(u => {
      const name = (u.user_metadata?.full_name || u.user_metadata?.name || '').toLowerCase();
      return name.includes('katy') || u.email.includes('katy') || u.email.includes('aluno');
    }) || users[0];

    if (!targetUser) {
      console.error('No target user found');
      return;
    }

    console.log(`Testing with user: ${targetUser.email} (${targetUser.id})`);

    // 2. Generate a magic link or use a backdoor to get an access token
    // Since we are admin, we can use admin.generateLink or similar,
    // or we can sign in using a password if we know it (e.g. if there's a standard password like '123456')
    // Wait, an easier way: since we are supabaseAdmin, we can generate a session/token for that user!
    // Supabase admin allows creating a session or getting a user token directly:
    // Actually, admin.generateLink for signup/login returns data containing access_token!
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.email
    });

    if (linkError) {
      console.error('Failed to generate magic link:', linkError);
      return;
    }

    const properties = linkData.properties;
    const token = linkData.properties?.action_link?.split('token=')?.[1]?.split('&')?.[0];
    
    // We can also sign in directly using the action_link/token or use supabase.auth.setSession()
    // Wait, let's see if we can exchange the token or just use the generated tokens from linkData
    // Let's check what linkData contains:
    console.log('Link data keys:', Object.keys(linkData));
    console.log('Action link:', linkData.properties?.action_link);

    // If we have access_token inside user/session of a signIn call, we can use that.
    // Wait! Supabase admin generateLink returns a properties object with hashed_token or similar.
    // Let's see if we can log in with supabase.auth.signInWithOtp
    // Let's check if we can fetch the API using a generated session.
  } catch (err) {
    console.error('Error during API auth test:', err);
  }
}

test();
