import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida' }), { status: 401 });
        }

        const { equipped } = await request.json();

        // Salvar novos itens equipados no perfil
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ equipped })
            .eq('id', user.id);

        if (updateError) {
            throw updateError;
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        console.error('[Store Equip Error]', {
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint
        });
        return new Response(JSON.stringify({ 
            error: 'Erro ao equipar item', 
            details: err.message 
        }), { status: 500 });
    }
};
