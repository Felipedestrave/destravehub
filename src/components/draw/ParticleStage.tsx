import React, { useEffect, useState } from 'react';
import { Rocket, Droplets, Flame, Zap, PartyPopper, Star, Trophy } from 'lucide-react';
import type { VisualEffect } from './types.ts';

interface ParticleStageProps {
    effects: VisualEffect[];
}

export const ParticleStage: React.FC<ParticleStageProps> = ({ effects }) => {
    const [activeEffects, setActiveEffects] = useState<VisualEffect[]>([]);

    useEffect(() => {
        setActiveEffects(effects);
    }, [effects]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9000] overflow-hidden">
            {activeEffects.map(effect => {
                switch (effect.type) {
                    case 'matsuri':
                        return (
                            <div key={effect.id} className="absolute inset-0 flex items-center justify-center">
                                {[...Array(24)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-8 h-8 rounded-sm animate-matsuri-particle"
                                        style={{
                                            backgroundColor: ['#ff4d4d', '#ffcc00', '#33cc33', '#3399ff', '#ff33cc'][i % 5],
                                            '--tx': `${(Math.random() - 0.5) * 1200}px` as any,
                                            '--ty': `${(Math.random() - 0.5) * 1200}px` as any,
                                            '--rot': `${Math.random() * 720}deg` as any
                                        } as any}
                                    />
                                ))}
                            </div>
                        );
                    case 'rocket':
                        return (
                            <div key={effect.id} className="absolute bottom-0 left-0 animate-rocket-fly pointer-events-none">
                                <div className="relative">
                                    <Rocket className="w-48 h-48 text-orange-500 fill-orange-200 -rotate-45" />
                                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-orange-400 rounded-full blur-2xl animate-pulse" />
                                </div>
                            </div>
                        );
                    case 'sweat':
                        return (
                            <div key={effect.id} className="absolute right-[5%] top-[15%] animate-sweat-drop">
                                <Droplets className="w-56 h-56 text-blue-400 fill-blue-100" />
                            </div>
                        );
                    case 'focus':
                        return (
                            <div key={effect.id} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-focus-pop">
                                <div className="relative">
                                    <span className="text-[18rem] md:text-[25rem] filter drop-shadow-2xl select-none">💢</span>
                                </div>
                            </div>
                        );
                    case 'challenge':
                        return (
                            <div key={effect.id} className="absolute inset-0 flex items-center justify-center animate-master-entry">
                                <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 w-full py-16 flex flex-col items-center justify-center border-y-[12px] border-orange-500 shadow-[0_0_150px_rgba(124,58,237,0.7)] relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#d8b4fe_2px,_transparent_2px)] bg-[size:30px_30px] animate-pulse"></div>
                                    <div className="flex items-center gap-16 z-10 text-white">
                                        <Zap className="w-48 h-48 text-orange-400 animate-bounce fill-orange-400/20" />
                                        <div className="text-center">
                                            <div className="text-8xl font-black uppercase tracking-[0.25em] mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] italic">Modo Mestre</div>
                                            <div className="bg-orange-500 text-slate-900 px-12 py-4 rounded-full font-black text-3xl uppercase tracking-tighter shadow-2xl border-4 border-white/20">
                                                Pequenos detalhes, grandes resultados!
                                            </div>
                                        </div>
                                        <Star className="w-48 h-48 text-orange-400 animate-bounce [animation-delay:0.2s] fill-orange-400/20" />
                                    </div>
                                </div>
                            </div>
                        );
                    default: return null;
                }
            })}
        </div>
    );
};
