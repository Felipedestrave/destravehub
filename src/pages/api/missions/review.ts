import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
        }

        const body = await request.json();
        const { assignmentId, history, score } = body;

        if (!assignmentId || !history) {
            return new Response(JSON.stringify({ error: 'Dados incompletos para revisão.' }), { status: 400 });
        }

        // 1. Buscar o resultado atual para preservar metadados como replays
        const { data: current, error: fetchError } = await supabaseAdmin
            .from('assignments')
            .select('result_data')
            .eq('id', assignmentId)
            .single();

        if (fetchError) throw fetchError;

        const updatedResultData = {
            ...(current.result_data as any),
            history,
            score,
            reviewed_at: new Date().toISOString(),
            is_partial: false // Agora está validado pelo professor
        };

        // 2. Atualizar o assignment
        const { error: updateError } = await supabaseAdmin
            .from('assignments')
            .update({
                result_data: updatedResultData
            })
            .eq('id', assignmentId);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
