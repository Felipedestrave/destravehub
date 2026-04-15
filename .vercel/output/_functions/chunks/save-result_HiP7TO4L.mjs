import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const REWARDS_CONFIG = {
  COMPLETION_BASE: 20,
  ACCURACY_BONUS: 15,
  SPEED_BONUS: 20,
  REPLAY_MULTIPLIER: 0.1
  // Apenas 10% do valor base para replays de estudo
};
function calculateMissionRewards(params) {
  const { score, timeSpent, targetTime, isReplay } = params;
  const result = {
    xpGain: 0,
    coinsGain: 0,
    bonuses: []
  };
  const baseCoins = REWARDS_CONFIG.COMPLETION_BASE;
  result.bonuses.push({
    name: "Missão Concluída",
    amount: baseCoins,
    type: "completion",
    reason: "Você terminou o conteúdo!"
  });
  if (score >= 100) {
    result.bonuses.push({
      name: "Foco Total",
      amount: REWARDS_CONFIG.ACCURACY_BONUS,
      type: "accuracy",
      reason: "100% de precisão estratégica!"
    });
  }
  if (timeSpent && targetTime && timeSpent <= targetTime) {
    result.bonuses.push({
      name: "Flash Speed",
      amount: REWARDS_CONFIG.SPEED_BONUS,
      type: "speed",
      reason: "Domínio e fluidez no tempo alvo!"
    });
  }
  let totalCoins = result.bonuses.reduce((acc, b) => acc + b.amount, 0);
  if (isReplay) {
    totalCoins = Math.ceil(totalCoins * REWARDS_CONFIG.REPLAY_MULTIPLIER);
  }
  result.coinsGain = totalCoins;
  result.xpGain = totalCoins;
  return result;
}

const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Autorização necessária." }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida." }), { status: 401 });
    }
    const body = await request.json();
    const { studentId, assignmentId, score, totalQuestions, history, title, timeSpent, targetTime } = body;
    if (assignmentId) {
      const { data: current, error: fetchError } = await supabaseAdmin.from("assignments").select("result_data, status").eq("id", assignmentId).single();
      if (fetchError) {
        return new Response(JSON.stringify({ error: `Erro ao buscar missão: ${fetchError.message}` }), { status: 500 });
      }
      const now = (/* @__PURE__ */ new Date()).toISOString();
      let finalResultData;
      let rewards = null;
      const isReplay = !!(current && current.status === "completed");
      let profileId = null;
      if (studentId) {
        const { data: studentRecord } = await supabaseAdmin.from("students").select("student_id").eq("id", studentId).single();
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
        const { error: profileError } = await supabaseAdmin.rpc(
          "increment_gamification",
          {
            user_id: profileId,
            xp_gain: rewards.xpGain,
            coins_gain: rewards.coinsGain
          }
        );
        if (profileError) {
          console.error(`[Gamification] Error updating profile ${profileId}:`, profileError);
        } else {
          console.log(`[Gamification] Awarded ${rewards.coinsGain} DC and ${rewards.xpGain} XP to profile ${profileId}.`);
        }
      }
      if (isReplay) {
        const old = current.result_data;
        const newReplay = {
          score,
          totalQuestions,
          history,
          completed_at: now,
          rewards
          // Log rewards in the replay record too
        };
        finalResultData = {
          ...old,
          replays: [...old.replays || [], newReplay],
          latest_practice_at: now,
          practice_count: (old.practice_count || 1) + 1,
          is_practice: true
        };
        console.log(`[Save Result] Student ${studentId || "unknown"} completed a replay of ${assignmentId}. Preserving original score.`);
      } else {
        finalResultData = {
          score,
          totalQuestions,
          history,
          title,
          completed_at: now,
          first_attempt_at: now,
          practice_count: 1,
          rewards
          // Primary rewards
        };
        console.log(`[Save Result] Student ${studentId || "unknown"} completed mission ${assignmentId} for the first time.`);
      }
      const { error: updateError } = await supabaseAdmin.from("assignments").update({
        status: "completed",
        completed_at: now,
        result_data: finalResultData
      }).eq("id", assignmentId);
      if (updateError) {
        return new Response(JSON.stringify({ error: `Erro ao atualizar missão: ${updateError.message}` }), { status: 500 });
      }
      return new Response(JSON.stringify({ success: true, assignmentId, rewards }), { status: 200 });
    }
    const { data: activity, error: activityError } = await supabaseAdmin.from("activities").insert({
      teacher_id: user.id,
      title: title || "Destrave a Escuta",
      type: "escuta",
      config: { totalQuestions }
    }).select().single();
    if (activityError || !activity) {
      return new Response(JSON.stringify({ error: `Erro ao criar atividade: ${activityError?.message}` }), { status: 500 });
    }
    if (studentId) {
      const { error: assignmentError } = await supabaseAdmin.from("assignments").insert({
        activity_id: activity.id,
        student_id: studentId,
        status: "completed",
        completed_at: (/* @__PURE__ */ new Date()).toISOString(),
        result_data: { score, totalQuestions, history }
      });
      if (assignmentError) {
        return new Response(JSON.stringify({ error: `Erro ao salvar resultado: ${assignmentError.message}` }), { status: 500 });
      }
    }
    return new Response(JSON.stringify({ success: true, activityId: activity.id }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
