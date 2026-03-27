import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    let body: { activityId: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), { status: 400 });
    }

    if (!body.activityId) {
        return new Response(JSON.stringify({ error: 'activityId é obrigatório.' }), { status: 400 });
    }

    // Verify ownership
    const { data: activity, error: activityError } = await supabaseAdmin
        .from('activities')
        .select('id, teacher_id')
        .eq('id', body.activityId)
        .single();
    
    if (activityError || !activity) {
        return new Response(JSON.stringify({ error: 'Atividade não encontrada.' }), { status: 404 });
    }

    if (activity.teacher_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Você não tem permissão para compartilhar esta atividade.' }), { status: 403 });
    }

    // Create a temporary student record
    const experimentalUuid = crypto.randomUUID();
    const { data: student, error: studentError } = await supabaseAdmin
        .from('students')
        .insert({
            teacher_id: user.id,
            name: 'Aluno Experimental',
            experimental_uuid: experimentalUuid,
        })
        .select()
        .single();

    if (studentError || !student) {
        console.error('[API ShareExperimental] Student Insert Error:', studentError);
        return new Response(JSON.stringify({ error: 'Erro ao criar aluno experimental.' }), { status: 500 });
    }

    // Create assignment for this experimental student
    const { error: assignError } = await supabaseAdmin
        .from('assignments')
        .insert({
            activity_id: body.activityId,
            student_id: student.id,
            status: 'pending',
        });

    if (assignError) {
        console.error('[API ShareExperimental] Assignment Error:', assignError);
        return new Response(JSON.stringify({ error: 'Erro ao criar atribuição.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ uuid: experimentalUuid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
