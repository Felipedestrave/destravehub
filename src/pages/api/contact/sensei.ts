import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const teacherId = url.searchParams.get('teacherId');
    const text = url.searchParams.get('text') || 'Olá Sensei!';

    if (!teacherId) {
        return new Response('Teacher ID missing', { status: 400 });
    }

    try {
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('whatsapp')
            .eq('id', teacherId)
            .single();

        if (error || !profile || !profile.whatsapp) {
            // Se o professor não tiver cadastrado o whatsApp, redireciona de volta com erro
            return new Response(`Erro: O professor (ID: ${teacherId}) ainda não configurou o WhatsApp no sistema. (Status: ${error ? 'DB Error: '+error.message : 'No WhatsApp data'})`, { status: 404 });
        }

        const cleanNumber = profile.whatsapp.replace(/\D/g, ''); // Garante que só tenham números
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
        
        return Response.redirect(whatsappUrl, 302);
    } catch (err) {
        return new Response('Erro no servidor', { status: 500 });
    }
}
