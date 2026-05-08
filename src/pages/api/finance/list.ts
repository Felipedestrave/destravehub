import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Não autorizado.' }), { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: teacher }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !teacher) return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });

        const url = new URL(request.url);
        const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth() + 1));
        const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));

        // --- Fetch all payments for this teacher in the selected month ---
        // We use a more robust date range to avoid "bleeding" between months
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate(); // month is 1-indexed in JS Date constructor for '0' day trick
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const { data: rawPayments, error: paymentsError } = await supabaseAdmin
            .from('payments' as any)
            .select('*, students(name, billing_type, billing_currency, billing_package_size, billing_package_start_date)')
            .eq('teacher_id', teacher.id)
            .gte('due_date', startDate)
            .lte('due_date', endDate)
            .order('due_date', { ascending: true });

        if (paymentsError) throw paymentsError;

        // --- Enrich payments with package usage ---
        const payments = await Promise.all((rawPayments || []).map(async (p: any) => {
            if (p.students?.billing_type === 'pacote' && p.students?.billing_package_start_date) {
                const { count } = await supabaseAdmin
                    .from('lesson_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('student_id', p.student_id)
                    .gte('created_at', p.students.billing_package_start_date);
                return { ...p, lesson_count: count || 0 };
            }
            return p;
        }));

        // --- Compute metrics ---
        const paid = payments.filter(p => p.status === 'paid');
        const pending = payments.filter(p => p.status === 'pending');
        const overdue = payments.filter(p => {
            if (p.status !== 'pending') return false;
            return new Date(p.due_date) < new Date();
        });

        const totalPaid = paid.reduce((s, p) => s + (p.amount || 0), 0);
        const totalPending = pending.reduce((s, p) => s + (p.amount || 0), 0);
        const ticketMedio = paid.length > 0 ? totalPaid / paid.length : 0;

        return new Response(JSON.stringify({
            payments: payments || [],
            metrics: { totalPaid, totalPending, overdue: overdue.length, ticketMedio },
        }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
