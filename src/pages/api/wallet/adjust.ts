import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    try {
        const { targetUserId, amount, description, type = 'adjustment' } = await request.json();

        if (!targetUserId || typeof amount !== 'number') {
            return new Response(JSON.stringify({ error: 'Parâmetros inválidos.' }), { status: 400 });
        }

        // 1. Get current balance
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('coins')
            .eq('id', targetUserId)
            .single();

        if (profileError) throw profileError;

        const newBalance = (profile.coins || 0) + amount;

        // 2. Update profile balance
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ coins: newBalance })
            .eq('id', targetUserId);

        if (updateError) throw updateError;

        // 3. Log transaction
        const { error: logError } = await supabaseAdmin
            .from('wallet_transactions')
            .insert({
                user_id: targetUserId,
                teacher_id: user.id,
                amount: amount,
                type: type,
                description: description || (amount > 0 ? 'Bônus do Professor' : 'Ajuste do Professor')
            });

        // We don't fail the whole request if logging fails, but it's important
        if (logError) console.error('[Wallet] Error logging transaction:', logError);

        return new Response(JSON.stringify({ 
            success: true, 
            newBalance,
            msg: `Saldo atualizado: ${newBalance} moedas.` 
        }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
