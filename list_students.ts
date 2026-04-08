import { supabaseAdmin } from './src/lib/supabase-admin';

async function listAllStudents() {
    console.log('--- All Students in DB ---');
    const { data: students, error } = await supabaseAdmin
        .from('students')
        .select('id, name, student_id, teacher_id');
    
    if (error) {
        console.error('Error:', error);
        return;
    }

    console.table(students);
}

listAllStudents();
