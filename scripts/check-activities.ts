import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('teacher_id, title');
  
  if (error) {
    console.error('Error fetching activities:', error);
    return;
  }
  
  const counts: Record<string, number> = {};
  data.forEach(a => {
    counts[a.teacher_id] = (counts[a.teacher_id] || 0) + 1;
  });
  
  console.log('Activity Teacher IDs found:', counts);
  
  // Also check profiles again but with more fields
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, role');
  console.log('Profiles currently in DB:', profiles);
}

checkActivities();
