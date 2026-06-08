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
    // 1. We will sign in using a password if possible, or update a test user's password.
    // Let's create a temporary test user or use katyamalipe1998@gmail.com.
    const email = 'katyamalipe1998@gmail.com';
    
    // Set a known password for testing
    console.log(`Setting temporary password for ${email}...`);
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.find(u => u.email === email);
    if (!testUser) {
      console.error('User not found');
      return;
    }

    const tempPassword = 'TemporaryPassword123!';
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      testUser.id,
      { password: tempPassword }
    );

    if (updateError) {
      console.error('Failed to set temporary password:', updateError);
      return;
    }

    console.log('Password set successfully. Signing in via anon client...');
    
    // 3. Sign in via client-side/anon supabase client
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: tempPassword
    });

    if (signInError) {
      console.error('Sign in failed:', signInError);
      return;
    }

    const session = authData.session;
    const token = session?.access_token;
    console.log('Successfully signed in. Token prefix:', token?.substring(0, 15));
    console.log('Token length:', token?.length);

    // 4. Test validation of this token via supabase.auth.getUser(token)
    console.log('Verifying token via anon client...');
    const { data: { user: anonUser }, error: anonVerifyError } = await supabase.auth.getUser(token);
    if (anonVerifyError) {
      console.error('Anon verify failed:', anonVerifyError);
    } else {
      console.log('Anon verify succeeded. User email:', anonUser?.email);
    }

    // 5. Test validation of this token via supabaseAdmin.auth.getUser(token)
    console.log('Verifying token via admin client...');
    const { data: { user: adminUser }, error: adminVerifyError } = await supabaseAdmin.auth.getUser(token);
    if (adminVerifyError) {
      console.error('Admin verify failed:', adminVerifyError);
    } else {
      console.log('Admin verify succeeded. User email:', adminUser?.email);
    }

  } catch (err) {
    console.error('Error in test:', err);
  }
}

test();
