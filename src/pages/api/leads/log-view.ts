import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { variant, visitorId } = body;

        if (!variant || !['A', 'B', 'C'].includes(variant) || !visitorId) {
            return new Response(JSON.stringify({
                error: 'Variante inválida ou Visitor ID ausente.'
            }), { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('landing_page_impressions' as any)
            .insert({
                variant,
                visitor_id: visitorId
            } as any);

        if (error) {
            console.error('Erro ao logar visualização da LP:', error);
            return new Response(JSON.stringify({
                error: 'Erro ao salvar no banco de dados.'
            }), { status: 500 });
        }

        return new Response(JSON.stringify({
            success: true
        }), { status: 200 });

    } catch (err: any) {
        console.error('Erro inesperado em log-view:', err);
        return new Response(JSON.stringify({
            error: 'Erro interno.'
        }), { status: 500 });
    }
};
