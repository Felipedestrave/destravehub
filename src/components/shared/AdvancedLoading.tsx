import React, { useState, useEffect } from 'react';
import { type LucideIcon, Brain, Cpu, Sparkles } from 'lucide-react';

interface AdvancedLoadingProps {
    title?: string;
    messages: string[];
    Icon: LucideIcon;
    accentColor?: string;
    type?: 'wave' | 'pulse' | 'cards';
}

export const AdvancedLoading: React.FC<AdvancedLoadingProps> = ({ 
    title = "Gerando sua Missão", 
    messages, 
    Icon, 
    accentColor = "var(--color-brand)",
    type = 'wave'
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ice/80 backdrop-blur-xl transition-all duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-20 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: accentColor }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-20 rounded-full blur-[120px] animate-pulse" style={{ backgroundColor: accentColor, animationDelay: '1s' }}></div>

            {/* Main Content Card */}
            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
                
                {/* Visualizer Animation */}
                {type === 'wave' && (
                    <div className="flex items-end justify-center gap-1.5 h-20 mb-10">
                        {[...Array(12)].map((_, i) => (
                            <div 
                                key={i}
                                className="w-1.5 rounded-full animate-wave"
                                style={{ 
                                    backgroundColor: accentColor,
                                    height: '20%',
                                    animationDelay: `${i * 0.15}s`,
                                    opacity: 0.3 + (i * 0.05)
                                }}
                            ></div>
                        ))}
                    </div>
                )}

                {type === 'pulse' && (
                    <div className="relative w-24 h-24 mb-10">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: accentColor }}></div>
                        <div className="absolute inset-4 rounded-full animate-ping opacity-40" style={{ backgroundColor: accentColor, animationDelay: '0.5s' }}></div>
                        <div className="relative w-full h-full bg-white rounded-full border-2 border-slate-border flex items-center justify-center shadow-lg">
                             <Icon size={40} style={{ color: accentColor }} className="animate-bounce-gentle" />
                        </div>
                    </div>
                )}

                {type === 'cards' && (
                    <div className="relative w-24 h-32 mb-10">
                         <div className="absolute top-0 left-0 w-full h-full bg-white border-2 border-slate-border rounded-xl shadow-md rotate-[-10deg] animate-float-slow"></div>
                         <div className="absolute top-0 left-0 w-full h-full bg-white border-2 border-slate-border rounded-xl shadow-md rotate-[5deg] animate-float"></div>
                         <div className="absolute top-0 left-0 w-full h-full bg-white border-2 border-slate-border rounded-xl shadow-xl flex items-center justify-center">
                              <Icon size={40} style={{ color: accentColor }} />
                         </div>
                    </div>
                )}

                {/* Central Icon (if not pulse) */}
                {type !== 'pulse' && type !== 'cards' && (
                     <div className="relative mb-8">
                        <div className="w-24 h-24 bg-white rounded-3xl border-2 border-slate-border flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Icon size={44} style={{ color: accentColor }} className="animate-bounce-gentle" />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-slate-800 text-white p-2 rounded-2xl shadow-lg animate-float">
                            <Sparkles size={18} />
                        </div>
                    </div>
                )}

                {/* Progress Info */}
                <h2 className="font-outfit text-2xl font-extrabold text-slate-dark mb-3 animate-fade-in">
                    {title}
                </h2>
                
                <div className="flex items-center justify-center gap-3 py-3 px-6 bg-white/50 border border-slate-border rounded-2xl shadow-sm mb-6 min-w-[300px]">
                    <div className="w-5 h-5 flex items-center justify-center" style={{ color: accentColor }}>
                        {messageIndex % 3 === 0 ? <Brain size={18} className="animate-pulse" /> : 
                         messageIndex % 3 === 1 ? <Cpu size={18} className="animate-spin-slow" /> : 
                         <Sparkles size={18} className="animate-bounce" />}
                    </div>
                    <p className="font-inter font-medium text-slate-mid text-sm transition-all duration-500">
                        {messages[messageIndex]}
                    </p>
                </div>

                {/* Subtext */}
                <div className="flex flex-col gap-1 items-center">
                   <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: accentColor }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: accentColor }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor }}></div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-border uppercase tracking-[0.2em] mt-4">
                        Destrave AI Engine v4.0
                   </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes wave {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-wave {
                    animation: wave 1.2s ease-in-out infinite;
                }
                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-gentle {
                    animation: bounce-gentle 2s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-5px) rotate(-15deg); }
                }
                .animate-float-slow {
                    animation: float-slow 4s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}} />
        </div>
    );
};
