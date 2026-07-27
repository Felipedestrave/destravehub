import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';
import { Trash2, Link as LinkIcon, UserPlus, Phone, Activity, Filter, BarChart3, Eye, UserCheck } from 'lucide-react';

type Student = Tables<'students'>;

export default function LeadsList() {
    const [leads, setLeads] = useState<Student[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [impressions, setImpressions] = useState<Record<string, number>>({ A: 0, B: 0, C: 0 });

    // Filters
    const [originFilter, setOriginFilter] = useState<'all' | 'lp' | 'shared'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchImpressions = useCallback(async () => {
        try {
            // Acessa via 'as any' para evitar erro de tipo caso o schema local não esteja regenerado
            const { data, error } = await supabase
                .from('landing_page_impressions' as any)
                .select('variant');

            if (error) {
                console.error('Erro ao buscar impressões:', error);
                return;
            }

            const counts = (data || []).reduce((acc: Record<string, number>, curr: any) => {
                if (curr.variant && ['A', 'B', 'C'].includes(curr.variant)) {
                    acc[curr.variant] = (acc[curr.variant] || 0) + 1;
                }
                return acc;
            }, { A: 0, B: 0, C: 0 });

            setImpressions(counts);
        } catch (err) {
            console.error('Erro ao computar impressões:', err);
        }
    }, []);

    const fetchLeads = useCallback(async (tid: string) => {
        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('teacher_id', tid)
            .contains('metadata', { is_lead: true })
            .order('created_at', { ascending: false });
        
        setLeads(data ?? []);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { window.location.href = '/auth/login'; return; }
            setTeacherId(session.user.id);
            Promise.all([
                fetchLeads(session.user.id),
                fetchImpressions()
            ]).finally(() => setLoading(false));
        });
    }, [fetchLeads, fetchImpressions]);

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

    const handleStatusChange = async (id: string, newStatus: string) => {
        const lead = leads.find(l => l.id === id);
        if (!lead) return;

        const currentMeta = (lead.metadata as Record<string, any>) || {};
        const updatedMeta = { ...currentMeta, status: newStatus };

        const { error } = await supabase
            .from('students')
            .update({ metadata: updatedMeta })
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Não foi possível atualizar o status.');
            return;
        }

        setLeads(prev => prev.map(l => l.id === id ? { ...l, metadata: updatedMeta } : l));
    };

    const openWhatsApp = (phone: string | undefined | null) => {
        if (!phone) return;
        
        let cleaned = phone.replace(/\D/g, '');
        // Se o número não começa com sinalizador de DDI (+), nem com 55 (BR) ou 81 (JP) e tem tamanho nacional, adicionamos 55 como fallback
        if (!phone.startsWith('+') && !phone.startsWith('55') && !phone.startsWith('81') && cleaned.length <= 11) {
            cleaned = `55${cleaned}`;
        }
        
        window.open(`https://wa.me/${cleaned}`, '_blank');
    };

    // Filtragem no Client
    const filteredLeads = leads.filter(lead => {
        const meta = (lead.metadata as Record<string, any>) || {};
        
        // Filtro de Origem
        const isLp = meta.origin === 'landing_page';
        if (originFilter === 'lp' && !isLp) return false;
        if (originFilter === 'shared' && isLp) return false;

        // Filtro de Status
        const currentStatus = meta.status || 'Novo';
        if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;

        return true;
    });

    // Métricas A/B
    const getVariantMetrics = (v: 'A' | 'B' | 'C') => {
        const variantLeads = leads.filter(l => {
            const meta = (l.metadata as Record<string, any>) || {};
            return meta.origin === 'landing_page' && meta.ab_variant === v;
        }).length;
        
        const views = impressions[v] || 0;
        const convRate = views > 0 ? ((variantLeads / views) * 100).toFixed(1) : '0.0';

        return { leads: variantLeads, views, rate: convRate };
    };

    const metrics = {
        A: getVariantMetrics('A'),
        B: getVariantMetrics('B'),
        C: getVariantMetrics('C'),
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] text-slate-400">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
                <p>Carregando base de leads…</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                <div>
                    <h2 className="font-outfit font-black text-2xl text-slate-dark">Base de Leads</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Acompanhe e gerencie a captação de leads da Landing Page e links de atividades.
                    </p>
                </div>
                <button
                    onClick={() => {
                        const url = `${window.location.origin}/quero-destravar`;
                        navigator.clipboard.writeText(url);
                        alert('Link da Landing Page copiado para a área de transferência!');
                    }}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full md:w-auto"
                >
                    <LinkIcon size={16} className="text-brand" />
                    <span>Copiar Link da Landing Page</span>
                </button>
            </div>

            {/* A/B Testing Dashboard Panel */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-6 text-amber-500">
                    <BarChart3 size={20} />
                    <h3 className="font-outfit font-bold text-lg">Métricas do Teste A/B — Landing Page</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Variant A */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand"></div>
                        <h4 className="font-outfit font-bold text-sm text-slate-400">Variação A (Praticidade)</h4>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Eye size={10} /> Visitas</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.A.views}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><UserCheck size={10} /> Leads</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.A.leads}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">📈 Taxa</span>
                                <p className="text-xl font-bold font-outfit text-brand-hover mt-1">{metrics.A.rate}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Variant B */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                        <h4 className="font-outfit font-bold text-sm text-slate-400">Variação B (Conversação)</h4>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Eye size={10} /> Visitas</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.B.views}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><UserCheck size={10} /> Leads</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.B.leads}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">📈 Taxa</span>
                                <p className="text-xl font-bold font-outfit text-amber-500 mt-1">{metrics.B.rate}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Variant C */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <h4 className="font-outfit font-bold text-sm text-slate-400">Variação C (Leve/Customizado)</h4>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Eye size={10} /> Visitas</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.C.views}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><UserCheck size={10} /> Leads</span>
                                <p className="text-xl font-bold font-outfit mt-1">{metrics.C.leads}</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">📈 Taxa</span>
                                <p className="text-xl font-bold font-outfit text-emerald-500 mt-1">{metrics.C.rate}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border border-slate-200 gap-4">
                <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                    <Filter size={16} />
                    <span>Filtrar Leads:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Origin Filter */}
                    <select
                        value={originFilter}
                        onChange={(e) => setOriginFilter(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand font-medium cursor-pointer"
                    >
                        <option value="all">Todas as Origens</option>
                        <option value="lp">Landing Page</option>
                        <option value="shared">Links de Atividades</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand font-medium cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="Novo">Novo</option>
                        <option value="Contatado">Contatado</option>
                        <option value="Fechado">Fechado</option>
                        <option value="Arquivado">Arquivado</option>
                    </select>
                </div>
            </div>

            {/* Leads Cards Grid */}
            {filteredLeads.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                    <UserPlus className="text-slate-300 mx-auto" size={48} />
                    <div>
                        <h3 className="font-outfit font-bold text-xl text-slate-dark mb-2">Nenhum lead encontrado</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Tente alterar os filtros acima ou compartilhe o link do seu site para capturar leads.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeads.map((lead) => {
                        const meta = (lead.metadata as Record<string, any>) || {};
                        const whatsapp = meta.whatsapp || '';
                        const isLp = meta.origin === 'landing_page';
                        const status = meta.status || 'Novo';

                        // Cores dos status
                        let statusColor = 'bg-blue-100 text-blue-800';
                        if (status === 'Contatado') statusColor = 'bg-amber-100 text-amber-800';
                        if (status === 'Fechado') statusColor = 'bg-emerald-100 text-emerald-800';
                        if (status === 'Arquivado') statusColor = 'bg-slate-100 text-slate-600';

                        return (
                            <div key={lead.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                                {/* Linha colorida indicando status */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
                                    <div className={`h-full w-full ${
                                        status === 'Novo' ? 'bg-blue-500' :
                                        status === 'Contatado' ? 'bg-amber-500' :
                                        status === 'Fechado' ? 'bg-emerald-500' : 'bg-slate-400'
                                    }`}></div>
                                </div>
                                
                                <div className="pt-2">
                                    {/* Header do Card */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="max-w-[70%]">
                                            <h3 className="font-outfit font-bold text-lg text-slate-dark leading-tight truncate">{lead.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium truncate mt-1">
                                                {meta.email || 'Sem e-mail informado'}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                            {status}
                                        </span>
                                    </div>

                                    {/* Informações Qualificadas */}
                                    <div className="space-y-2 py-3 border-y border-slate-100 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-medium">Nível:</span>
                                            <span className="font-semibold text-slate-700">{lead.level || 'Não informado'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-medium">Origem:</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLp ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>
                                                {isLp ? 'Landing Page' : 'Atividade'}
                                            </span>
                                        </div>
                                        {isLp && meta.ab_variant && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 font-medium">Variante A/B:</span>
                                                <span className="font-bold text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded">
                                                    Var {meta.ab_variant}
                                                </span>
                                            </div>
                                        )}
                                        {!isLp && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-medium">Expiração:</span>
                                                <div className="flex bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold items-center gap-1">
                                                    <Activity size={10} /> 48h Act.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4 pt-2">
                                    {/* Alterador de Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-slate-400 font-medium">Status:</span>
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none focus:border-brand font-semibold cursor-pointer"
                                        >
                                            <option value="Novo">Novo</option>
                                            <option value="Contatado">Contatado</option>
                                            <option value="Fechado">Fechado</option>
                                            <option value="Arquivado">Arquivado</option>
                                        </select>
                                    </div>

                                    {/* Ações */}
                                    <button 
                                        onClick={() => openWhatsApp(whatsapp)}
                                        className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        disabled={!whatsapp}
                                    >
                                        <Phone size={16} /> Chamar no WhatsApp
                                    </button>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => copyLink(lead.experimental_uuid)}
                                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200"
                                        >
                                            <LinkIcon size={14} /> Copiar Link
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
