import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { calculateMissionRewards } from '../../../lib/gamification';
import { repetitionService } from '../../../lib/repetition';
import { notificationService } from '../../../lib/notifications';
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
                .select('result_data, status, student_id')
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
            const effectiveStudentId = (studentId && studentId !== 'undefined' && studentId !== 'null') 
                ? studentId 
                : current?.student_id;
            
            if (effectiveStudentId) {
                const { data: studentRecord } = await supabaseAdmin
                    .from('students')
                    .select('student_id')
                    .eq('id', effectiveStudentId)
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
                    console.error(`[Gamification ERROR] Failed to update profile ${profileId}:`, profileError);
                    return new Response(JSON.stringify({ 
                        error: 'Erro ao creditar recompensas no banco de dados.',
                        details: profileError.message 
                    }), { status: 500 });
                }
                console.log(`[Gamification SUCCESS] Awarded ${rewards.coinsGain} DC and ${rewards.xpGain} XP to profile ${profileId}.`);
            }

            if (isReplay) {
                // --- Lógica de Repetição Esparsa (SRS) ---
                const old = current.result_data as any;
                let repetitionReward = 0;
                let repetitionMilestoneIndex = -1;

                if (old.repetition && Array.isArray(old.repetition)) {
                    // Encontrar o próximo marco pendente
                    repetitionMilestoneIndex = old.repetition.findIndex((m: any) => m.status === 'pending');
                    
                    if (repetitionMilestoneIndex !== -1) {
                        const milestone = old.repetition[repetitionMilestoneIndex];
                        const nextMilestone = old.repetition[repetitionMilestoneIndex + 1];
                        
                        const review = repetitionService.calculateReward(
                            milestone.milestone, 
                            milestone.scheduledDate, 
                            nextMilestone?.scheduledDate
                        );

                        repetitionReward = review.coins;
                        
                        // ATUALIZAÇÃO CRÍTICA: Sempre marcar como concluído para permitir o progresso no Roadmap,
                        // mesmo que a recompensa seja 0 (por atraso ou prática fora da janela).
                        old.repetition[repetitionMilestoneIndex].status = 'completed';
                        old.repetition[repetitionMilestoneIndex].completedAt = now;
                        old.repetition[repetitionMilestoneIndex].earnedCoins = repetitionReward;
                        
                        console.log(`[SRS] Student completed milestone ${milestone.milestone}. Reward: ${repetitionReward} DC.`);
                    }
                }

                // Preserving First Attempt Logic
                const newReplay = {
                    score,
                    totalQuestions,
                    history,
                    completed_at: now,
                    rewards, // Log original rewards
                    repetitionReward // Bonus reward for SRS
                };

                finalResultData = {
                    ...old,
                    replays: [...(old.replays || []), newReplay],
                    latest_practice_at: now,
                    practice_count: (old.practice_count || 1) + 1,
                    is_practice: true
                };

                // Se houve recompensa de repetição, adiciona ao perfil e ao objeto de retorno para o frontend
                if (repetitionReward > 0 && profileId) {
                    console.log(`[SRS-BONUS] Crediting SRS bonus: ${repetitionReward} DC to user ${profileId}`);
                    const { error: srsRpcError } = await supabaseAdmin.rpc('increment_gamification', {
                        user_id: profileId,
                        xp_gain: 0,
                        coins_gain: repetitionReward
                    });

                    if (srsRpcError) {
                        console.error('[SRS RPC ERROR]:', srsRpcError);
                        return new Response(JSON.stringify({ 
                            error: 'Erro ao creditar bônus de revisão.',
                            details: srsRpcError.message 
                        }), { status: 500 });
                    }
                    console.log(`[SRS SUCCESS] Awarded ${repetitionReward} DC bonus to ${profileId}`);
                    
                    // ATUALIZAÇÃO CRÍTICA: Incluir o bônus de SRS no objeto 'rewards' para transparência no frontend
                    if (rewards) {
                        rewards.coinsGain += repetitionReward;
                        rewards.xpGain += repetitionReward;
                        rewards.bonuses.push({
                            name: 'Bônus de Revisão',
                            amount: repetitionReward,
                            type: 'completion' as any,
                            reason: 'Você revisou este conteúdo no prazo!'
                        });
                    }

                    // Notificação interna
                    await notificationService.sendNotification(
                        profileId,
                        'Recompensa de Revisão! 🎯',
                        `Você completou uma revisão agendada e ganhou ${repetitionReward} DC extras!`,
                        'completion'
                    );
                }
                
                console.log(`[Save Result] Student ${studentId || 'unknown'} completed a replay of ${assignmentId}.`);
            } else {
                // First Attempt (O cronograma SRS já foi gerado na atribuição pelo professor)
                const existingData = current.result_data as any;
                
                finalResultData = {
                    ...existingData, // Preserva o 'repetition' agendado
                    score,
                    totalQuestions,
                    history,
                    title,
                    completed_at: now,
                    first_attempt_at: now,
                    practice_count: 1,
                    rewards // Primary rewards
                };
                console.log(`[Save Result] Student ${studentId || 'unknown'} completed mission ${assignmentId} for the first time. Preserving SRS schedule.`);
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

            // 1. Crédito Principal da Missão (Base Coins/XP)
            // O crédito já foi realizado acima no bloco 'if (profileId)' (linhas 75-82)
            // ou será realizado se for um Replay via SRS Bonus. 
            // Removemos a chamada redundante aqui para evitar duplicidade ou confusão.

            // --- LÓGICA DE BAÚS DO ROADMAP (NOVO) ---
            let chestReward = null;
            if (studentId && profileId) {
                try {
                    // 1. Buscar todas as tarefas e o estado dos baús
                    const { data: allAssignments } = await supabaseAdmin
                        .from('assignments')
                        .select('id, status, assigned_at')
                        .eq('student_id', studentId)
                        .order('assigned_at', { ascending: true });

                    const { data: studentRecord } = await supabaseAdmin
                        .from('students')
                        .select('metadata')
                        .eq('id', studentId)
                        .single();

                    const completedTasks = allAssignments?.filter(a => a.status === 'completed') || [];
                    const totalCompleted = completedTasks.length;
                    
                    // Garantir que metadata seja um objeto válido
                    let metadata = studentRecord?.metadata;
                    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
                        metadata = {};
                    }
                    
                    const claimedChests = (metadata as any).claimed_chests || {};
                    let metadataChanged = false;

                    // 2. Verificar se atingiu um novo baú (múltiplo de 8)
                    const currentSegment = Math.floor(totalCompleted / 8);
                    if (totalCompleted > 0 && totalCompleted % 8 === 0 && !claimedChests[currentSegment]) {
                        const totalTasksCreated = allAssignments?.length || 0;
                        const isPerfect = totalTasksCreated === totalCompleted;

                        const amount = isPerfect ? 50 : 20;
                        const type = isPerfect ? 'gold' : 'silver';

                        console.log(`[CHEST] Crediting ${amount} to user ${profileId} (Type: ${type})`);

                        const { error: rpcError } = await supabaseAdmin.rpc('increment_gamification', {
                            user_id: profileId,
                            xp_gain: amount,
                            coins_gain: amount
                        });

                        if (rpcError) {
                            console.error('[CHEST RPC ERROR]:', rpcError);
                            return new Response(JSON.stringify({ 
                                error: 'Erro ao creditar recompensa do baú.',
                                details: rpcError.message 
                            }), { status: 500 });
                        }

                        claimedChests[currentSegment] = type;
                        metadataChanged = true;
                        chestReward = { amount, type, segment: currentSegment };
                    }

                    // 3. Lógica Retroativa: Upgrade de Prata para Ouro
                    for (const seg of Object.keys(claimedChests)) {
                        if (claimedChests[seg] === 'silver') {
                            const segmentIdx = parseInt(seg);
                            const tasksInSegment = allAssignments?.slice(0, segmentIdx * 8);
                            const isNowPerfect = tasksInSegment && tasksInSegment.length >= (segmentIdx * 8) && tasksInSegment.every(t => t.status === 'completed');

                            if (isNowPerfect) {
                                await supabaseAdmin.rpc('increment_gamification', {
                                    user_id: profileId,
                                    xp_gain: 30,
                                    coins_gain: 30
                                });
                                claimedChests[seg] = 'gold';
                                metadataChanged = true;
                                
                                if (!chestReward) {
                                    chestReward = { amount: 30, type: 'upgrade', segment: segmentIdx };
                                }
                            }
                        }
                    }

                    if (metadataChanged) {
                        const newMetadata = { ...(metadata as any), claimed_chests: claimedChests };
                        await supabaseAdmin
                            .from('students')
                            .update({ metadata: newMetadata })
                            .eq('id', studentId);
                    }
                } catch (chestErr) {
                    console.error('[Chest System Error]:', chestErr);
                }
            }

            return new Response(JSON.stringify({ 
                success: true, 
                assignmentId, 
                rewards, 
                chestReward
            }), { status: 200 });
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
