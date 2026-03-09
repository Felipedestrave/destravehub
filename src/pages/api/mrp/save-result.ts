import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import type { MrpUserAnswer, MrpConfig } from '../../../types/mrp';
import type { Json } from '../../../types/supabase';

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    let body: {
        config: MrpConfig;
        answers: MrpUserAnswer[];
        totalScore: number;
        percentage: number;
        rankLabel: string;
    };

    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // If no token, skip persistence (experimental mode)
    if (!token) {
        return new Response(JSON.stringify({ saved: false, reason: 'no-auth' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return new Response(JSON.stringify({ saved: false, reason: 'invalid-token' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const configPayload: Json = {
            level: body.config.level,
            mode: body.config.mode,
            quantity: body.config.quantity,
            result: {
                totalScore: body.totalScore,
                percentage: body.percentage,
                rankLabel: body.rankLabel,
                completedAt: new Date().toISOString(),
                answers: body.answers as unknown as Json,
            },
        };

        const { error: dbError } = await supabaseAdmin.from('activities').insert({
            teacher_id: user.id,
            type: 'mrp',
            title: `MRP — ${body.config.level} (${body.config.mode})`,
            config: configPayload,
        });

        if (dbError) {
            console.error('[MRP] Erro ao salvar resultado:', dbError);
            return new Response(JSON.stringify({ saved: false, reason: dbError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ saved: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('[MRP] Erro inesperado no save-result:', err);
        return new Response(JSON.stringify({ saved: false, reason: 'unexpected-error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
