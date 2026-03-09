import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import type { HistoryItem } from '../../../types/escuta';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
        }

        const body = await request.json();
        const { studentId, score, totalQuestions, history, title } = body as {
            studentId?: string;
            score: number;
            totalQuestions: number;
            history: HistoryItem[];
            title?: string;
        };

        // 1. Create activity record
        const { data: activity, error: activityError } = await supabaseAdmin
            .from('activities')
            .insert({
                teacher_id: user.id,
                title: title || 'Destrave a Escuta',
                type: 'escuta',
                config: { totalQuestions },
            })
            .select()
            .single();

        if (activityError || !activity) {
            return new Response(JSON.stringify({ error: `Erro ao criar atividade: ${activityError?.message}` }), { status: 500 });
        }

        // 2. If student is provided, create assignment record
        if (studentId) {
            const { error: assignmentError } = await supabaseAdmin
                .from('assignments')
                .insert({
                    activity_id: activity.id,
                    student_id: studentId,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    result_data: { score, totalQuestions, history },
                });

            if (assignmentError) {
                return new Response(JSON.stringify({ error: `Erro ao salvar resultado: ${assignmentError.message}` }), { status: 500 });
            }
        }

        return new Response(JSON.stringify({ success: true, activityId: activity.id }), { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
