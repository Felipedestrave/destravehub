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

        // --- Auto-generate monthly charges for mensalidade students ---
        const { data: mensalidadeStudents } = await supabaseAdmin
            .from('students' as any)
            .select('id, name, billing_amount, billing_currency, billing_day')
            .eq('teacher_id', teacher.id)
            .eq('billing_type', 'mensalidade')
            .not('billing_amount', 'is', null);

        for (const student of mensalidadeStudents || []) {
            if (!student.billing_day || !student.billing_amount) continue;

            const dueDate = `${year}-${String(month).padStart(2, '0')}-${String(student.billing_day).padStart(2, '0')}`;

            // Check if payment already exists for this month
            const { data: existing } = await supabaseAdmin
                .from('payments' as any as any)
                .select('id')
                .eq('student_id', student.id)
                .eq('teacher_id', teacher.id)
                .gte('due_date', `${year}-${String(month).padStart(2, '0')}-01`)
                .lte('due_date', `${year}-${String(month).padStart(2, '0')}-31`)
                .maybeSingle();

            if (!existing) {
                await supabaseAdmin.from('payments' as any as any).insert({
                    teacher_id: teacher.id,
                    student_id: student.id,
                    amount: student.billing_amount,
                    currency: student.billing_currency || 'BRL',
                    due_date: dueDate,
                    status: 'pending',
                    description: `Mensalidade ${month}/${year}`,
                });
            }
        }

        // --- Fetch all payments for this teacher in the selected month ---
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

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
