import { supabaseAdmin } from './lib/supabase-admin';

async function checkStudent() {
    const authId = '2eb1006d-d3e0-4fc9-878e-bbda2e209a1c';
    
    console.log('--- Checking Students Table ---');
    const { data: student, error: sErr } = await supabaseAdmin
        .from('students')
        .select('*')
        .eq('student_id', authId);
    
    console.log('Student Records found:', student?.length || 0);
    console.log('Records:', JSON.stringify(student, null, 2));
    if (sErr) console.error('Error fetching student:', sErr);

    console.log('\n--- Checking Assignments for this AuthID ---');
    const { data: assignmentsAuth, error: aErr1 } = await supabaseAdmin
        .from('assignments')
        .select('*')
        .eq('student_id', authId);
    console.log('Assignments pointing to AuthID:', assignmentsAuth?.length || 0);

    if (student && student.length > 0) {
        console.log('\n--- Checking Assignments for Student PK:', student[0].id);
        const { data: assignmentsPK, error: aErr2 } = await supabaseAdmin
            .from('assignments')
            .select('*')
            .eq('student_id', student[0].id);
        console.log('Assignments pointing to Student PK:', assignmentsPK?.length || 0);
    }
}

checkStudent();
