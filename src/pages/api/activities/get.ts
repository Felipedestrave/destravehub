import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token === 'undefined') {
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
        console.log('[API Get Activity] Fetching activity:', id);

        const { data: activity, error: dbError } = await supabaseAdmin
            .from('activities')
            .select('*')
            .eq('id', id)
            .single();

        if (dbError) {
            console.error('[API Get Activity] DB Error:', dbError);
            return new Response(JSON.stringify({ error: 'Atividade não encontrada.' }), { status: 404 });
        }

        return new Response(JSON.stringify({ activity }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('[API Get Activity] Unexpected Error:', err);
        return new Response(JSON.stringify({ error: 'Erro interno ao buscar atividade.' }), { status: 500 });
    }
};
