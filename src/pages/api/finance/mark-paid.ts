import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Não autorizado.' }), { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: teacher }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !teacher) return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });

        const { payment_id } = await request.json();
        if (!payment_id) return new Response(JSON.stringify({ error: 'payment_id obrigatório.' }), { status: 400 });

        const { data, error } = await supabaseAdmin
            .from('payments' as any)
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', payment_id)
            .eq('teacher_id', teacher.id) // Security: only own payments
            .select()
            .single();

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, payment: data }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
