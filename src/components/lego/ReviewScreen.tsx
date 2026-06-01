import React, { useState } from 'react';
import { Save, Send, Trash2, Edit3, Check } from 'lucide-react';
import type { LegoSentence, LegoConfig, LegoBlock, LegoBlockType } from '../../types/lego';

interface ReviewScreenProps {
    sentences: LegoSentence[];
    config: LegoConfig;
    onSave: (title: string, editedSentences: LegoSentence[]) => void;
    onStartGame: (editedSentences: LegoSentence[]) => void;
    onCancel: () => void;
    isSaving: boolean;
    initialTitle?: string;
}

const BLOCK_TYPES: LegoBlockType[] = ['SUBJECT', 'OBJECT', 'VERB', 'PARTICLE', 'TIME', 'ADJECTIVE', 'OTHER'];

const getBlockColor = (type: LegoBlockType) => {
    switch (type) {
        case 'SUBJECT': return 'bg-brand text-white border-brand-dark';
        case 'OBJECT': return 'bg-brand text-white border-brand-dark';
        case 'VERB': return 'bg-action text-white border-action-dark'; // Laranja
        case 'PARTICLE': return 'bg-purple-200 text-brand border-purple-300'; // Lilás
        case 'TIME': return 'bg-emerald-500 text-white border-emerald-600';
        case 'ADJECTIVE': return 'bg-sky-500 text-white border-sky-600';
        default: return 'bg-slate-200 text-slate-700 border-slate-300';
    }
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
    sentences,
    config,
    onSave,
    onStartGame,
    onCancel,
    isSaving,
    initialTitle
}) => {
    const [title, setTitle] = useState(initialTitle || `Lego Builder - ${new Date().toLocaleDateString()}`);
    const [editableSentences, setEditableSentences] = useState<LegoSentence[]>(sentences);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);

    const deleteSentence = (idx: number) => {
        setEditableSentences(prev => prev.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
    };

    const updateSentence = (idx: number, field: keyof LegoSentence, value: string) => {
        setEditableSentences(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };

    const updateBlock = (sIdx: number, bIdx: number, field: keyof LegoBlock, value: string) => {
        setEditableSentences(prev => prev.map((s, i) => {
            if (i !== sIdx) return s;
            const newBlocks = [...s.blocks];
            newBlocks[bIdx] = { ...newBlocks[bIdx], [field]: value };
            return { ...s, blocks: newBlocks };
        }));
    };

    const deleteBlock = (sIdx: number, bIdx: number) => {
        setEditableSentences(prev => prev.map((s, i) => {
            if (i !== sIdx) return s;
            return { ...s, blocks: s.blocks.filter((_, j) => j !== bIdx) };
        }));
    };

    const addBlock = (sIdx: number) => {
        setEditableSentences(prev => prev.map((s, i) => {
            if (i !== sIdx) return s;
            const newBlock: LegoBlock = { id: `new-${Date.now()}`, word: '', type: 'OTHER' };
            return { ...s, blocks: [...s.blocks, newBlock] };
        }));
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-[fade-in_0.4s_ease-out]">
            <header className="flex justify-between items-end mb-8 gap-8 flex-wrap">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-500 font-outfit font-extrabold text-[0.7rem] uppercase tracking-widest mb-3">Revisão da IA</span>
                    <h2 className="font-outfit text-3xl font-extrabold text-slate-dark m-0">Frases Geradas</h2>
                    <p className="text-[0.95rem] text-slate-mid mt-1">
                        {editableSentences.length} frases estruturadas. Edite os blocos ou salve como uma atividade.
                    </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <button onClick={onCancel} className="px-5 py-3 rounded-xl border-[1.5px] border-slate-border bg-white font-outfit font-bold text-slate-mid transition-all hover:bg-slate-50">Descartar</button>
                    <button
                        onClick={() => onSave(title, editableSentences)}
                        disabled={isSaving || editableSentences.length === 0}
                        className="px-6 py-3 rounded-xl bg-brand text-white font-outfit font-extrabold flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-md shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <span className="w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        Salvar na Central
                    </button>
                    <button onClick={() => onStartGame(editableSentences)} disabled={editableSentences.length === 0} className="px-6 py-3 rounded-xl bg-action text-white font-outfit font-extrabold flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-md shadow-action/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send size={18} /> Iniciar Teste
                    </button>
                </div>
            </header>

            <div className="bg-white border-[1.5px] border-slate-border rounded-2xl p-5 mb-8 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-mid uppercase tracking-widest">Título da Atividade</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Rotina Diária N5"
                    className="border-[1.5px] border-slate-border rounded-xl px-4 py-3 font-outfit text-lg font-semibold text-slate-dark outline-none focus:border-brand transition-colors"
                />
            </div>

            <div className="flex flex-col gap-4 pb-16">
                {editableSentences.map((s, idx) => {
                    const isEditing = editingIdx === idx;

                    return (
                        <div key={idx} className={`bg-white rounded-[1.25rem] border-[1.5px] flex overflow-visible transition-all relative ${isEditing ? 'border-brand shadow-[0_0_0_3px_rgba(88,49,126,0.1)]' : 'border-slate-border'}`}>
                            <div className="w-[50px] min-w-[50px] bg-ice flex items-center justify-center font-outfit font-extrabold text-brand text-xl border-r-[1.5px] border-slate-border rounded-l-[1.25rem]">
                                #{idx + 1}
                            </div>
                            <div className="p-5 flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex flex-col gap-3 mb-4">
                                        <input
                                            className="w-full border-[1.5px] border-slate-border rounded-lg px-3 py-2 font-outfit text-lg font-bold text-slate-dark focus:border-brand outline-none bg-slate-50 focus:bg-white transition-colors"
                                            value={s.original}
                                            onChange={e => updateSentence(idx, 'original', e.target.value)}
                                            placeholder="Frase completa em Japonês"
                                        />
                                        <input
                                            className="w-full border-[1.5px] border-slate-border rounded-lg px-3 py-2 font-inter text-[0.95rem] text-brand font-semibold focus:border-brand outline-none bg-slate-50 focus:bg-white transition-colors"
                                            value={s.translation}
                                            onChange={e => updateSentence(idx, 'translation', e.target.value)}
                                            placeholder="Tradução"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="font-outfit text-xl font-extrabold text-slate-dark m-0 mb-1">{s.original}</h4>
                                        <p className="text-[0.95rem] text-brand font-semibold mb-4">{s.translation}</p>
                                    </>
                                )}

                                {/* Blocks Preview / Edit */}
                                <div className="bg-ice rounded-xl p-4 border border-dashed border-slate-border">
                                    <div className="text-xs font-bold text-slate-mid uppercase tracking-widest mb-3">Blocos Sintáticos (Drag Items)</div>
                                    <div className="flex flex-wrap gap-2">
                                        {s.blocks.map((b, bIdx) => (
                                            <div key={bIdx} className={`border-b-4 rounded-xl p-2 flex flex-col gap-1 min-w-[80px] shadow-sm items-center justify-center ${getBlockColor(b.type)}`}>
                                                {isEditing ? (
                                                    <>
                                                        <div className="flex justify-between items-center w-full mb-1">
                                                            <select
                                                                className="text-[0.55rem] font-bold uppercase outline-none bg-transparent opacity-80 cursor-pointer w-[60px]"
                                                                value={b.type}
                                                                onChange={e => updateBlock(idx, bIdx, 'type', e.target.value)}
                                                            >
                                                                {BLOCK_TYPES.map(t => <option key={t} value={t} className="text-slate-800 bg-white">{t}</option>)}
                                                            </select>
                                                            <button onClick={() => deleteBlock(idx, bIdx)} className="opacity-70 hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                                        </div>
                                                        <input
                                                            className="text-sm font-bold text-center outline-none w-full bg-transparent border-b border-black/10 focus:border-black/30 placeholder:text-current placeholder:opacity-50 mb-1"
                                                            value={b.word}
                                                            onChange={e => updateBlock(idx, bIdx, 'word', e.target.value)}
                                                            placeholder="Palavra"
                                                        />
                                                        <input
                                                            className="text-[0.7rem] text-center outline-none w-full bg-transparent border-b border-black/10 focus:border-black/30 placeholder:text-current placeholder:opacity-50 opacity-80"
                                                            value={b.romaji || ''}
                                                            onChange={e => updateBlock(idx, bIdx, 'romaji', e.target.value)}
                                                            placeholder="Romaji"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-sm font-bold text-center flex flex-col items-center leading-tight">
                                                            <span>{b.word}</span>
                                                            {b.romaji && <span className="text-[0.65rem] opacity-75 font-inter mt-0.5 font-normal tracking-wide">({b.romaji})</span>}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button onClick={() => addBlock(idx)} className="bg-white border border-dashed border-brand text-brand font-bold text-xs rounded-lg px-3 flex items-center justify-center hover:bg-brand/5">
                                                + Bloco
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="flex flex-col gap-2 pt-3 pr-3">
                                <button
                                    className={`w-8 h-8 rounded-lg border-[1.5px] border-slate-border bg-white cursor-pointer flex items-center justify-center transition-all ${isEditing ? 'bg-brand border-brand text-white' : 'text-slate-mid hover:bg-brand hover:border-brand hover:text-white'}`}
                                    onClick={() => setEditingIdx(isEditing ? null : idx)}
                                >
                                    {isEditing ? <Check size={15} /> : <Edit3 size={15} />}
                                </button>
                                <button
                                    className="w-8 h-8 rounded-lg border-[1.5px] border-slate-border bg-white cursor-pointer flex items-center justify-center transition-all text-slate-mid hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                    onClick={() => deleteSentence(idx)}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editableSentences.length === 0 && (
                <div className="text-center py-12 text-slate-mid flex flex-col items-center gap-4">
                    <p>Todas as frases foram removidas.</p>
                    <button onClick={onCancel} className="px-5 py-3 rounded-xl border-[1.5px] border-slate-border bg-white font-outfit font-bold text-slate-mid transition-all hover:bg-slate-50">Gerar Novas Frases</button>
                </div>
            )}
        </div>
    );
};
