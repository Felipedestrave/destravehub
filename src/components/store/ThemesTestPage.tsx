import React, { useState } from 'react';
import { STORE_ITEMS } from '../../lib/store';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemesTestPage: React.FC = () => {
    const themes = STORE_ITEMS.filter(item => item.category === 'theme');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showUI, setShowUI] = useState(true);

    const currentTheme = themes[currentIndex];

    const nextTheme = () => setCurrentIndex((prev) => (prev + 1) % themes.length);
    const prevTheme = () => setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length);

    return (
        <div className="theme-viewer-host">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentTheme.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="theme-background-full"
                    style={{ backgroundImage: `url(${currentTheme.previewUrl})` }}
                >
                    {/* Dark Overlay for Readability */}
                    <div className="theme-overlay" />
                    
                    {/* Simulated Dashboard Content */}
                    <div className="theme-content-preview">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="preview-card-mockup"
                        >
                            <span className="preview-badge">MODO ESTUDO</span>
                            <h1>Onde você quer estudar hoje?</h1>
                            <p>O ambiente de estudo muda conforme o seu progresso e conquistas no Mercado Destrave.</p>
                            
                            <div className="preview-stats-row">
                                <div className="stat-pill">50 XP HOJE</div>
                                <div className="stat-pill">NÍVEL 12</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className={`theme-controls-floating ${showUI ? 'visible' : 'hidden'}`}>
                <div className="theme-info-box">
                    <div className="theme-id-tag">
                         <MapPin size={14} />
                         <span>SESSÃO: {currentTheme.name}</span>
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
                    <button onClick={() => setShowUI(!showUI)} className="action-btn-toggle">
                        <Maximize2 size={18} />
                        {showUI ? 'Ocultar Interface' : 'Mostrar Interface'}
                    </button>
                    <a href="/dashboard/store" className="action-btn-go-store">
                        <Sparkles size={18} />
                        Ir para Loja
                    </a>
                </div>
            </div>

            {!showUI && (
                 <button onClick={() => setShowUI(true)} className="show-ui-corner">
                    <Maximize2 size={24} />
                 </button>
            )}

            <style>{`
                .theme-viewer-host {
                    width: 100vw;
                    height: 100vh;
                    background: black;
                    overflow: hidden;
                    position: fixed;
                    top: 0; left: 0;
                    z-index: 1000;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                }
                .theme-background-full {
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
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
                    background-color: rgba(0,0,0,0.2);
                }
                .theme-content-preview {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 600px;
                    padding: 2rem;
                }
                .preview-card-mockup {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 3rem 2rem;
                    border-radius: 2rem;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .preview-badge {
                    background: var(--color-brand, #58317E);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                }
                .preview-card-mockup h1 {
                    font-size: 2.5rem;
                    margin: 1.5rem 0 1rem;
                    font-weight: 800;
                }
                .preview-card-mockup p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                    line-height: 1.6;
                }
                .preview-stats-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                }
                .stat-pill {
                    background: rgba(255,255,255,0.1);
                    padding: 0.6rem 1.2rem;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .theme-controls-floating {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 450px;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .theme-controls-floating.hidden {
                    bottom: -300px;
                    opacity: 0;
                }

                .theme-info-box {
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1.5px solid rgba(255,255,255,0.15);
                    padding: 1.5rem;
                    border-radius: 1.5rem;
                    text-align: center;
                    width: 100%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                }
                .theme-id-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #94A3B8;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.75rem;
                }
                .theme-info-box h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                }
                .theme-info-box p {
                    font-size: 0.9rem;
                    color: #CBD5E1;
                    margin: 0.5rem 0 1rem;
                }
                .rarity-indicator {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                }
                .rarity-indicator[data-rarity="common"] { background: #64748b; }
                .rarity-indicator[data-rarity="rare"] { background: #3b82f6; }
                .rarity-indicator[data-rarity="epic"] { background: #a855f7; }
                .rarity-indicator[data-rarity="legendary"] { background: #eab308; color: black; }

                .theme-nav-buttons {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .nav-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 1rem;
                    background: white;
                    color: black;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .nav-btn:hover {
                    transform: scale(1.1);
                    background: var(--color-brand, #58317E);
                    color: white;
                }
                .nav-indicator {
                    font-weight: 800;
                    font-size: 1.1rem;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }

                .extra-actions {
                    display: flex;
                    gap: 1rem;
                }
                .action-btn-toggle, .action-btn-go-store {
                    padding: 0.75rem 1.25rem;
                    border-radius: 1rem;
                    border: none;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .action-btn-toggle {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                .action-btn-toggle:hover {
                    background: rgba(255,255,255,0.2);
                }
                .action-btn-go-store {
                    background: #22c55e;
                    color: white;
                    text-decoration: none;
                }
                .action-btn-go-store:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(34,197,94,0.4);
                }

                .show-ui-corner {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 100;
                    background: white;
                    color: black;
                    width: 60px;
                    height: 60px;
                    border-radius: 1.5rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
};
