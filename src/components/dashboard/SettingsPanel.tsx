import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const SettingsPanel = () => {
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
        supabase.auth.getUser().then(({data}) => setUserId(data.user?.id || null));
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('whatsapp')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            if (data?.whatsapp) {
                setWhatsapp(data.whatsapp);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatWhatsAppDisplay = (digits: string) => {
        if (!digits) return '';
        
        // Japão (+81)
        if (digits.startsWith('81')) {
            let formatted = '+81 ';
            const rest = digits.slice(2);
            if (rest.length > 0) {
                formatted += rest.slice(0, 2);
                if (rest.length > 2) {
                    formatted += '-' + rest.slice(2, 6);
                    if (rest.length > 6) {
                        formatted += '-' + rest.slice(6, 13);
                    }
                }
            }
            return formatted.trim();
        }
        
        // Brasil (+55)
        if (digits.startsWith('55')) {
            let formatted = '+55 ';
            const rest = digits.slice(2);
            if (rest.length > 0) {
                formatted += '(' + rest.slice(0, 2) + ') ';
                if (rest.length > 2) {
                    formatted += rest.slice(2, 7);
                    if (rest.length > 7) {
                        formatted += '-' + rest.slice(7, 13);
                    }
                }
            }
            return formatted.trim();
        }

        // Outros: Apenas garante o + na frente
        return digits ? `+${digits}` : '';
    };

    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Pega apenas os dígitos
        const digits = val.replace(/\D/g, '');
        // Limite de 15 dígitos (padrão internacional)
        if (digits.length <= 15) {
            setWhatsapp(digits);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotification(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Não autenticado');

            // Validação mínima: precisa de DDI + Número
            if (whatsapp.length < 8) {
                throw new Error('Por favor, informe um número de WhatsApp válido com código de país.');
            }

            const { error } = await supabase
                .from('profiles')
                .update({ whatsapp: whatsapp }) // Agora 'whatsapp' no state já é apenas dígitos
                .eq('id', session.user.id);

            if (error) throw error;

            setNotification({ type: 'success', message: 'Configurações de contato salvas!' });
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setNotification({ type: 'error', message: error.message || 'Erro ao salvar configurações.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animation-fade-in">
            {notification && (
                <div className={`mb-6 p-4 rounded-xl border-2 font-inter font-bold ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-border p-8 shadow-sm">
                <h2 className="font-outfit text-xl font-bold text-slate-dark mb-6">Informações de Contato</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-dark mb-2 font-outfit uppercase tracking-wider">
                            WhatsApp do Sensei (Recomendado)
                        </label>
                        <p className="text-xs text-slate-mid mb-3 font-inter">
                            Inicie com o código do país (ex: 81 para Japão, 55 para Brasil). Os alunos usarão este contato ao concluir missões.
                        </p>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                value={formatWhatsAppDisplay(whatsapp)} 
                                onChange={handleWhatsAppChange}
                                placeholder="81 90-XXXX-XXXX" 
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-colors font-inter font-medium text-slate-dark placeholder-slate-mid"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-mono text-slate-mid">SUA ID: {userId}</p>
                    <button type="submit" disabled={saving} className="btn-brand px-8 py-3 rounded-xl font-outfit font-bold flex items-center gap-2 disabled:opacity-50">
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};
