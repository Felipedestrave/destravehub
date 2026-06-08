import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { notificationService } from '../../../lib/notifications';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
        }

        const body = await request.json();
        const { segment, type } = body as { segment: number; type: 'silver' | 'gold' | 'upgrade' };

        if (segment === undefined || !type) {
            return new Response(JSON.stringify({ error: 'Parâmetros inválidos.' }), { status: 400 });
        }

        // Get student record for metadata
        const { data: studentRecord, error: studentError } = await supabaseAdmin
            .from('students')
            .select('id, metadata, student_id')
            .eq('student_id', user.id)
            .single();

        if (studentError || !studentRecord) {
            return new Response(JSON.stringify({ error: 'Aluno não encontrado.' }), { status: 404 });
        }

        let metadata = studentRecord.metadata;
        if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
            metadata = {};
        }

        const claimedChests = (metadata as any).claimed_chests || {};
        
        // Validation logic
        const currentClaimedType = claimedChests[segment];
        
        if (currentClaimedType === 'gold') {
             return new Response(JSON.stringify({ error: 'Baú de ouro já resgatado.' }), { status: 400 });
        }
        
        if (type === 'silver' && currentClaimedType === 'silver') {
             return new Response(JSON.stringify({ error: 'Baú de prata já resgatado.' }), { status: 400 });
        }

        // Calculate reward amount
        let amount = 0;
        if ((type === 'gold' || type === 'upgrade') && currentClaimedType === 'silver') {
            amount = 30; // Upgrade from silver to gold
        } else if (type === 'gold') {
            amount = 50; // Direct gold
        } else if (type === 'silver') {
            amount = 20; // Direct silver
        }

        // Credit coins
        if (amount > 0) {
            const { error: rpcError } = await supabaseAdmin.rpc('increment_gamification', {
                user_id: user.id,
                xp_gain: amount,
                coins_gain: amount
            });

            if (rpcError) {
                console.error('[CHEST RPC ERROR]:', rpcError);
                return new Response(JSON.stringify({ error: 'Erro ao creditar recompensa.', details: rpcError.message }), { status: 500 });
            }
        }

        // Update metadata
        claimedChests[segment] = (type === 'upgrade' || type === 'gold') ? 'gold' : 'silver';
        const newMetadata = { ...(metadata as any), claimed_chests: claimedChests };

        const { error: updateError } = await supabaseAdmin
            .from('students')
            .update({ metadata: newMetadata })
            .eq('id', studentRecord.id);

        if (updateError) {
            return new Response(JSON.stringify({ error: 'Erro ao salvar resgate no perfil.' }), { status: 500 });
        }
        
        // Notify
        await notificationService.sendNotification(
            user.id,
            type === 'silver' ? 'Baú de Prata Aberto! 🎁' : 'Baú de Ouro Aberto! 🏆',
            `Você resgatou +${amount} DC no Meu Caminho!`,
            'gamification'
        );

        return new Response(JSON.stringify({ success: true, amount, claimedChests }), { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
