import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        // 1. Authenticate Teacher
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Falta cabeçalho de autorização.' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Simpler check for now: Validate that we CAN get the user.
        // If this still fails, it's a configuration issue between server and Supabase.
        const { data: { user: teacher }, error: teacherError } = await supabase.auth.getUser(token);

        if (teacherError || !teacher) {
            console.error('Teacher Auth Error:', teacherError);
            return new Response(JSON.stringify({ error: 'Sessão do professor inválida ou expirada. Tente fazer logout e login novamente.' }), { status: 401 });
        }

        // 2. Parse Data
        const body = await request.json();
        const { name, email, password, language, level, metadata } = body;

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ error: 'Nome, e-mail e senha são obrigatórios.' }), { status: 400 });
        }

        // 3. Create Auth User (Admin)
        const { data: { user: studentAuth }, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name, role: 'student' }
        });

        if (authError || !studentAuth) {
            return new Response(JSON.stringify({ error: `Erro Auth: ${authError?.message}` }), { status: 500 });
        }

        // 4. Create Profile (Optional if your DB has triggers, but let's be explicit)
        // Ensure the profile role is set to student
        await supabaseAdmin
            .from('profiles')
            .upsert({
                id: studentAuth.id,
                full_name: name,
                role: 'student',
                whatsapp: body.whatsapp || null
            });

        // 5. Link to Students table
        const { data: studentRecord, error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
                teacher_id: teacher.id,
                student_id: studentAuth.id,
                name: name,
                level: level || 'Iniciante',
                language: language || 'Japonês',
                metadata: metadata || {}
            })
            .select()
            .single();

        if (studentError) {
            // Cleanup on error? Auth user would still exist... might need a rollback logic here for enterprise apps
            return new Response(JSON.stringify({ error: `Erro DB: ${studentError.message}` }), { status: 500 });
        }

        return new Response(JSON.stringify({
            success: true,
            student: studentRecord,
            credentials: { email, password }
        }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
