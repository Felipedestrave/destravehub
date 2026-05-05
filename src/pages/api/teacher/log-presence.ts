import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
        }

        // 1. Verify Teacher Session
        const token = authHeader.replace('Bearer ', '');
        const { data: { user: teacher }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !teacher) {
            return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
        }

        const body = await request.json();
        const { 
            appointmentId, 
            studentInternalId, 
            studentProfileId,
            topics,
            engagement,
            duration,
            notes,
            nextPlan,
            selectedMaterials 
        } = body;

        if (!appointmentId || !studentInternalId) {
            return new Response(JSON.stringify({ error: 'Dados incompletos.' }), { status: 400 });
        }

        // 2. Gamification Logic (using Admin to bypass RLS)
        let coinsGained = 0;
        let newStreak = 1;

        if (studentProfileId) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('attendance_streak')
                .eq('id', studentProfileId)
                .single();

            const currentStreak = profile?.attendance_streak || 0;
            coinsGained = Math.min(10 + (currentStreak * 2), 20);
            newStreak = currentStreak + 1;

            // Grant coins and XP
            const { error: rpcError } = await supabaseAdmin.rpc('increment_gamification', {
                user_id: studentProfileId,
                xp_gain: 50,
                coins_gain: coinsGained
            });

            if (rpcError) {
                console.error(`[Gamification Error] Failed to give coins to ${studentProfileId}:`, rpcError);
                throw new Error(`Erro ao creditar recompensas de gamificação: ${rpcError.message}`);
            }

            // Update streak
            await supabaseAdmin
                .from('profiles')
                .update({ attendance_streak: newStreak })
                .eq('id', studentProfileId);
        }

        // 3. Create Lesson Log
        const { error: logError } = await supabaseAdmin.from('lesson_logs').insert({
            student_id: studentInternalId,
            teacher_id: teacher.id,
            topics: (Array.isArray(topics) ? topics : [topics || 'Aula']) as any,
            notes: JSON.stringify({
                engagement,
                duration,
                general_notes: notes,
                next_class_plan: nextPlan
            })
        });

        if (logError) throw logError;

        // 4. Share Materials
        if (selectedMaterials && selectedMaterials.length > 0) {
            await supabaseAdmin
                .from('materials')
                .update({ student_id: studentInternalId })
                .in('id', selectedMaterials);
        }

        // 5. Update Appointment
        const { data: app } = await supabaseAdmin
            .from('appointments')
            .select('description')
            .eq('id', appointmentId)
            .single();

        const newDesc = (app?.description || '') + ' [PRESENÇA]';
        await supabaseAdmin
            .from('appointments')
            .update({ description: newDesc })
            .eq('id', appointmentId);

        return new Response(JSON.stringify({ 
            success: true, 
            coinsGained, 
            newStreak,
            message: studentProfileId ? `+${coinsGained} Coins (Streak: ${newStreak})` : 'Presença registrada (Sem bônus: aluno inativo).'
        }), { status: 200 });

    } catch (err: any) {
        console.error('[LogPresence Error]:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
