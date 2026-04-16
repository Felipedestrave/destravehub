import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export const DELETE: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID da pasta é obrigatório.' }), { status: 400 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    try {
        // Delete folder - Note: RLS or policy will handle verification that this is the user's folder
        // On delete cascade will handle subfolders if configured, otherwise we'd need recursion
        const { error } = await supabaseAdmin
            .from('activity_folders')
            .delete()
            .eq('id', id)
            .eq('teacher_id', user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
