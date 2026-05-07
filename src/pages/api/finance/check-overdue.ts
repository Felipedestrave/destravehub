import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ isOverdue: false }), { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return new Response(JSON.stringify({ isOverdue: false }), { status: 401 });

        // Get student record ID
        const { data: studentData } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('student_id', user.id)
            .maybeSingle();

        if (!studentData) return new Response(JSON.stringify({ isOverdue: false }), { status: 200 });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Check overdue
        const { data: overdues } = await supabaseAdmin
            .from('payments' as any)
            .select('id')
            .eq('student_id', studentData.id)
            .eq('status', 'pending')
            .lt('due_date', thirtyDaysAgo)
            .limit(1);

        const isOverdue = overdues && overdues.length > 0;

        return new Response(JSON.stringify({ isOverdue }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ isOverdue: false }), { status: 500 });
    }
};
