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

    const { id } = await request.json();

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID da atividade é obrigatório.' }), { status: 400 });
    }

    try {
        // Fetch original
        const { data: original, error: getError } = await supabaseAdmin
            .from('activities')
            .select('*')
            .eq('id', id)
            .single();

        if (getError || !original) {
            return new Response(JSON.stringify({ error: 'Atividade original não encontrada.' }), { status: 404 });
        }

        if (original.teacher_id !== user.id) {
            return new Response(JSON.stringify({ error: 'Sem permissão para duplicar esta atividade.' }), { status: 403 });
        }

        // New record
        const { data: copy, error: insertError } = await supabaseAdmin
            .from('activities')
            .insert({
                title: `${original.title} (Cópia)`,
                type: original.type,
                config: original.config,
                teacher_id: user.id
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return new Response(JSON.stringify({ success: true, activity: copy }), { status: 200 });
    } catch (err: any) {
        console.error('[API Duplicate Activity] Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
