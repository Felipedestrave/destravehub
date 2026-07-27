import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, whatsapp, level, variant } = body;

        // Input validation
        if (!name?.trim() || !whatsapp?.trim() || !level || !variant) {
            return new Response(JSON.stringify({
                error: 'Nome, WhatsApp, nível e variante são obrigatórios.'
            }), { status: 400 });
        }

        // Validate variant
        if (!['A', 'B', 'C'].includes(variant)) {
            return new Response(JSON.stringify({
                error: 'Variante A/B inválida.'
            }), { status: 400 });
        }

        // Validate level
        const validLevels = ['Iniciante do Zero', 'Já estudei / Sei o básico', 'Intermediário / Avançado'];
        if (!validLevels.includes(level)) {
            return new Response(JSON.stringify({
                error: 'Nível inválido.'
            }), { status: 400 });
        }

        // Find Felipe Sensei's profile ID
        let teacherId = '76d21cfc-3e08-4c11-805b-beb7233aa6d6'; // Fallback
        const { data: felipeProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .ilike('display_name', '%Felipe%')
            .limit(1)
            .maybeSingle();

        if (felipeProfile?.id) {
            teacherId = felipeProfile.id;
        }

        // Create the lead student record
        const experimentalUuid = crypto.randomUUID();
        const { data: leadStudent, error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
                name: name.trim(),
                teacher_id: teacherId,
                experimental_uuid: experimentalUuid,
                level: level,
                language: 'Japonês',
                metadata: {
                    is_lead: true,
                    origin: 'landing_page',
                    status: 'Novo',
                    ab_variant: variant,
                    whatsapp: whatsapp.trim()
                }
            })
            .select()
            .single();

        if (studentError || !leadStudent) {
            console.error('Landing Page Lead capture error:', studentError);
            return new Response(JSON.stringify({
                error: 'Erro ao registrar no banco de dados. Tente novamente.'
            }), { status: 500 });
        }

        // Return success and details for client-side redirection
        return new Response(JSON.stringify({
            success: true,
            name: name.trim(),
            level: level,
            whatsapp: whatsapp.trim()
        }), { status: 200 });

    } catch (err: any) {
        console.error('Unexpected error in landing-capture:', err);
        return new Response(JSON.stringify({
            error: 'Erro inesperado. Tente novamente mais tarde.'
        }), { status: 500 });
    }
};
