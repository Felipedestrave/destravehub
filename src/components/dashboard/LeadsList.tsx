import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';
import { Trash2, Link as LinkIcon, UserPlus, Phone, Activity } from 'lucide-react';

type Student = Tables<'students'>;

export default function LeadsList() {
    const [leads, setLeads] = useState<Student[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLeads = useCallback(async (tid: string) => {
        // Buscamos estudantes onde metadata->is_lead seja verdadeiro
        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('teacher_id', tid)
            // Utiliza-se contains filter para campos jsons
            .contains('metadata', { is_lead: true })
            .order('created_at', { ascending: false });
        
        // Em um sistema real poderíamos buscar no json usando o query builder, 
        // mas supabase contains no jsonb funciona perfeitamente para metadata.
        
        setLeads(data ?? []);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { window.location.href = '/auth/login'; return; }
            setTeacherId(session.user.id);
            fetchLeads(session.user.id).finally(() => setLoading(false));
        });
    }, [fetchLeads]);

    const copyLink = (uuid: string | null) => {
        if (!uuid) return;
        const url = `${window.location.origin}/share/${uuid}`;
        navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
    };

    const handleDeleteLead = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o lead ${name}? O histórico será perdido.`)) return;

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir lead:', error);
            alert('Não foi possível excluir.');
            return;
        }

        setLeads(prev => prev.filter(s => s.id !== id));
    };

    const openWhatsApp = (phone: string | undefined | null) => {
        if (!phone) return;
        const numbersOnly = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${numbersOnly}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] text-slate-400">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
                <p>Carregando leads…</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-center justify-between pb-4 border-b border-slate-200">
                <div>
                    <h2 className="font-outfit font-black text-2xl text-slate-dark">Base de Leads</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Usuários capturados via link experimental ({leads.length})
                    </p>
                </div>
            </div>

            {leads.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center gap-4">
                    <UserPlus className="text-slate-300 mx-auto" size={48} />
                    <div>
                        <h3 className="font-outfit font-bold text-xl text-slate-dark mb-2">Nenhum lead capturado ainda</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Compartilhe suas atividades experimentais em redes sociais ou anúncios para atrair estudantes!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.map((lead) => {
                        const meta = (lead.metadata as Record<string, any>) || {};
                        const whatsapp = meta.whatsapp || '';
                        
                        return (
                            <div key={lead.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-brand"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-outfit font-bold text-lg text-slate-dark leading-tight">{lead.name}</h3>
                                        {meta.email && (
                                            <p className="text-xs text-slate-400 font-medium truncate mt-1">{meta.email}</p>
                                        )}
                                    </div>
                                    <div className="flex bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold items-center gap-1">
                                        <Activity size={12} /> Expirará
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3 mt-4">
                                    <button 
                                        onClick={() => openWhatsApp(whatsapp)}
                                        className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        disabled={!whatsapp}
                                    >
                                        <Phone size={16} /> Chamar no WhatsApp
                                    </button>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => copyLink(lead.experimental_uuid)}
                                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200"
                                        >
                                            <LinkIcon size={14} /> Link
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-red-100"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
