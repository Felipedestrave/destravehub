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

        const { student_id, amount, currency, due_date, description } = await request.json();

        if (!student_id || !amount) {
            return new Response(JSON.stringify({ error: 'student_id e amount são obrigatórios.' }), { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('payments' as any)
            .insert({
                teacher_id: teacher.id,
                student_id,
                amount: parseFloat(amount),
                currency: currency || 'BRL',
                due_date: due_date || new Date().toISOString().split('T')[0],
                status: 'pending',
                description: description || 'Cobrança Manual',
            })
            .select()
            .single();

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, payment: data }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
