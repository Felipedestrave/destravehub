import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, CheckCircle2, Lock, Sparkles, User, Palette, Type, ArrowRight, Loader2, Coins } from 'lucide-react';
import { STORE_ITEMS, type StoreItem, type ItemCategory } from '../../lib/store';
import { supabase } from '../../lib/supabase';

interface StoreViewProps {}

export const StoreView: React.FC<StoreViewProps> = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [activeCategory, setActiveCategory] = useState<ItemCategory>('avatar');
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) return;
            supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
                setProfile(data);
                setLoadingProfile(false);
            });
        });
    }, []);

    const categories = [
        { id: 'avatar' as ItemCategory, label: 'Avatares', icon: User },
        { id: 'theme' as ItemCategory, label: 'Temas', icon: Palette },
        { id: 'title' as ItemCategory, label: 'Títulos', icon: Type },
    ];

    const filteredItems = STORE_ITEMS.filter(item => item.category === activeCategory);
    const ownedItems = (profile?.inventory as string[]) || [];
    const equippedItems = (profile?.equipped as Record<string, string>) || {};

    const handlePurchase = async (item: StoreItem) => {
        setIsLoading(item.id);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Não autenticado');

            const res = await fetch('/api/store/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ itemId: item.id })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Falha na compra');

            // Atualiza perfil local
            setProfile((prev: any) => ({
                ...prev,
                coins: data.newBalance,
                inventory: [...(prev.inventory || []), item.id]
            }));
            
            // Sucesso! (Poderia ter um confetti aqui)
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(null);
        }
    };

    const handleEquip = async (item: StoreItem, isCurrentlyEquipped: boolean) => {
        setIsLoading(`equip-${item.id}`);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Não autenticado');

            const newEquipped = {
                ...equippedItems,
                [item.category]: isCurrentlyEquipped ? null : item.id
            };

            const res = await fetch('/api/store/equip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ equipped: newEquipped })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Falha ao equipar');

            setProfile((prev: any) => ({
                ...prev,
                equipped: newEquipped
            }));

            if (item.category === 'theme') {
                window.dispatchEvent(new CustomEvent('theme-changed', { detail: newEquipped.theme }));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(null);
        }
    };

    const getRarityClass = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'rarity-common';
            case 'rare': return 'rarity-rare';
            case 'epic': return 'rarity-epic';
            case 'legendary': return 'rarity-legendary';
            default: return '';
        }
    };

    const translateRarity = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'Comum';
            case 'rare': return 'Raro';
            case 'epic': return 'Épico';
            case 'legendary': return 'Lendário';
            default: return rarity;
        }
    };

    return (
        <div className="store-view-container">
            {/* Header / Balance */}
            <div className="store-header">
                <div className="balance-badge">
                   <div className="coin-icon-wrapper">
                      <Coins size={20} className="text-amber-500" />
                   </div>
                   <div className="balance-info">
                      <span className="balance-label uppercase tracking-tighter opacity-70">Saldo Atual</span>
                      <span className="balance-amount font-outfit font-black">{profile?.coins || 0} DC</span>
                   </div>
                </div>
                
                {error && (
                    <div className="store-error-toast">
                        {error}
                        <button onClick={() => setError(null)}>&times;</button>
                    </div>
                )}
            </div>

            {/* Categories */}
            <div className="store-categories">
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    >
                        <cat.icon size={18} />
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="store-grid">
                {filteredItems.map(item => {
                    const isOwned = ownedItems.includes(item.id);
                    const isEquipped = equippedItems[item.category] === item.id;
                    const canAfford = (profile?.coins || 0) >= item.price;
                    const loading = isLoading === item.id || isLoading === `equip-${item.id}`;

                    return (
                        <div key={item.id} className={`store-card ${isOwned ? 'owned' : ''} ${getRarityClass(item.rarity)}`}>
                            <div className="card-rarity-tag">{translateRarity(item.rarity)}</div>
                            
                            <div className="card-preview">
                                {item.category === 'avatar' ? (
                                    <div className="preview-avatar-bg" style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                        {item.previewUrl ? (
                                            <img src={item.previewUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <>
                                                <User size={48} className="text-slate-200" />
                                                <div className="preview-indicator">PRÉVIA</div>
                                            </>
                                        )}
                                    </div>
                                ) : item.category === 'theme' ? (
                                    <div className="preview-theme-bg" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: item.metadata?.class === 'theme-midnight' ? '#1e1b4b' : item.metadata?.class === 'theme-sakura' ? '#fdf2f8' : '#f8fafc' }}>
                                        {item.previewUrl ? (
                                            <img src={item.previewUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Palette size={48} className="opacity-20" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="preview-title-bg" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '1.25rem', background: '#f8fafc' }}>
                                        {item.previewUrl ? (
                                            <img src={item.previewUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <Type size={48} className="text-slate-200" />
                                                <div className="preview-indicator">PRÉVIA</div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="card-info">
                                <h3 className="item-name font-outfit font-black">{item.name}</h3>
                                <p className="item-desc">{item.description}</p>
                            </div>

                            <div className="card-actions">
                                {isOwned ? (
                                    <button 
                                        onClick={() => handleEquip(item, isEquipped)}
                                        disabled={loading}
                                        className={`btn-equip ${isEquipped ? 'equipped' : ''}`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : isEquipped ? <><CheckCircle2 size={16} /> Equipado</> : 'Equipar'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handlePurchase(item)}
                                        disabled={!canAfford || loading}
                                        className="btn-buy"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                            <>
                                                <Coins size={16} />
                                                <span>{item.price} DC</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .store-view-container {
                    display: flex; flex-direction: column; gap: 2rem;
                }
                .store-header { display: flex; align-items: center; justify-content: space-between; }
                .balance-badge {
                    background: white; border: 2px solid var(--color-slate-border); padding: 0.75rem 1.25rem;
                    border-radius: 1.25rem; display: flex; align-items: center; gap: 1rem;
                    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
                }
                .coin-icon-wrapper { width: 36px; height: 36px; background: #fffbeb; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; border: 1.5px solid #fef3c7; }
                .balance-info { display: flex; flex-direction: column; }
                .balance-label { font-size: 0.65rem; font-weight: 800; }
                .balance-amount { font-size: 1.25rem; color: #d97706; line-height: 1; }

                .store-categories { display: flex; gap: 0.75rem; }
                .cat-btn {
                    padding: 0.75rem 1.5rem; border-radius: 1rem; border: 2px solid var(--color-slate-border);
                    background: white; font-family: var(--font-outfit); font-weight: 800; color: var(--color-slate-mid);
                    display: flex; align-items: center; gap: 0.6rem; cursor: pointer; transition: all 0.2s;
                }
                .cat-btn.active { border-color: var(--color-brand); color: var(--color-brand); background: var(--color-ice); box-shadow: 0 8px 15px -5px rgba(88,49,126,0.1); }
                .cat-btn:hover:not(.active) { background: #f8fafc; border-color: #cbd5e1; }

                .store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
                
                .store-card {
                    background: white; border: 2.5px solid var(--color-slate-border); border-radius: 2rem;
                    padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
                    position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .store-card:hover { transform: translateY(-8px); border-color: var(--color-brand); box-shadow: 0 20px 40px -15px rgba(88,49,126,0.15); }
                .store-card.owned { border-color: #e2e8f0; background: #fcfcfd; }
                
                .card-rarity-tag {
                    position: absolute; top: 1rem; right: 1rem; font-size: 0.6rem; font-weight: 900;
                    text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 99px; letter-spacing: 0.05em;
                }
                .rarity-common .card-rarity-tag { background: #f1f5f9; color: #475569; }
                .rarity-rare .card-rarity-tag { background: #dcfce7; color: #166534; }
                .rarity-epic .card-rarity-tag { background: #f3e8ff; color: #6b21a8; }
                .rarity-legendary .card-rarity-tag { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }

                .card-preview {
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    border-radius: 1.25rem; 
                    background: #f8fafc;
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    position: relative;
                    margin-top: 1.5rem;
                }
                .preview-indicator { position: absolute; bottom: 0.5rem; font-size: 0.55rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.1em; }
                .preview-title-bg { display: flex; flex-direction: column; align-items: center; }

                .card-info { flex: 1; }
                .item-name { font-size: 1.25rem; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .item-desc { font-size: 0.85rem; color: var(--color-slate-mid); line-height: 1.4; margin: 0; }

                .btn-buy, .btn-equip {
                    width: 100%; padding: 0.85rem; border-radius: 1rem; font-family: var(--font-outfit);
                    font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .btn-buy { background: var(--color-brand); color: white; border: none; }
                .btn-buy:hover:not(:disabled) { transform: scale(1.03); filter: brightness(1.1); box-shadow: 0 10px 20px -5px rgba(88,49,126,0.3); }
                .btn-buy:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); }

                .btn-equip { background: white; border: 2px solid var(--color-slate-border); color: var(--color-slate-dark); }
                .btn-equip:hover:not(:disabled) { background: #f8fafc; border-color: var(--color-brand); color: var(--color-brand); }
                .btn-equip.equipped { background: #f0fdf4; border-color: #22c55e; color: #166534; cursor: default; }

                .store-error-toast { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.75rem; }
            `}</style>
        </div>
    );
};
