import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { repetitionService } from '../../../lib/repetition';
import type { Json } from '../../../types/supabase';

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

    let body: { activityId: string; studentIds: string[] };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), { status: 400 });
    }

    if (!body.activityId || !body.studentIds || body.studentIds.length === 0) {
        return new Response(JSON.stringify({ error: 'activityId e ao menos um studentId são obrigatórios.' }), { status: 400 });
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
        return new Response(JSON.stringify({ error: 'Você não tem permissão para atribuir esta atividade.' }), { status: 403 });
    }

    console.log('[API Assign] Start for:', { activityId: body.activityId, teacherId: user.id });

    // Check which students already have this assignment to avoid duplicates
    const { data: existing } = await supabaseAdmin
        .from('assignments')
        .select('student_id')
        .eq('activity_id', body.activityId)
        .in('student_id', body.studentIds);

    const alreadyAssigned = new Set((existing ?? []).map((r) => (r.student_id)));
    const newStudentIds = body.studentIds.filter((id) => !alreadyAssigned.has(id));

    if (newStudentIds.length === 0) {
        console.log('[API Assign] All students already assigned.');
        return new Response(JSON.stringify({ assigned: 0, message: 'Todos os alunos selecionados já receberam esta atividade.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const now = new Date().toISOString();
    const repetitionSchedule = repetitionService.generateSchedule(now);

    const assignments = newStudentIds.map((studentId) => ({
        activity_id: body.activityId,
        student_id: studentId,
        status: 'pending',
        assigned_at: now,
        result_data: { 
            repetition: repetitionSchedule,
            scheduled_at: now 
        } as Json
    }));

    const { error: insertError } = await supabaseAdmin.from('assignments').insert(assignments);

    if (insertError) {
        console.error('[API Assign] Insert Error:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    console.log('[API Assign] Done! Assigned to:', newStudentIds.length, 'students.');

    return new Response(JSON.stringify({ assigned: newStudentIds.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
