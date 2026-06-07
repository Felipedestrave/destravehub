import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { calculateMissionRewards } from '../../../lib/gamification';
import { notificationService } from '../../../lib/notifications';

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
    }

    // Fetch student profile metadata
    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('metadata')
      .eq('student_id', user.id)
      .maybeSingle();

    if (fetchError || !student) {
      return new Response(JSON.stringify({ error: 'Registro do aluno não encontrado.' }), { status: 404 });
    }

    const metadata = student.metadata && typeof student.metadata === 'object' && !Array.isArray(student.metadata) 
      ? student.metadata as Record<string, any> 
      : {};

    const completedProgress = metadata.completed_kana_lessons || {
      hiragana: [],
      katakana: []
    };

    return new Response(JSON.stringify({ completedProgress }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida.' }), { status: 401 });
    }

    const body = await request.json();
    const { module, lessonId, score } = body as {
      module: 'hiragana' | 'katakana';
      lessonId: number;
      score: number; // 0-100 percentage
    };

    if (!module || !['hiragana', 'katakana'].includes(module) || isNaN(lessonId)) {
      return new Response(JSON.stringify({ error: 'Payload de requisição inválido.' }), { status: 400 });
    }

    // 1. Fetch current student record
    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('id, metadata')
      .eq('student_id', user.id)
      .maybeSingle();

    if (fetchError || !student) {
      return new Response(JSON.stringify({ error: 'Registro do aluno não encontrado.' }), { status: 404 });
    }

    let metadata = student.metadata && typeof student.metadata === 'object' && !Array.isArray(student.metadata)
      ? { ...student.metadata } as Record<string, any>
      : {};

    if (!metadata.completed_kana_lessons) {
      metadata.completed_kana_lessons = {
        hiragana: [],
        katakana: []
      };
    }

    const completedList = metadata.completed_kana_lessons[module] || [];
    const isReplay = completedList.includes(lessonId);

    // 2. Calculate Rewards using gamification module
    const rewards = calculateMissionRewards({
      score,
      totalQuestions: 10,
      isReplay
    });

    // 3. Update profile with new XP and Coins
    const { error: profileError } = await supabaseAdmin.rpc(
      'increment_gamification',
      {
        user_id: user.id,
        xp_gain: rewards.xpGain,
        coins_gain: rewards.coinsGain
      }
    );

    if (profileError) {
      console.error('[Kana Reward Error] Failed to update gamification:', profileError);
      return new Response(JSON.stringify({
        error: 'Erro ao creditar recompensas no banco de dados.',
        details: profileError.message
      }), { status: 500 });
    }

    // 4. Update student metadata if first time completed
    if (!isReplay) {
      metadata.completed_kana_lessons[module] = [...completedList, lessonId];
      const { error: updateError } = await supabaseAdmin
        .from('students')
        .update({ metadata })
        .eq('id', student.id);

      if (updateError) {
        console.error('[Kana Reward Error] Failed to update student progress:', updateError);
        return new Response(JSON.stringify({
          error: 'Erro ao salvar progresso de lições do aluno.',
          details: updateError.message
        }), { status: 500 });
      }
    }

    // 5. Trigger in-app notification
    const moduleName = module === 'hiragana' ? 'Hiragana' : 'Katakana';
    await notificationService.sendNotification(
      user.id,
      'Lição de Kana Concluída! 🇯🇵',
      `Você concluiu a Lição ${lessonId} (${moduleName}) com ${score}% de acertos e ganhou ${rewards.coinsGain} DC!`,
      'completion'
    );

    return new Response(JSON.stringify({ success: true, rewards }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
