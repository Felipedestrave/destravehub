import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, email, whatsapp, activityId } = body;

        // Input validation
        if (!name?.trim() || !whatsapp?.trim() || !activityId) {
            return new Response(JSON.stringify({
                error: 'Nome, WhatsApp e ID da atividade são obrigatórios.'
            }), { status: 400 });
        }

        // 1. Fetch the activity to verify it exists and is shareable
        const { data: activity, error: activityError } = await supabaseAdmin
            .from('activities')
            .select('id, title, type, teacher_id')
            .eq('id', activityId)
            .single();

        if (activityError || !activity) {
            return new Response(JSON.stringify({
                error: 'Atividade não encontrada ou link inválido.'
            }), { status: 404 });
        }

        // 2. Create the lead student record (no Auth account needed for leads)
        const experimentalUuid = crypto.randomUUID();
        const { data: leadStudent, error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
                name: name.trim(),
                teacher_id: activity.teacher_id,
                experimental_uuid: experimentalUuid,
                level: 'Iniciante',
                language: 'Japonês',
                metadata: {
                    is_lead: true,
                    whatsapp: whatsapp.trim(),
                    email: email?.trim() || null,
                }
            })
            .select()
            .single();

        if (studentError || !leadStudent) {
            console.error('Lead creation error:', studentError);
            return new Response(JSON.stringify({
                error: 'Erro ao registrar. Tente novamente.'
            }), { status: 500 });
        }

        // 3. Create assignment with 48h expiration
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        const { data: assignment, error: assignError } = await supabaseAdmin
            .from('assignments')
            .insert({
                student_id: leadStudent.id,
                activity_id: activityId,
                teacher_id: activity.teacher_id,
                status: 'pendente',
                expires_at: expiresAt.toISOString(),
            })
            .select()
            .single();

        if (assignError || !assignment) {
            console.error('Assignment creation error:', assignError);
            // Cleanup: remove the student record we just created
            await supabaseAdmin.from('students').delete().eq('id', leadStudent.id);
            return new Response(JSON.stringify({
                error: 'Erro ao preparar sua missão. Tente novamente.'
            }), { status: 500 });
        }

        // 4. Return the redirect data (share link via experimental_uuid)
        return new Response(JSON.stringify({
            success: true,
            redirectUrl: `/share/${experimentalUuid}`,
        }), { status: 200 });

    } catch (err: any) {
        console.error('Unexpected error in lead capture:', err);
        return new Response(JSON.stringify({
            error: 'Erro inesperado. Tente novamente mais tarde.'
        }), { status: 500 });
    }
};
