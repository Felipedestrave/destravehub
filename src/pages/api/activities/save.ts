import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import type { Json } from '../../../types/supabase';

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token === 'undefined') {
        return new Response(JSON.stringify({ error: 'Sessão expirada ou não autenticada.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Usuário não encontrado ou token inválido.' }), { status: 401 });
    }

    let body: { title: string; type: string; config: any };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Dados inválidos.' }), { status: 400 });
    }

    if (!body.title || !body.type || !body.config) {
        return new Response(JSON.stringify({ error: 'Título, tipo e configuração são obrigatórios.' }), { status: 400 });
    }

    try {
        console.log('[API Save Activity] Attempting to save:', { teacherId: user.id, type: body.type, title: body.title });
        
        const { data, error: dbError } = await supabaseAdmin
            .from('activities')
            .insert({
                teacher_id: user.id,
                type: body.type,
                title: body.title,
                config: body.config as Json,
            })
            .select('id')
            .single();

        if (dbError) {
            console.error('[API Save Activity] DB Error:', dbError);
            return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
        }

        console.log('[API Save Activity] SUCCESS! Created ID:', data.id);

        return new Response(JSON.stringify({ success: true, activityId: data.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('[Activities] Unexpected Error:', err);
        return new Response(JSON.stringify({ error: 'Erro inesperado ao salvar.' }), { status: 500 });
    }
};
