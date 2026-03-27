import React, { useState, useEffect } from 'react';
import { Headphones, Sparkles, Brain, Cpu } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        "Sintonizando frequências do Sensei...",
        "Analisando vocabulário do PDF...",
        "Criando cenários imersivos em japonês...",
        "Gerando áudios com vozes nativas...",
        "Polindo os detalhes da missão...",
        "Quase lá! Preparando os fones..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ice/80 backdrop-blur-xl transition-all duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-action/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main Content Card */}
            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
                
                {/* Visualizer Animation */}
                <div className="flex items-end justify-center gap-1.5 h-20 mb-10">
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={i}
                            className="w-1.5 bg-brand rounded-full animate-wave"
                            style={{ 
                                height: '20%',
                                animationDelay: `${i * 0.15}s`,
                                opacity: 0.3 + (i * 0.05)
                            }}
                        ></div>
                    ))}
                </div>

                {/* Central Icon */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-white rounded-3xl border-2 border-slate-border flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Headphones size={44} className="text-brand animate-bounce-gentle" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-action text-white p-2 rounded-2xl shadow-lg animate-float">
                        <Sparkles size={18} />
                    </div>
                </div>

                {/* Progress Info */}
                <h2 className="font-outfit text-2xl font-extrabold text-slate-dark mb-3 animate-fade-in">
                    Gerando sua Missão
                </h2>
                
                <div className="flex items-center justify-center gap-3 py-3 px-6 bg-white/50 border border-slate-border rounded-2xl shadow-sm mb-6 min-w-[300px]">
                    <div className="w-5 h-5 flex items-center justify-center text-brand">
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
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
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
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
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
