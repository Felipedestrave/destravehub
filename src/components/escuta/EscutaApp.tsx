import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { UploadScreen } from './UploadScreen';
import { GameScreen } from './GameScreen';
import { ResultScreen } from './ResultScreen';
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
}

export const EscutaApp: React.FC<EscutaAppProps> = ({ userToken }) => {
    const [status, setStatus] = useState<GameStatus>('UPLOAD');
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Game state
    const [questionsQueue, setQuestionsQueue] = useState<Question[]>([]);
    const [currentData, setCurrentData] = useState<GeneratedData | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [scoreAdjustment, setScoreAdjustment] = useState<number | null>(null);
    const [config, setConfig] = useState<GameConfig | null>(null);

    const fetchAudio = async (question: Question): Promise<string> => {
        const response = await fetch('/api/missions/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: question.japanese_sentence,
                contextName: question.context_name,
                difficulty: question.difficulty_level,
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

        try {
            // 1. Generate questions
            const qRes = await fetch('/api/missions/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameConfig),
            });
            const qData = await qRes.json();
            if (!qRes.ok) throw new Error(qData.error || 'Erro ao gerar questões');

            const questions: Question[] = qData.questions;

            // 2. Generate audio for first question eagerly, rest lazy
            const firstAudio = await fetchAudio(questions[0]);

            const firstData: GeneratedData = {
                question: questions[0],
                audioBase64: firstAudio,
                actualDifficulty: (questions[0].difficulty_level as Difficulty) || gameConfig.difficulty,
            };

            setQuestionsQueue(questions.slice(1));
            setCurrentData(firstData);
            setHistory([]);
            setScore(0);
            setIsAnswered(false);
            setSelectedOption(null);
            setScoreAdjustment(null);
            setStatus('PLAYING');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setIsGenerating(false);
        }
    }, []);

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
            // Game over
            const result: GameResult = { score, total: history.length + 1, history };

            // Optionally save result
            if (userToken) {
                try {
                    await fetch('/api/missions/save-result', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${userToken}`,
                        },
                        body: JSON.stringify({
                            score,
                            totalQuestions: history.length,
                            history,
                            title: `Escuta — ${config?.difficulty}`,
                        }),
                    });
                } catch (_) { /* non-blocking */ }
            }

            setStatus('RESULT');
            return;
        }

        // Load next question + audio
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
            setError(err instanceof Error ? err.message : 'Erro ao carregar próxima questão.');
        } finally {
            setIsGenerating(false);
        }
    }, [questionsQueue, score, history, userToken, config]);

    const handleRestart = () => {
        setStatus('UPLOAD');
        setCurrentData(null);
        setQuestionsQueue([]);
        setHistory([]);
        setScore(0);
        setError(null);
    };

    // Loading overlay
    if (status === 'PLAYING' && isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 size={40} className="text-brand animate-spin" />
                <p className="font-outfit font-semibold text-slate-mid">Carregando próxima questão...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto py-16 px-4 text-center">
                <div className="card">
                    <AlertCircle size={40} className="text-action mx-auto mb-4" />
                    <h3 className="font-outfit font-bold text-slate-dark text-xl mb-2">Algo deu errado</h3>
                    <p className="text-slate-mid font-inter text-sm mb-6">{error}</p>
                    <button onClick={handleRestart} className="btn-ghost w-full">
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {status === 'UPLOAD' && (
                <UploadScreen onStart={handleStart} isGenerating={isGenerating} />
            )}

            {status === 'PLAYING' && currentData && (
                <>
                    {/* Progress bar */}
                    <div className="max-w-2xl mx-auto px-4 pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-outfit text-sm text-slate-mid">
                                Questão {history.length + 1} de {history.length + 1 + questionsQueue.length + (isAnswered ? 0 : 1)}
                            </span>
                            <span className="font-outfit font-bold text-brand">{score} pts</span>
                        </div>
                        <div className="h-1.5 bg-ice rounded-full overflow-hidden border border-slate-border">
                            <div
                                className="h-full bg-gradient-to-r from-brand to-action transition-all duration-500"
                                style={{
                                    width: `${Math.round((history.length / (history.length + questionsQueue.length + 1)) * 100)}%`,
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
                </>
            )}

            {status === 'RESULT' && (
                <ResultScreen
                    result={{ score, total: history.length, history }}
                    onRestart={handleRestart}
                />
            )}
        </>
    );
};
