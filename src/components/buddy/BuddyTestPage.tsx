import React, { useState } from 'react';
import { BuddyView, type BuddyState } from './BuddyView';
import { Sparkles, XCircle, Play, UserCircle2 } from 'lucide-react';

export const BuddyTestPage: React.FC = () => {
    const [state, setState] = useState<BuddyState>('idle');
    const [avatarUrl, setAvatarUrl] = useState('/assets/avatars/ashigaru.png');

    const triggerState = (newState: BuddyState) => {
        setState(newState);
        // Após a animação de impacto (0.6s), volta para o estado IDLE (esperando)
        if (newState === 'success' || newState === 'error') {
            setTimeout(() => setState('idle'), 1500);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="border-b border-slate-200 pb-6">
                <h1 className="text-4xl font-outfit font-black text-slate-800">Cenário de Teste: Buddy Hub 🏯</h1>
                <p className="text-slate-500 mt-2">Clique nos botões abaixo para ver os "novos humores" do seu avatar no canto da tela.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controles de Estado */}
                <div className="bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                    <h2 className="text-sm uppercase tracking-widest font-black text-brand">Controle de Reações</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => triggerState('success')}
                            className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl border-2 border-emerald-100 hover:bg-emerald-100 transition-all font-outfit font-bold"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-emerald-500 text-white p-2 rounded-xl"><Sparkles size={20} /></span>
                                <div>
                                    <p>Simular Acerto (Success)</p>
                                    <p className="text-xs opacity-60 font-normal">Pulo alto + Brilho Verde</p>
                                </div>
                            </div>
                            <span className="opacity-40">Trigger {'->'}</span>
                        </button>

                        <button 
                            onClick={() => triggerState('error')}
                            className="w-full flex items-center justify-between p-4 bg-rose-50 text-rose-700 rounded-2xl border-2 border-rose-100 hover:bg-rose-100 transition-all font-outfit font-bold"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-rose-500 text-white p-2 rounded-xl"><XCircle size={20} /></span>
                                <div>
                                    <p>Simular Erro (Error)</p>
                                    <p className="text-xs opacity-60 font-normal">Tremor lateral + Brilho Vermelho</p>
                                </div>
                            </div>
                            <span className="opacity-40">Trigger {'->'}</span>
                        </button>

                        <button 
                            onClick={() => setState('idle')}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-slate-700 rounded-2xl border-2 border-slate-100 hover:bg-slate-100 transition-all font-outfit font-bold"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-400 text-white p-2 rounded-xl"><Play size={20} /></span>
                                <div>
                                    <p>Resetar para Respiração (Idle)</p>
                                    <p className="text-xs opacity-60 font-normal">Movimento contínuo</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Seleção de Avatar */}
                <div className="bg-slate-50 p-8 rounded-3xl space-y-4">
                     <h2 className="text-sm uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                        <UserCircle2 size={16} /> Trocar Personagem
                     </h2>
                     <div className="grid grid-cols-2 gap-3">
                        {['ashigaru', 'ninja-sapeca', 'samurai-zen', 'shogun'].map(name => (
                            <button 
                                key={name}
                                onClick={() => setAvatarUrl(`/assets/avatars/${name}.png`)}
                                className={`p-3 rounded-xl border font-bold capitalize transition-all ${avatarUrl.includes(name) ? 'bg-brand text-white border-brand' : 'bg-white border-slate-200 text-slate-600 hover:border-brand'}`}
                            >
                                {name.replace('-', ' ')}
                            </button>
                        ))}
                     </div>
                     <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                        *Lembre-se: O personagem é exibido no canto inferior direito da sua tela, exatamente como ficará durante as missões.
                     </p>
                </div>
            </div>

            {/* O Buddy fixo no canto (usando o componente real) */}
            <BuddyView avatarUrl={avatarUrl} state={state} />
        </div>
    );
};
