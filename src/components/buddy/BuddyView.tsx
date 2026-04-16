import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export type BuddyState = 'idle' | 'success' | 'error' | 'hidden';

interface BuddyViewProps {
    avatarUrl?: string;
    avatarId?: string | null;
    state?: BuddyState;
    message?: string | null;
    hideOnMobile?: boolean;
}

function getAudioPath(avatarId: string | null | undefined, message: string | null, type: 'success' | 'error'): string | null {
    if (!message) return null;
    
    const avatar = avatarId || 'avatar-tanuki-novato';
    const sanitizedMsg = message.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return `/assets/buddy-voices/${avatar}/${type}/${sanitizedMsg}.wav`;
}

export const BuddyView: React.FC<BuddyViewProps> = ({
    avatarUrl = '/assets/avatars/tanuki-novato.png',
    avatarId = null,
    state = 'idle',
    message = null,
    hideOnMobile = true
}) => {
    const controls = useAnimation();
    const prevState = useRef<BuddyState>('idle');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Toca áudio quando a mensagem muda, com controle de sobreposição e tracking de arquivos ausentes
    useEffect(() => {
        if (!message) return;

        // Deduz imediatamente o tipo da mensagem garantindo requisição síncrona
        const type = state === 'error' ? 'error' : 'success';
        const audioPath = getAudioPath(avatarId, message, type);
        
        if (audioPath) {
            // Paralisa rapidamente o áudio anterior antes de inciar a nova reprodução
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            const audio = new Audio(audioPath);
            audio.volume = 0.7;
            
            audio.play().catch((err) => {
                console.warn(`[Buddy - Áudio Ausente] Gerar o arquivo mp3: ${audioPath}`, err);
            });
            
            audioRef.current = audio;
        }
    }, [message, avatarId, state]);

    // Controle imperativo das animações — garante que CADA mudança de estado dispare
    useEffect(() => {
        const run = async () => {
            if (state === 'idle') {
                // Loop infinito de respiração/flutuação
                controls.start({
                    y: [0, -12, 0],
                    scale: [1, 1.03, 1],
                    rotate: [0, 1.5, 0, -1.5, 0],
                    transition: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut' as any,
                    },
                });
            } else if (state === 'success') {
                // Para o idle primeiro
                await controls.stop();
                // Executa o pulo de vitória
                await controls.start({
                    y: [0, -70, -20, 0],
                    scale: [1, 1.2, 0.88, 1],
                    rotate: [0, 12, -8, 0],
                    filter: [
                        'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                        'drop-shadow(0 0 25px rgba(34,197,94,0.7))',
                        'drop-shadow(0 0 10px rgba(34,197,94,0.3))',
                        'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                    ],
                    transition: {
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1] as any, // Spring-like easing
                    },
                });
                // Volta pro idle após a animação
                controls.start({
                    y: [0, -12, 0],
                    scale: [1, 1.03, 1],
                    rotate: [0, 1.5, 0, -1.5, 0],
                    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as any },
                });
            } else if (state === 'error') {
                await controls.stop();
                await controls.start({
                    x: [0, -12, 12, -12, 12, -6, 6, 0],
                    scale: [1, 0.92, 0.92, 1],
                    filter: [
                        'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                        'drop-shadow(0 0 20px rgba(239,68,68,0.6))',
                        'drop-shadow(0 0 10px rgba(239,68,68,0.3))',
                        'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                    ],
                    transition: {
                        duration: 0.5,
                        ease: 'easeOut' as any,
                    },
                });
                controls.start({
                    y: [0, -12, 0],
                    scale: [1, 1.03, 1],
                    rotate: [0, 1.5, 0, -1.5, 0],
                    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as any },
                });
            } else if (state === 'hidden') {
                controls.start({ y: 300, opacity: 0, transition: { duration: 0.5 } });
            }

            prevState.current = state;
        };

        run();
    }, [state, controls]);

    // Inicia o idle na montagem do componente
    useEffect(() => {
        controls.start({
            y: [0, -12, 0],
            scale: [1, 1.03, 1],
            rotate: [0, 1.5, 0, -1.5, 0],
            transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as any },
        });
    }, [controls]);

    const isFeedback = state === 'success' || state === 'error';
    
    // Mobile logic: Se hideOnMobile = true, esconde no idle. Quando for feedback, joga pro meio da tela.
    const mobileClasses = hideOnMobile 
        ? (isFeedback 
            ? 'flex bottom-[15vh] left-1/2 -translate-x-1/2 w-[240px] h-[280px]' 
            : 'hidden w-0 h-0')
        : 'flex bottom-4 right-4 w-24 h-32';
        
    const desktopClasses = 'md:flex md:bottom-8 md:right-8 md:left-auto md:translate-x-0 md:w-[180px] md:h-[240px]';

    return (
        <div
            className={`buddy-host fixed z-[1000] pointer-events-none items-end justify-center ${mobileClasses} ${desktopClasses}`}
        >
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 5 }}
                        className="buddy-speech-bubble"
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: '20%',
                            marginBottom: '10px',
                            background: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: '1.25rem 1.25rem 0.25rem 1.25rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                            minWidth: '120px',
                            maxWidth: '220px',
                            border: '2px solid var(--color-brand)',
                            zIndex: 1001,
                            pointerEvents: 'auto'
                        }}
                    >
                        <p style={{
                            margin: 0,
                            fontFamily: 'var(--font-outfit)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: 'var(--color-brand)',
                            lineHeight: 1.4,
                            textAlign: 'center'
                        }}>
                            {message}
                        </p>
                        <div style={{
                            position: 'absolute',
                            bottom: '-10px',
                            right: '4px',
                            width: '0',
                            height: '0',
                            borderLeft: '10px solid transparent',
                            borderTop: '10px solid var(--color-brand)'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={controls}
                className="flex w-full h-full items-end justify-center"
            >
                <img
                    src={avatarUrl}
                    alt="Destrave Buddy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                    }}
                />
            </motion.div>

            <style>{`
                @keyframes float-bubble {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .buddy-speech-bubble {
                    animation: float-bubble 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
