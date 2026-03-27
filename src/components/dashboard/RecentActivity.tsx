import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Clock, User, Gamepad2, PlayCircle, Trophy } from 'lucide-react';

export default function RecentActivity() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const response = await fetch('/api/teacher/recent-activity', {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setActivities(data.activities || []);
                }
            } catch (err) {
                console.error('[RecentActivity] Error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
        
        // Polling every 60s for updates
        const interval = setInterval(fetchActivities, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-slate-border p-6 animate-pulse">
                <div className="h-4 w-32 bg-slate-100 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-slate-100 rounded-2xl"></div>
                    <div className="h-12 bg-slate-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (activities.length === 0) return null;

    return (
        <div className="mb-8 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-border p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                        <PlayCircle size={18} className="text-brand" />
                    </div>
                    <h2 className="font-outfit font-bold text-slate-dark text-lg">Atividades Recentes</h2>
                </div>
                <span className="text-xs font-bold text-brand bg-brand/5 px-3 py-1 rounded-full border border-brand/10">Tempo Real</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((item) => {
                    const studentName = item.students?.name || 'Desconhecido';
                    const activityTitle = item.activities?.title || 'Atividade';
                    const score = item.result_data?.score || 0;
                    const isReplay = item.result_data?.is_practice || false;
                    const date = item.completed_at ? new Date(item.completed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
                    const fullDate = item.completed_at ? new Date(item.completed_at).toLocaleDateString('pt-BR') : '';

                    return (
                        <div key={item.id} className="group relative flex items-center gap-4 bg-white border border-slate-border p-4 rounded-2xl hover:border-brand/40 hover:shadow-md transition-all duration-300">
                            <div className={`w-12 h-12 ${isReplay ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                               {isReplay ? <Clock size={24} /> : <Trophy size={24} />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-dark truncate">
                                    {studentName}
                                </p>
                                <p className="text-xs text-slate-mid truncate">
                                    Concluiu: {activityTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {fullDate} às {date}
                                    </span>
                                    {isReplay && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 rounded">PRÁTICA</span>}
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-lg font-black font-outfit ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {score}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
