import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { getItemById } from '../../../lib/store';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Sessão inválida' }), { status: 401 });
        }

        const { itemId } = await request.json();
        const item = getItemById(itemId);

        if (!item) {
            return new Response(JSON.stringify({ error: 'Item não encontrado' }), { status: 404 });
        }

        // 1. Buscar perfil do usuário
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('coins, inventory')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return new Response(JSON.stringify({ error: 'Perfil não encontrado' }), { status: 404 });
        }

        // 2. Validar saldo
        if ((profile.coins || 0) < item.price) {
            return new Response(JSON.stringify({ error: 'Saldo insuficiente' }), { status: 400 });
        }

        // 3. Validar se já possui
        const currentInventory = (profile.inventory as string[]) || [];
        if (currentInventory.includes(item.id)) {
            return new Response(JSON.stringify({ error: 'Item já adquirido' }), { status: 400 });
        }

        // 4. Efetuar compra (atômico)
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                coins: (profile.coins || 0) - item.price,
                inventory: [...currentInventory, item.id]
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        return new Response(JSON.stringify({
            success: true,
            item,
            newBalance: updatedProfile.coins
        }), { status: 200 });

    } catch (err: any) {
        console.error('[Store Purchase Error]', err);
        return new Response(JSON.stringify({ error: 'Erro interno ao processar compra' }), { status: 500 });
    }
};
