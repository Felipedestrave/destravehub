import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const PUT: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    try {
        const { activityId, folderId } = await request.json();

        if (!activityId) {
            return new Response(JSON.stringify({ error: 'ID da atividade é obrigatório.' }), { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('activities')
            .update({ folder_id: folderId || null })
            .eq('id', activityId)
            .eq('teacher_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify({ activity: data }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
