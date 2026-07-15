import React, { useState, useEffect } from 'react';
import { STORE_ITEMS } from '../../lib/store';
import { ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export const ThemesTestPage: React.FC = () => {
    const themes = STORE_ITEMS.filter(item => item.category === 'theme');
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentTheme = themes[currentIndex];

    const nextTheme = () => setCurrentIndex((prev) => (prev + 1) % themes.length);
    const prevTheme = () => setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length);

    // Apply theme in real-time when browsing the test page
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: currentTheme.id }));
    }, [currentIndex]);

    // Restore original theme when leaving the page
    useEffect(() => {
        return () => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    supabase.from('profiles')
                        .select('equipped')
                        .eq('id', session.user.id)
                        .maybeSingle()
                        .then(({ data }) => {
                            const originalTheme = (data?.equipped as any)?.theme || null;
                            window.dispatchEvent(new CustomEvent('theme-changed', { detail: originalTheme }));
                        });
                }
            });
        };
    }, []);

    return (
        <div className="theme-viewer-host">
            <div className="theme-preview-area">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentTheme.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="theme-background-preview"
                        style={{ backgroundImage: `url(${currentTheme.previewUrl})` }}
                    >
                        <div className="theme-overlay" />
                        <div className="theme-content-preview">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="preview-card-mockup"
                            >
                                <span className="preview-badge">MODO PRÉVIA</span>
                                <h1>{currentTheme.name}</h1>
                                <p>{currentTheme.description}</p>
                                
                                <div className="preview-stats-row">
                                    <div className="stat-pill">TESTANDO CORES</div>
                                    <div className="stat-pill" style={{ textTransform: 'uppercase' }}>{currentTheme.rarity}</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="theme-control-panel">
                <div className="theme-info-box">
                    <div className="theme-id-tag">
                         <MapPin size={14} />
                         <span>TEMA ATIVO: {currentTheme.id}</span>
                    </div>
                    <h2>{currentTheme.name}</h2>
                    <p>{currentTheme.description}</p>
                    <div className="rarity-indicator" data-rarity={currentTheme.rarity}>
                        {currentTheme.rarity.toUpperCase()}
                    </div>
                </div>

                <div className="theme-nav-buttons">
                    <button onClick={prevTheme} className="nav-btn">
                        <ChevronLeft size={24} />
                    </button>
                    
                    <div className="nav-indicator">
                        {currentIndex + 1} / {themes.length}
                    </div>

                    <button onClick={nextTheme} className="nav-btn">
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="extra-actions">
                    <a href="/dashboard/store" className="action-btn-go-store">
                        <Sparkles size={18} />
                        Ir para a Loja de Itens
                    </a>
                </div>
            </div>

            <style>{`
                .theme-viewer-host {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    font-family: var(--font-outfit);
                    animation: fade-in 0.5s ease-out;
                }
                .theme-preview-area {
                    width: 100%;
                    height: 320px;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    position: relative;
                    border: 1px solid var(--color-slate-border);
                    box-shadow: var(--shadow-card);
                }
                .theme-background-preview {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .theme-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
                    background-color: rgba(0,0,0,0.15);
                }
                .theme-content-preview {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 500px;
                    padding: 1.5rem;
                    width: 100%;
                }
                .preview-card-mockup {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.25);
                    padding: 2rem 1.5rem;
                    border-radius: 1.5rem;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                    color: white;
                }
                .preview-badge {
                    background: var(--color-brand);
                    color: white;
                    padding: 0.35rem 0.85rem;
                    border-radius: 99px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                }
                .preview-card-mockup h1 {
                    font-size: 1.75rem;
                    margin: 1.25rem 0 0.75rem;
                    font-weight: 800;
                    line-height: 1.2;
                }
                .preview-card-mockup p {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    line-height: 1.5;
                    margin: 0;
                }
                .preview-stats-row {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: center;
                    margin-top: 1.5rem;
                }
                .stat-pill {
                    background: rgba(255,255,255,0.15);
                    padding: 0.5rem 1rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                .theme-control-panel {
                    background: var(--color-white);
                    border: 1px solid var(--color-slate-border);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    box-shadow: var(--shadow-card);
                }
                .theme-info-box {
                    width: 100%;
                }
                .theme-id-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: var(--color-slate-mid);
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.75rem;
                }
                .theme-info-box h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                }
                .theme-info-box p {
                    font-size: 0.95rem;
                    color: var(--color-slate-mid);
                    margin: 0.5rem 0 1rem;
                }
                .rarity-indicator {
                    display: inline-block;
                    padding: 0.35rem 0.85rem;
                    border-radius: 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                    color: white;
                }
                .rarity-indicator[data-rarity="common"] { background: #64748b; }
                .rarity-indicator[data-rarity="rare"] { background: #3b82f6; }
                .rarity-indicator[data-rarity="epic"] { background: #a855f7; }
                .rarity-indicator[data-rarity="legendary"] { background: #eab308; color: black; }

                .theme-nav-buttons {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .nav-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 0.75rem;
                    background: var(--color-ice);
                    color: var(--color-slate-dark);
                    border: 1px solid var(--color-slate-border);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .nav-btn:hover {
                    transform: scale(1.05);
                    background: var(--color-brand);
                    color: white;
                }
                .nav-indicator {
                    font-weight: 800;
                    font-size: 1rem;
                    color: var(--color-slate-dark);
                }

                .extra-actions {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                }
                .action-btn-go-store {
                    padding: 0.85rem 2rem;
                    border-radius: 1rem;
                    border: none;
                    font-weight: 800;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    background: var(--color-brand);
                    color: white;
                    text-decoration: none;
                    box-shadow: 0 4px 14px 0 rgba(88,49,126,0.15);
                }
                .action-btn-go-store:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(88,49,126,0.3);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
