import React, { useState, useEffect } from 'react';
import { 
    Loader2, 
    AlertCircle, 
    CheckCircle, 
    ArrowLeft, 
    Trash2, 
    ChevronDown, 
    ChevronUp, 
    Save, 
    Sparkles, 
    Layers, 
    Compass, 
    Cpu, 
    Volume2, 
    FileText, 
    HelpCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PdfUploadBox } from '../shared/PdfUploadBox';
import { AdvancedLoading } from '../shared/AdvancedLoading';
import { RoleGuard } from '../shared/RoleGuard';

interface Destrave2AppProps {
    assignmentId?: string;
    editingId?: string;
    activityId?: string;
    initialExercises?: any[];
    initialConfig?: {
        difficulty: string;
        count: number;
        context: string;
        customInstructions?: string;
    } | null;
    initialTitle?: string;
}

export const Destrave2App: React.FC<Destrave2AppProps> = ({
    assignmentId,
    editingId,
    activityId,
    initialExercises,
    initialConfig,
    initialTitle,
}) => {
    const [status, setStatus] = useState<'UPLOAD' | 'REVIEW' | 'SAVED'>('UPLOAD');
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form inputs
    const [fileName, setFileName] = useState<string | null>(null);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string>(initialConfig?.difficulty || 'mixed');
    const [count, setCount] = useState<number>(initialConfig?.count || 10);
    const [title, setTitle] = useState<string>(initialTitle || '');
    const [customInstructions, setCustomInstructions] = useState<string>(initialConfig?.customInstructions || '');

    // Exercises state
    const [exercises, setExercises] = useState<any[]>(initialExercises || []);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (initialExercises && initialExercises.length > 0) {
            setExercises(initialExercises);
            setStatus('REVIEW');
        }
    }, [initialExercises]);

    const handleStartGeneration = async () => {
        if (!pdfBase64) return;
        setError(null);
        setIsGenerating(true);

        try {
            const res = await fetch('/api/missions/generate-hybrid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdfBase64,
                    difficulty,
                    count,
                    customInstructions
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao gerar exercícios híbridos');

            setExercises(data.exercises);
            if (!title) {
                const dateStr = new Date().toLocaleDateString('pt-BR');
                setTitle(`Missão Híbrida - ${dateStr}`);
            }
            setStatus('REVIEW');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveActivity = async () => {
        if (!title.trim()) {
            alert('Por favor, defina um título para a missão.');
            return;
        }

        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error('Usuário não autenticado.');

            const res = await fetch(editingId ? '/api/activities/update' : '/api/activities/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingId,
                    title: title,
                    type: 'destrave2',
                    config: {
                        difficulty,
                        total_questions: exercises.length,
                        context: fileName || '',
                        customInstructions,
                        exercises
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Falha ao salvar missão híbrida');

            setStatus('SAVED');
        } catch (err: any) {
            alert(`Falha ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateExercise = (index: number, updatedData: any) => {
        setExercises(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], data: { ...copy[index].data, ...updatedData } };
            return copy;
        });
    };

    const handleUpdateBlock = (exerciseIndex: number, blockIndex: number, updatedBlock: any) => {
        setExercises(prev => {
            const copy = [...prev];
            const blocks = [...copy[exerciseIndex].data.blocks];
            blocks[blockIndex] = { ...blocks[blockIndex], ...updatedBlock };
            copy[exerciseIndex].data.blocks = blocks;
            return copy;
        });
    };

    const handleDeleteExercise = (index: number) => {
        if (confirm('Tem certeza que deseja remover esta questão da missão?')) {
            setExercises(prev => prev.filter((_, idx) => idx !== index));
            if (expandedIndex === index) {
                setExpandedIndex(null);
            } else if (expandedIndex !== null && expandedIndex > index) {
                setExpandedIndex(expandedIndex - 1);
            }
        }
    };

    const handleRestart = () => {
        setStatus('UPLOAD');
        setExercises([]);
        setError(null);
        setPdfBase64(null);
        setFileName(null);
        setExpandedIndex(null);
        setCustomInstructions('');
    };

    return (
        <RoleGuard allowedRole="teacher" bypassIfAssignmentId={assignmentId}>
            <div className="w-full max-w-4xl mx-auto py-6 px-4">
                
                {isGenerating && (
                    <AdvancedLoading 
                        title="Construindo Playlist Híbrida ⚡"
                        Icon={Compass}
                        type="wave"
                        messages={[
                            "Analisando material didático fornecido...",
                            "Equilibrando exercícios de Escuta, Lego e MRP...",
                            "Gerando dublagens por IA com pronúncia perfeita...",
                            "Organizando os blocos de sintaxe do Lego...",
                            "Quase pronto! Formatando estúdio de revisão..."
                        ]}
                    />
                )}

                {error && (
                    <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-center relative overflow-hidden group shadow-lg">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                            <AlertCircle size={28} />
                        </div>
                        <h3 className="font-outfit text-xl font-bold text-red-900 mb-1">Ops! Algo deu errado na geração</h3>
                        <p className="font-inter text-red-700 text-sm max-w-md mx-auto mb-4">{error}</p>
                        <button 
                            onClick={handleRestart}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-outfit font-bold transition-all shadow-md"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                )}

                {status === 'UPLOAD' && !error && (
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-slate-border rounded-3xl p-6 shadow-sm">
                            <h2 className="font-outfit text-xl font-bold text-slate-dark mb-4">Selecione o Material</h2>
                            <PdfUploadBox 
                                onFileSelected={(base64, name) => {
                                    setPdfBase64(base64);
                                    setFileName(name);
                                }}
                                currentFileName={fileName}
                            />
                        </div>

                        <div className="bg-white border-2 border-slate-border rounded-3xl p-6 shadow-sm space-y-6">
                            <h2 className="font-outfit text-xl font-bold text-slate-dark">Configurações da Missão</h2>
                            
                            <div>
                                <label className="font-outfit font-semibold text-xs text-slate-mid uppercase tracking-wide block mb-3">
                                    Dificuldade das Questões
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { value: 'N5', label: 'JLPT N5', desc: 'Básico', color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50' },
                                        { value: 'N4', label: 'JLPT N4', desc: 'Elementar', color: 'border-amber-200 text-amber-700 bg-amber-50/50' },
                                        { value: 'N3', label: 'JLPT N3', desc: 'Intermediário', color: 'border-rose-200 text-rose-700 bg-rose-50/50' },
                                        { value: 'mixed', label: 'Misturado', desc: 'N5 ao N3', color: 'border-blue-200 text-blue-700 bg-blue-50/50' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setDifficulty(opt.value)}
                                            className={`p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] ${
                                                difficulty === opt.value 
                                                    ? `${opt.color} border-brand shadow-sm` 
                                                    : 'border-slate-border text-slate-mid bg-white hover:border-slate-dark/20'
                                            }`}
                                        >
                                            <span className="font-outfit font-bold block text-sm">{opt.label}</span>
                                            <span className="text-[10px] font-semibold opacity-80">{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="font-outfit font-semibold text-xs text-slate-mid uppercase tracking-wide block mb-3">
                                    Quantidade de Exercícios
                                </label>
                                <div className="flex gap-4">
                                    {[10, 15, 20].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setCount(num)}
                                            className={`flex-1 py-3.5 rounded-2xl border-2 font-outfit font-extrabold text-lg transition-all ${
                                                count === num
                                                    ? 'border-brand bg-brand/5 text-slate-dark'
                                                    : 'border-slate-border bg-white text-slate-mid hover:border-slate-dark/20'
                                            }`}
                                        >
                                            {num} Questões
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="font-outfit font-semibold text-xs text-slate-mid uppercase tracking-wide block mb-2">
                                    Instruções Especiais para a IA (Opcional)
                                </label>
                                <textarea
                                    value={customInstructions}
                                    onChange={(e) => setCustomInstructions(e.target.value)}
                                    placeholder="Ex: Use apenas frases inéditas que não aparecem no material didático; use frases curtas; foque em uma partícula específica..."
                                    className="w-full border-2 border-slate-border rounded-2xl p-4 font-inter text-sm text-slate-dark bg-white outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(88,49,126,0.1)] transition-all resize-y h-[100px]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleStartGeneration}
                            disabled={!pdfBase64 || isGenerating}
                            className="w-full py-4 bg-brand hover:bg-brand/90 disabled:opacity-40 text-white rounded-2xl font-outfit font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-brand/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Gerando Trilha Híbrida...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Gerar Playlist Destrave 2.0
                                </>
                            )}
                        </button>
                    </div>
                )}

                {status === 'REVIEW' && (
                    <div className="space-y-6">
                        {/* Header & Meta Settings */}
                        <div className="bg-white border-2 border-slate-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <label className="font-outfit font-bold text-xs text-slate-mid uppercase tracking-wider block mb-1">Título da Atividade</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Aula 5 - Partículas e Diálogos"
                                    className="w-full text-lg font-outfit font-extrabold text-slate-dark border-b-2 border-slate-border focus:border-brand outline-none py-1 transition-colors"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRestart}
                                    className="px-5 py-3 border-2 border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-colors"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={handleSaveActivity}
                                    disabled={isSaving || exercises.length === 0}
                                    className="px-6 py-3 bg-brand text-white rounded-xl font-outfit font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Salvar Atividade
                                </button>
                            </div>
                        </div>

                        {/* Exercises List */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="font-outfit text-lg font-bold text-slate-dark flex items-center gap-2">
                                    <Layers size={18} className="text-brand" />
                                    Estúdio de Revisão ({exercises.length} itens)
                                </h3>
                                <span className="text-xs text-slate-mid font-semibold">Clique em um exercício para editá-lo</span>
                            </div>

                            {exercises.map((ex, idx) => {
                                const isExpanded = expandedIndex === idx;
                                const typeTag = ex.type === 'escuta' 
                                    ? { label: 'Escuta 🎧', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                                    : ex.type === 'lego'
                                        ? { label: 'Lego 🧱', style: 'bg-amber-50 text-amber-700 border-amber-200' }
                                        : { label: 'MRP 💬', style: 'bg-blue-50 text-blue-700 border-blue-200' };

                                const titlePreview = ex.type === 'escuta' 
                                    ? ex.data.japanese_sentence 
                                    : ex.type === 'lego'
                                        ? ex.data.original
                                        : ex.data.scenario;

                                return (
                                    <div 
                                        key={ex.id || idx}
                                        className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
                                            isExpanded ? 'border-brand shadow-md' : 'border-slate-border hover:border-slate-dark/20'
                                        }`}
                                    >
                                        {/* Card Header (Clickable) */}
                                        <div 
                                            onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                                            className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none bg-slate-50/50"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg border tracking-wide ${typeTag.style}`}>
                                                    {typeTag.label}
                                                </span>
                                                <span className="font-outfit font-bold text-sm text-slate-dark truncate max-w-md">
                                                    {titlePreview}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteExercise(idx);
                                                    }}
                                                    className="p-1.5 text-slate-mid hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Deletar exercício"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>

                                        {/* Expandable Form Fields */}
                                        {isExpanded && (
                                            <div className="p-5 border-t border-slate-border bg-white space-y-4">
                                                
                                                {/* Escuta Editor */}
                                                {ex.type === 'escuta' && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Frase em Japonês</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.japanese_sentence}
                                                                    onChange={(e) => handleUpdateExercise(idx, { japanese_sentence: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Romaji</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.romaji}
                                                                    onChange={(e) => handleUpdateExercise(idx, { romaji: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-xs font-bold text-slate-mid block mb-2">Opções de Tradução (Português)</label>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {ex.data.options.map((opt: string, optIdx: number) => (
                                                                    <div key={optIdx} className="flex items-center gap-2">
                                                                        <input 
                                                                            type="radio" 
                                                                            name={`correct-${idx}`}
                                                                            checked={ex.data.correct_index === optIdx}
                                                                            onChange={() => handleUpdateExercise(idx, { correct_index: optIdx })}
                                                                            className="accent-brand scale-110"
                                                                        />
                                                                        <input 
                                                                            type="text" 
                                                                            value={opt}
                                                                            onChange={(e) => {
                                                                                const newOpts = [...ex.data.options];
                                                                                newOpts[optIdx] = e.target.value;
                                                                                handleUpdateExercise(idx, { options: newOpts });
                                                                            }}
                                                                            placeholder={`Opção ${optIdx + 1}`}
                                                                            className="input-field w-full"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Dica (Hint)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.hint}
                                                                    onChange={(e) => handleUpdateExercise(idx, { hint: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Contexto (Cenário)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.context_name}
                                                                    onChange={(e) => handleUpdateExercise(idx, { context_name: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Nível de Dificuldade</label>
                                                                <select
                                                                    value={ex.data.difficulty_level}
                                                                    onChange={(e) => handleUpdateExercise(idx, { difficulty_level: e.target.value })}
                                                                    className="input-field w-full"
                                                                >
                                                                    <option value="Fácil">Fácil</option>
                                                                    <option value="Médio">Médio</option>
                                                                    <option value="Avançado">Avançado</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-mid block mb-1">Explicação Cultural/Gramatical</label>
                                                            <textarea 
                                                                value={ex.data.explanation || ''}
                                                                onChange={(e) => handleUpdateExercise(idx, { explanation: e.target.value })}
                                                                className="input-field w-full h-20 resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Lego Editor */}
                                                {ex.type === 'lego' && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Frase Completa (Japonês)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.original}
                                                                    onChange={(e) => handleUpdateExercise(idx, { original: e.target.value })}
                                                                    className="input-field w-full font-bold"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Tradução Completa (Português)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.translation}
                                                                    onChange={(e) => handleUpdateExercise(idx, { translation: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-xs font-bold text-slate-mid block mb-2">Blocos Construtores (Ordem Correta)</label>
                                                            <div className="space-y-3">
                                                                {ex.data.blocks.map((block: any, bIdx: number) => (
                                                                    <div key={block.id || bIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-3">
                                                                        <span className="w-6 h-6 bg-slate-200 text-slate-mid text-[10px] font-bold flex items-center justify-center rounded-full">
                                                                            {bIdx + 1}
                                                                        </span>
                                                                        <div className="flex-1 min-w-[120px]">
                                                                            <input 
                                                                                type="text" 
                                                                                value={block.word}
                                                                                onChange={(e) => handleUpdateBlock(idx, bIdx, { word: e.target.value })}
                                                                                placeholder="Palavra"
                                                                                className="input-field py-1 text-sm font-bold w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 min-w-[120px]">
                                                                            <input 
                                                                                type="text" 
                                                                                value={block.romaji}
                                                                                onChange={(e) => handleUpdateBlock(idx, bIdx, { romaji: e.target.value })}
                                                                                placeholder="Romaji"
                                                                                className="input-field py-1 text-sm w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 min-w-[100px]">
                                                                            <select
                                                                                value={block.type}
                                                                                onChange={(e) => handleUpdateBlock(idx, bIdx, { type: e.target.value })}
                                                                                className="input-field py-1 text-xs w-full"
                                                                            >
                                                                                <option value="SUBJECT">Sujeito</option>
                                                                                <option value="OBJECT">Objeto</option>
                                                                                <option value="VERB">Verbo</option>
                                                                                <option value="PARTICLE">Partícula</option>
                                                                                <option value="TIME">Tempo</option>
                                                                                <option value="ADJECTIVE">Adjetivo</option>
                                                                                <option value="OTHER">Outro</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="flex-1 min-w-[120px]">
                                                                            <input 
                                                                                type="text" 
                                                                                value={block.translation || ''}
                                                                                onChange={(e) => handleUpdateBlock(idx, bIdx, { translation: e.target.value })}
                                                                                placeholder="Tradução bloco"
                                                                                className="input-field py-1 text-sm w-full"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* MRP Editor */}
                                                {ex.type === 'mrp' && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Cenário Social (Português)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.scenario}
                                                                    onChange={(e) => handleUpdateExercise(idx, { scenario: e.target.value })}
                                                                    className="input-field w-full font-bold"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Tarefa Social (Português)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.task}
                                                                    onChange={(e) => handleUpdateExercise(idx, { task: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-xs font-bold text-slate-mid block mb-2">Opções de Resposta (Falas do Aluno)</label>
                                                            <div className="space-y-2">
                                                                {ex.data.options.map((opt: string, optIdx: number) => (
                                                                    <div key={optIdx} className="flex items-center gap-3">
                                                                        <input 
                                                                            type="radio" 
                                                                            name={`mrp-correct-${idx}`}
                                                                            checked={ex.data.correctAnswer === opt}
                                                                            onChange={() => handleUpdateExercise(idx, { correctAnswer: opt })}
                                                                            className="accent-brand scale-110"
                                                                        />
                                                                        <input 
                                                                            type="text" 
                                                                            value={opt}
                                                                            onChange={(e) => {
                                                                                const newOpts = [...ex.data.options];
                                                                                const oldOptVal = newOpts[optIdx];
                                                                                newOpts[optIdx] = e.target.value;
                                                                                
                                                                                const updates: any = { options: newOpts };
                                                                                // Keep correctAnswer updated if it matches edited option
                                                                                if (ex.data.correctAnswer === oldOptVal) {
                                                                                    updates.correctAnswer = e.target.value;
                                                                                }
                                                                                handleUpdateExercise(idx, updates);
                                                                            }}
                                                                            placeholder={`Ex: コーヒーをください (Kōhī o kudasai)`}
                                                                            className="input-field w-full"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Dica (Hint)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.hint}
                                                                    onChange={(e) => handleUpdateExercise(idx, { hint: e.target.value })}
                                                                    className="input-field w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Nível JLPT</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={ex.data.level}
                                                                    onChange={(e) => handleUpdateExercise(idx, { level: e.target.value })}
                                                                    className="input-field w-full text-center"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-mid block mb-1">Pontos concedidos</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={ex.data.points}
                                                                    onChange={(e) => handleUpdateExercise(idx, { points: Number(e.target.value) })}
                                                                    className="input-field w-full text-center"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-mid block mb-1">Explicação de Adequação Social</label>
                                                            <textarea 
                                                                value={ex.data.explanation}
                                                                onChange={(e) => handleUpdateExercise(idx, { explanation: e.target.value })}
                                                                className="input-field w-full h-20 resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {status === 'SAVED' && (
                    <div className="max-w-lg mx-auto py-16 text-center">
                        <div className="bg-white rounded-3xl border-2 border-slate-border p-8 shadow-xl">
                            <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="font-outfit text-3xl font-extrabold text-slate-dark mb-2">Missão Híbrida Criada!</h2>
                            <p className="text-slate-mid mb-8 px-4">A atividade híbrida de nível <strong>{difficulty === 'mixed' ? 'Misturado' : difficulty}</strong> foi salva no sistema com sucesso.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={handleRestart} 
                                    className="px-6 py-3 border-2 border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-colors"
                                >
                                    Criar Outra
                                </button>
                                <a 
                                    href="/dashboard" 
                                    className="px-6 py-3 bg-brand text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                                >
                                    Voltar ao Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .input-field {
                    background-color: var(--color-bg);
                    border: 2px solid var(--color-slate-border);
                    border-radius: 0.75rem;
                    padding: 0.625rem 0.875rem;
                    font-size: 0.875rem;
                    color: var(--color-slate-dark);
                    font-weight: 500;
                    outline: none;
                    transition: all 150ms ease;
                }
                .input-field:focus {
                    border-color: var(--color-brand);
                    background-color: white;
                    box-shadow: 0 0 0 4px var(--color-brand-light);
                }
            ` }} />
        </RoleGuard>
    );
};
