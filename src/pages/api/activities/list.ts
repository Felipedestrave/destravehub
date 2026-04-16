import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    console.log('[API List Activities] Searching for teacher:', user.id);

    const { data: activities, error: dbError } = await supabaseAdmin
        .from('activities')
        .select(`
            id, 
            title, 
            type, 
            created_at, 
            config,
            folder_id,
            material_count:activity_materials(count)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

    if (dbError) {
        console.error('[API List Activities] DB Error (activities):', dbError);
        return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    console.log('[API List Activities] Found rows:', activities?.length || 0);

    const { data: students, error: stuError } = await supabaseAdmin
        .from('students')
        .select('id, name, level, student_id')
        .eq('teacher_id', user.id);

    if (stuError) {
        console.error('[API Error] Database query error (students):', stuError);
        return new Response(JSON.stringify({ error: stuError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ activities, students }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
