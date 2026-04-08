import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('teacher_id, name');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const counts: Record<string, number> = {};
  data.forEach(s => counts[s.teacher_id] = (counts[s.teacher_id] || 0) + 1);
  console.log('Students by teacher:', counts);
}

checkStudents();
