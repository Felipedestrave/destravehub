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

        const { month, year } = await request.json();
        if (!month || !year) {
            return new Response(JSON.stringify({ error: 'Mês e ano são obrigatórios.' }), { status: 400 });
        }

        // 1. Fetch students with 'mensalidade' billing
        const { data: students } = await supabaseAdmin
            .from('students' as any)
            .select('id, name, billing_amount, billing_currency, billing_day')
            .eq('teacher_id', teacher.id)
            .eq('billing_type', 'mensalidade')
            .not('billing_amount', 'is', null) as any;

        let createdCount = 0;

        for (const student of (students as any[]) || []) {
            if (!student.billing_day || !student.billing_amount) continue;

            const dueDate = `${year}-${String(month).padStart(2, '0')}-${String(student.billing_day).padStart(2, '0')}`;

            // Check if payment already exists for this exact month
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

            const { data: existing } = await supabaseAdmin
                .from('payments' as any)
                .select('id')
                .eq('student_id', student.id)
                .eq('teacher_id', teacher.id)
                .gte('due_date', startDate)
                .lte('due_date', endDate)
                .maybeSingle() as any;

            if (!existing) {
                const { error: insertError } = await supabaseAdmin
                    .from('payments' as any)
                    .insert({
                        teacher_id: teacher.id,
                        student_id: student.id,
                        amount: student.billing_amount,
                        currency: student.billing_currency || 'BRL',
                        due_date: dueDate,
                        status: 'pending',
                        description: `Mensalidade ${month}/${year}`,
                    });
                
                if (!insertError) createdCount++;
            }
        }

        return new Response(JSON.stringify({ success: true, createdCount }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
