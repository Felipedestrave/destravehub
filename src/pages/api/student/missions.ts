import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No authorization header' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        }

        // 1. Find student record using Admin client (bypassing RLS)
        const { data: student, error: sErr } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('student_id', user.id)
            .maybeSingle();

        if (sErr || !student) {
            return new Response(JSON.stringify({ error: 'Student record not found' }), { status: 404 });
        }

        // Auto-limpeza: Deletar tarefas que não estejam concluídas (status pending/in_progress) e tenham mais de 60 dias de atraso
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 60);

        const { error: cleanupError } = await supabaseAdmin
            .from('assignments')
            .delete()
            .eq('student_id', student.id)
            .in('status', ['pending', 'in_progress'])
            .lt('assigned_at', limitDate.toISOString());

        if (cleanupError) {
            console.error('[API Student Missions] Error cleaning up old assignments:', cleanupError);
        }

        // 2. Fetch assignments with activities
        const { data: missions, error: mErr } = await supabaseAdmin
            .from('assignments')
            .select(`
                *,
                activities (
                    id,
                    title,
                    type,
                    config
                )
            `)
            .eq('student_id', student.id)
            .order('assigned_at', { ascending: false });

        if (mErr) {
            return new Response(JSON.stringify({ error: 'Error fetching missions' }), { status: 500 });
        }

        return new Response(JSON.stringify({ missions }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
