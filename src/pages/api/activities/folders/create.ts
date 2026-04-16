import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

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

    try {
        const { name, parent_id } = await request.json();

        if (!name) {
            return new Response(JSON.stringify({ error: 'Nome da pasta é obrigatório.' }), { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('activity_folders')
            .insert({
                name,
                parent_id: parent_id || null,
                teacher_id: user.id
            })
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify({ folder: data }), { status: 201 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
