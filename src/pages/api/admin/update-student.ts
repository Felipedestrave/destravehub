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
        const { data: { user: teacher }, error: teacherError } = await supabase.auth.getUser(token);

        if (teacherError || !teacher) {
            return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
        }

        // 2. Parse Data
        const body = await request.json();
        const { id, name, email, language, level, whatsapp, metadata,
                billing_type, billing_amount, billing_currency, billing_day, billing_package_size, billing_package_start_date } = body;

        if (!id || !name) {
            return new Response(JSON.stringify({ error: 'ID e Nome são obrigatórios.' }), { status: 400 });
        }

        // 3. Get existing student record to find student_id (profile link)
        const { data: existingStudent, error: fetchError } = await supabaseAdmin
            .from('students')
            .select('student_id')
            .eq('id', id)
            .single();

        if (fetchError || !existingStudent) {
            return new Response(JSON.stringify({ error: 'Aluno não encontrado.' }), { status: 404 });
        }

        // 4. Update Profile if student_id exists
        if (existingStudent.student_id) {
            const profileUpdate: any = {
                full_name: name,
                whatsapp: whatsapp || null
            };

            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update(profileUpdate)
                .eq('id', existingStudent.student_id);

            if (profileError) {
                console.error('Profile Update Error:', profileError);
            }
            
            // Also update Auth email if provided and different
            if (email) {
                 await supabaseAdmin.auth.admin.updateUserById(existingStudent.student_id, {
                    email: email,
                    user_metadata: { full_name: name }
                });
            }
        }

        // 5. Update Student Record
        const { data: studentRecord, error: studentError } = await supabaseAdmin
            .from('students')
            .update({
                name,
                level: level || 'Iniciante',
                language: language || 'Japonês',
                metadata: metadata || {},
                billing_type: billing_type || 'mensalidade',
                billing_amount: billing_amount ?? null,
                billing_currency: billing_currency || 'BRL',
                billing_day: billing_day ?? null,
                billing_package_size: billing_package_size ?? null,
                billing_package_start_date: billing_package_start_date ?? null,
            })
            .eq('id', id)
            .select()
            .single();

        if (studentError) {
            return new Response(JSON.stringify({ error: `Erro DB: ${studentError.message}` }), { status: 500 });
        }

        return new Response(JSON.stringify({
            success: true,
            student: studentRecord
        }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
