import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { STORE_ITEMS, type StoreItem } from '../../lib/store';
import { Sparkles, Shield, Image as ImageIcon, Check, Loader2, ArrowLeft, Layers } from 'lucide-react';

export const InventoryManager: React.FC = () => {
    const [inventory, setInventory] = useState<string[]>([]);
    const [equipped, setEquipped] = useState<any>({ avatar: null, theme: null, title: null });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'avatar' | 'theme' | 'title'>('avatar');

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('inventory, equipped')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setInventory((profile.inventory as any) || []);
                setEquipped(profile.equipped || { avatar: null, theme: null, title: null });
            }
        } catch (err) {
            console.error('[Inventory] Error fetching:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleEquip = async (item: StoreItem, isCurrentlyEquipped: boolean) => {
        setSaving(item.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const newEquipped = { ...equipped };
            // Se já estiver equipado, desequipa (null), senão equipa
            newEquipped[item.category] = isCurrentlyEquipped ? null : item.id;

            const res = await fetch('/api/store/equip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ equipped: newEquipped })
            });

            if (res.ok) {
                setEquipped(newEquipped);
                // Trigger global theme update if it's a theme change
                if (item.category === 'theme') {
                    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newEquipped.theme }));
                }
            }
        } catch (err) {
            console.error('[Inventory] Error equipping:', err);
        } finally {
            setSaving(null);
        }
    };

    const myItems = STORE_ITEMS.filter(item => inventory.includes(item.id));
    const filteredItems = myItems.filter(item => item.category === activeTab);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-brand" size={40} />
        </div>
    );

    return (
        <div className="inventory-view">
            <div className="inventory-header">
                <div className="header-tabs">
                    <button 
                        onClick={() => setActiveTab('avatar')}
                        className={`tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
                    >
                        <Shield size={18} /> Avatares
                    </button>
                    <button 
                        onClick={() => setActiveTab('theme')}
                        className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
                    >
                        <ImageIcon size={18} /> Cenários
                    </button>
                    <button 
                        onClick={() => setActiveTab('title')}
                        className={`tab-btn ${activeTab === 'title' ? 'active' : ''}`}
                    >
                        <Sparkles size={18} /> Títulos
                    </button>
                </div>
            </div>

            <div className="inventory-grid">
                {filteredItems.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon text-slate-300">
                             <Layers size={64} strokeWidth={1} />
                        </div>
                        <h3>Nada por aqui ainda!</h3>
                        <p>Visite a loja para desbloquear itens lendários com seus pontos.</p>
                        <a href="/dashboard/store" className="mt-4 inline-flex items-center gap-2 text-brand font-bold hover:underline">
                            Ir para a Loja <ArrowLeft className="rotate-180" size={16} />
                        </a>
                    </div>
                ) : (
                    filteredItems.map(item => {
                        const isEquipped = equipped[item.category] === item.id;
                        return (
                            <div 
                                key={item.id} 
                                className={`inventory-card ${isEquipped ? 'equipped' : ''}`}
                                onClick={() => handleEquip(item, isEquipped)}
                            >
                                <div className="card-preview">
                                    <img src={item.previewUrl} alt={item.name} />
                                    {isEquipped && <div className="equipped-badge"><Check size={12} /> EQUIPADO</div>}
                                </div>
                                <div className="card-info">
                                    <h4>{item.name}</h4>
                                    <span className="card-rarity">{item.rarity.toUpperCase()}</span>
                                </div>
                                {saving === item.id && (
                                    <div className="saving-overlay">
                                        <Loader2 className="animate-spin" size={24} />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <style>{`
                .inventory-view { padding: 1rem 0; }
                .inventory-header { margin-bottom: 2rem; }
                .header-tabs {
                    display: flex;
                    gap: 0.5rem;
                    background: var(--color-ice);
                    padding: 0.4rem;
                    border-radius: 1rem;
                    width: fit-content;
                }
                .tab-btn {
                    padding: 0.6rem 1.25rem;
                    border: none;
                    background: none;
                    border-radius: 0.75rem;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn:hover { color: var(--color-slate-dark); }
                .tab-btn.active {
                    background: white;
                    color: var(--color-brand);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1.5rem;
                }

                .inventory-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1.25rem;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .inventory-card:not(.equipped):hover {
                    transform: translateY(-5px);
                    border-color: var(--color-brand);
                    box-shadow: 0 10px 25px rgba(88,49,126,0.1);
                }
                .inventory-card.equipped {
                    border-color: var(--color-brand);
                    background: rgba(88,49,126,0.02);
                }

                .card-preview {
                    height: 180px;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    position: relative;
                }
                .card-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .equipped-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: var(--color-brand);
                    color: white;
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                }

                .card-info { padding: 1rem; text-align: center; }
                .card-info h4 {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 0.95rem;
                    margin: 0 0 0.25rem;
                    color: var(--color-slate-dark);
                }
                .card-rarity {
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: var(--color-slate-mid);
                    letter-spacing: 0.05em;
                }

                .saving-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-brand);
                }

                .empty-state {
                    grid-column: 1 / -1;
                    padding: 4rem;
                    text-align: center;
                    background: white;
                    border-radius: 1.5rem;
                    border: 2px dashed var(--color-slate-border);
                }
                .empty-icon { margin-bottom: 1rem; display: flex; justify-content: center; opacity: 0.3; }
                .empty-state h3 { font-family: var(--font-outfit); font-weight: 800; margin: 0 0 0.5rem; }
                .empty-state p { font-size: 0.9rem; color: var(--color-slate-mid); }
            `}</style>
        </div>
    );
};
