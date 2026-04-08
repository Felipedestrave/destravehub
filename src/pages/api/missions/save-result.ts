import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { calculateMissionRewards } from '../../../lib/gamification';
import type { HistoryItem } from '../../../types/escuta';

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
        const { studentId, assignmentId, score, totalQuestions, history, title, timeSpent, targetTime } = body as {
            studentId?: string;
            assignmentId?: string;
            score: number;
            totalQuestions: number;
            history: HistoryItem[];
            title?: string;
            timeSpent?: number;
            targetTime?: number;
        };

        // Case A: This is an existing assignment being completed by a student
        if (assignmentId) {
            // 1. Fetch current assignment to check for existing results
            const { data: current, error: fetchError } = await supabaseAdmin
                .from('assignments')
                .select('result_data, status')
                .eq('id', assignmentId)
                .single();

            if (fetchError) {
                return new Response(JSON.stringify({ error: `Erro ao buscar missão: ${fetchError.message}` }), { status: 500 });
            }

            const now = new Date().toISOString();
            let finalResultData: any;
            let rewards = null;
            const isReplay = !!(current && current.status === 'completed');

            // 2. Calculate Gamification Rewards (XP/Coins)
            // But only if we have a registered student (with an official profile)
            let profileId: string | null = null;
            if (studentId) {
                const { data: studentRecord } = await supabaseAdmin
                    .from('students')
                    .select('student_id')
                    .eq('id', studentId)
                    .single();
                profileId = studentRecord?.student_id || null;
            }

            if (profileId) {
                rewards = calculateMissionRewards({
                    score,
                    totalQuestions,
                    timeSpent,
                    targetTime,
                    isReplay
                });

                // Update Profile with new XP and Coins
                const { error: profileError } = await supabaseAdmin.rpc(
                    'increment_gamification',
                    { 
                        user_id: profileId, 
                        xp_gain: rewards.xpGain, 
                        coins_gain: rewards.coinsGain 
                    }
                );

                if (profileError) {
                    console.error(`[Gamification] Error updating profile ${profileId}:`, profileError);
                    // We don't block the save if gamification fails, but we log it
                } else {
                    console.log(`[Gamification] Awarded ${rewards.coinsGain} DC and ${rewards.xpGain} XP to profile ${profileId}.`);
                }
            }

            if (isReplay) {
                // Preserving First Attempt Logic
                const old = current.result_data as any;
                const newReplay = {
                    score,
                    totalQuestions,
                    history,
                    completed_at: now,
                    rewards // Log rewards in the replay record too
                };

                finalResultData = {
                    ...old,
                    replays: [...(old.replays || []), newReplay],
                    latest_practice_at: now,
                    practice_count: (old.practice_count || 1) + 1,
                    is_practice: true
                };
                
                console.log(`[Save Result] Student ${studentId || 'unknown'} completed a replay of ${assignmentId}. Preserving original score.`);
            } else {
                // First Attempt
                finalResultData = {
                    score,
                    totalQuestions,
                    history,
                    title,
                    completed_at: now,
                    first_attempt_at: now,
                    practice_count: 1,
                    rewards // Primary rewards
                };
                console.log(`[Save Result] Student ${studentId || 'unknown'} completed mission ${assignmentId} for the first time.`);
            }

            const { error: updateError } = await supabaseAdmin
                .from('assignments')
                .update({
                    status: 'completed',
                    completed_at: now,
                    result_data: finalResultData,
                })
                .eq('id', assignmentId);

            if (updateError) {
                return new Response(JSON.stringify({ error: `Erro ao atualizar missão: ${updateError.message}` }), { status: 500 });
            }

            return new Response(JSON.stringify({ success: true, assignmentId, rewards }), { status: 200 });
        }

        // Case B: This is a new activity being created (e.g., from PDF upload)
        const { data: activity, error: activityError } = await supabaseAdmin
            .from('activities')
            .insert({
                teacher_id: user.id,
                title: title || 'Destrave a Escuta',
                type: 'escuta',
                config: { totalQuestions },
            })
            .select()
            .single();

        if (activityError || !activity) {
            return new Response(JSON.stringify({ error: `Erro ao criar atividade: ${activityError?.message}` }), { status: 500 });
        }

        // 2. If student is provided, create assignment record
        if (studentId) {
            const { error: assignmentError } = await supabaseAdmin
                .from('assignments')
                .insert({
                    activity_id: activity.id,
                    student_id: studentId,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    result_data: { score, totalQuestions, history } as any,
                });

            if (assignmentError) {
                return new Response(JSON.stringify({ error: `Erro ao salvar resultado: ${assignmentError.message}` }), { status: 500 });
            }
        }

        return new Response(JSON.stringify({ success: true, activityId: activity.id }), { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
