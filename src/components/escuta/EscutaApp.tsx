import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UploadScreen } from './UploadScreen';
import { EscutaReview } from './EscutaReview';
import { GameScreen } from './GameScreen';
import { ResultScreen } from './ResultScreen';
import { RoleGuard } from '../shared/RoleGuard';
import { AdvancedLoading } from '../shared/AdvancedLoading';
import { Volume2, Music, Mic2 } from 'lucide-react';
import {
    Difficulty,
    POINTS_CONFIG,
    type GameConfig,
    type GameResult,
    type GameStatus,
    type GeneratedData,
    type HistoryItem,
    type Question,
} from '../../types/escuta';

interface EscutaAppProps {
    userToken?: string;
    assignmentId?: string;
    editingId?: string;
    initialData?: GeneratedData[];
    initialConfig?: GameConfig;
    initialQuestions?: Question[];
    initialTitle?: string;
    publicAccess?: boolean;
    activityId?: string;
}

export const EscutaApp: React.FC<EscutaAppProps> = ({ 
    userToken, 
    assignmentId, 
    editingId, 
    initialData, 
    initialConfig, 
    initialQuestions, 
    initialTitle, 
    publicAccess,
    activityId
}) => {
    const [status, setStatus] = useState<GameStatus>(
        editingId && (initialData || initialQuestions) ? 'REVIEW' : 
        (initialQuestions ? 'PLAYING' : (initialData ? 'PLAYING' : 'UPLOAD'))
    );
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [allQuestions, setAllQuestions] = useState<Question[]>(initialQuestions || []);
    const [questionsQueue, setQuestionsQueue] = useState<Question[]>(initialData?.slice(1).map(d => d.question) || []);
    const [currentData, setCurrentData] = useState<GeneratedData | null>(initialData?.[0] || null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [scoreAdjustment, setScoreAdjustment] = useState<number | null>(null);
    const [config, setConfig] = useState<GameConfig | null>(initialConfig || null);

    useEffect(() => {
        if (initialQuestions && initialQuestions.length > 0) {
            setAllQuestions(initialQuestions);
            startWithQuestions(initialQuestions);
        }
    }, [initialQuestions]);

    const startWithQuestions = async (questions: Question[]) => {
        setIsGenerating(true);
        setStatus('PLAYING');
        try {
            const firstAudio = await fetchAudio(questions[0]);
            const firstData: GeneratedData = {
                question: questions[0],
                audioBase64: firstAudio,
                actualDifficulty: (questions[0].difficulty_level as Difficulty) || Difficulty.MEDIUM,
            };
            setQuestionsQueue(questions.slice(1));
            setCurrentData(firstData);
            setHistory([]);
            setScore(0);
            setIsAnswered(false);
            setSelectedOption(null);
            setScoreAdjustment(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    }

    const fetchAudio = async (question: Question): Promise<string> => {
        const response = await fetch('/api/missions/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: question.japanese_sentence,
                contextName: question.context_name,
                difficulty: question.difficulty_level,
                activityId,
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao gerar áudio');
        return data.audioBase64 as string;
    };

    const handleStart = useCallback(async (gameConfig: GameConfig) => {
        setError(null);
        setIsGenerating(true);
        setConfig(gameConfig);
        setStatus('PLAYING'); // Correct status while generating

        try {
            const qRes = await fetch('/api/missions/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameConfig),
            });
            const qData = await qRes.json();
            if (!qRes.ok) throw new Error(qData.error || 'Erro ao gerar questões');

            const questions = qData.questions;
            setAllQuestions(questions);

            const firstAudio = await fetchAudio(questions[0]);
            const firstData: GeneratedData = {
                question: questions[0],
                audioBase64: firstAudio,
                actualDifficulty: (questions[0].difficulty_level as Difficulty) || Difficulty.MEDIUM,
            };

            setQuestionsQueue(questions.slice(1));
            setCurrentData(firstData);
            setHistory([]);
            setScore(0);
            setStatus('PLAYING');
        } catch (err: any) {
            setError(err.message);
            setStatus('UPLOAD');
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const handleSaveActivity = async (title?: string) => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || userToken;
            if (!token) throw new Error('Não autenticado.');

            const res = await fetch(editingId ? '/api/activities/update' : '/api/activities/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingId,
                    title: title || initialTitle || 'Nova Atividade de Escuta',
                    type: 'escuta',
                    config: {
                        ...config,
                        questions: allQuestions
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar atividade.');

            setStatus('SAVED');
        } catch (err: any) {
            console.error('[Escuta Save Error]', err);
            alert(`Falha ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnswer = useCallback((idx: number, usedHint: boolean) => {
        if (!currentData || isAnswered) return;

        const correct = idx === currentData.question.correct_index;
        const difficulty = currentData.actualDifficulty || Difficulty.MEDIUM;
        const points = correct ? (usedHint ? Math.floor(POINTS_CONFIG[difficulty] / 2) : POINTS_CONFIG[difficulty]) : 0;

        setSelectedOption(idx);
        setIsAnswered(true);
        setScoreAdjustment(points);
        setScore((prev) => prev + points);
        setHistory((prev) => [
            ...prev,
            { correct, points, questionData: currentData, userAnswer: idx, usedHint },
        ]);
    }, [currentData, isAnswered]);

    const handleNext = useCallback(async () => {
        if (questionsQueue.length === 0) {
            const result: GameResult = { score, total: history.length + (isAnswered ? 1 : 0), history };
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token || userToken;
                
                if (token) {
                    await fetch('/api/missions/save-result', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            assignmentId,
                            score,
                            totalQuestions: history.length,
                            resultData: result
                        }),
                    });
                }
            } catch (err) {
                console.error('Error saving result:', err);
            }
            setStatus('RESULT');
            return;
        }

        setIsGenerating(true);
        setIsAnswered(false);
        setSelectedOption(null);
        setScoreAdjustment(null);

        try {
            const nextQuestion = questionsQueue[0];
            const audio = await fetchAudio(nextQuestion);
            setCurrentData({
                question: nextQuestion,
                audioBase64: audio,
                actualDifficulty: (nextQuestion.difficulty_level as Difficulty) || Difficulty.MEDIUM,
            });
            setQuestionsQueue((prev) => prev.slice(1));
        } catch (err) {
            console.error('Error loading next question:', err);
        } finally {
            setIsGenerating(false);
        }
    }, [questionsQueue, history, score, isAnswered, assignmentId, userToken]);

    const handleRestart = () => {
        setStatus('UPLOAD');
        setScore(0);
        setHistory([]);
        setAllQuestions([]);
        setQuestionsQueue([]);
        setCurrentData(null);
    };

    const renderContent = () => (
        <div className="escuta-app-content">
            {isGenerating && (
                <AdvancedLoading 
                    title="Destravando a Escuta"
                    Icon={Volume2}
                    messages={[
                        "Sintonizando frequências do Sensei...",
                        "Processando conteúdo do PDF...",
                        "Gerando áudios com vozes nativas...",
                        "Quase lá! Sincronizando scripts..."
                    ]}
                />
            )}

            {error && (
                <div className="max-w-2xl mx-auto mb-8 px-4 animation-fade-in shadow-xl">
                    <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500 animate-pulse"></div>
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                            <AlertCircle size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-outfit text-xl font-extrabold text-red-900">Ops! O Sensei se distrou...</h3>
                            <p className="font-inter text-red-700 font-medium text-sm leading-relaxed max-w-sm mx-auto">{error}</p>
                        </div>
                        <button 
                            onClick={handleRestart}
                            className="btn-primary-red px-8 py-3 w-full sm:w-auto font-outfit font-bold rounded-xl shadow-lg hover:shadow-red-200/50 transform hover:scale-105 active:scale-95 transition-all"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            )}

            {status === 'UPLOAD' && !error && (
                <UploadScreen
                    onStart={handleStart}
                    isGenerating={isGenerating}
                />
            )}

            {status === 'REVIEW' && config && (
                <EscutaReview
                    questions={allQuestions}
                    config={config}
                    onSave={handleSaveActivity}
                    onStartGame={() => setStatus('PLAYING')}
                    onCancel={handleRestart}
                    isSaving={isSaving}
                    initialTitle={initialTitle}
                />
            )}

            {status === 'PLAYING' && currentData && (
                <div className="max-w-4xl mx-auto py-8 px-4 animation-fade-in">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl border-2 border-slate-border flex items-center justify-center shadow-sm">
                                <span className="text-xl">🎧</span>
                            </div>
                            <div>
                                <h2 className="font-outfit text-xl font-extrabold text-slate-dark leading-tight">Missão de Escuta</h2>
                                <p className="text-sm font-bold text-slate-mid">Pontuação: <span className="text-brand">{score} pts</span></p>
                            </div>
                        </div>
                        <div className="w-full sm:w-48 h-3 bg-slate-border rounded-full overflow-hidden shadow-inner border border-white">
                            <div
                                className="h-full bg-brand transition-all duration-500 ease-out"
                                style={{
                                    width: `${Math.round(((history.length + (isAnswered ? 1 : 0)) / (history.length + questionsQueue.length + 1)) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>

                    <GameScreen
                        data={currentData}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        isAnswered={isAnswered}
                        scoreAdjustment={scoreAdjustment}
                    />
                </div>
            )}

            {status === 'RESULT' && (
                <ResultScreen
                    result={{ score, total: history.length, history }}
                    onRestart={handleRestart}
                    onSave={(!assignmentId && !publicAccess) ? handleSaveActivity : undefined}
                    isSaving={isSaving}
                    hideActions={!!assignmentId}
                />

            )}

            {status === 'SAVED' && (
                <div className="max-w-lg mx-auto py-24 text-center animation-fade-in">
                    <div className="bg-white rounded-3xl border-2 border-slate-border p-8 shadow-xl">
                        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="font-outfit text-3xl font-extrabold text-slate-dark mb-2">Missão Sintonizada!</h2>
                        <p className="text-slate-mid mb-8 px-4">Esta atividade de escuta foi salva na sua biblioteca e já pode ser atribuída aos seus alunos.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                           <button onClick={handleRestart} className="px-6 py-3 border-2 border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-colors">Criar Outra</button>
                           <a href="/dashboard/activities" className="px-6 py-3 bg-brand text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">Ir para Central</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <RoleGuard allowedRole="teacher" bypassIfAssignmentId={assignmentId} publicAccess={publicAccess}>
            {renderContent()}
        </RoleGuard>
    );
};
