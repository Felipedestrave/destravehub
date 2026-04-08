import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const checkId = url.searchParams.get('id') || '76d21cfc-3e08-4111-805b-beb7233aa6d6';

    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', checkId)
        .single();

    return new Response(JSON.stringify({
        id: checkId,
        profile,
        error: error ? error.message : null
    }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
    });
}
