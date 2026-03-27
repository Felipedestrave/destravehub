import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const DELETE: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID da atividade é obrigatório.' }), { status: 400 });
    }

    try {
        // Verify ownership
        const { data: activity, error: getError } = await supabaseAdmin
            .from('activities')
            .select('teacher_id')
            .eq('id', id)
            .single();

        if (getError || !activity) {
            return new Response(JSON.stringify({ error: 'Atividade não encontrada.' }), { status: 404 });
        }

        if (activity.teacher_id !== user.id) {
            return new Response(JSON.stringify({ error: 'Sem permissão para deletar esta atividade.' }), { status: 403 });
        }

        // Delete associated assignments first (if any)
        await supabaseAdmin.from('assignments').delete().eq('activity_id', id);

        // Delete the activity
        const { error: deleteError } = await supabaseAdmin
            .from('activities')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        console.error('[API Delete Activity] Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
