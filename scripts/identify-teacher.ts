import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  
  console.log('Profiles found:');
  console.log(JSON.stringify(data, null, 2));
}

listProfiles();
