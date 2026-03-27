const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yluvsxfckordpaparjax.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdXZzeGZja29yZHBhcGFyamF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMTAwMywiZXhwIjoyMDg3MDc3MDAzfQ.HBEHX-TNQw3P0RYV2CNIqPZa2E7BpwvN_PR23pdzzdY';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkStudent() {
    const authId = '2eb1006d-d3e0-4fc9-878e-bbda2e209a1c';
    
    console.log('--- Checking Student Record for:', authId);
    const { data: student, error: sErr } = await supabaseAdmin
        .from('students')
        .select('*')
        .eq('student_id', authId);
    
    if (sErr) console.error('Error fetching student:', sErr);
    console.log('Students found:', student?.length || 0);

    console.log('\n--- Searching by ID directly in students? ---');
    // If the teacher assigned to this ID, maybe the ID was a PK?
    const { data: byId } = await supabaseAdmin.from('students').select('*').eq('id', authId);
    console.log('Record with ID = AuthID:', byId?.length || 0);

    console.log('\n--- Checking Assignments for:', authId);
    const { data: assignments } = await supabaseAdmin.from('assignments').select('*, activities(title)').eq('student_id', authId);
    console.log('Assignments linked directly to this UUID:', assignments?.length || 0);
    if (assignments?.length > 0) {
        console.log('Sample:', assignments.map(a => a.activities?.title || 'Unknown').slice(0, 3));
    }
}

checkStudent();
