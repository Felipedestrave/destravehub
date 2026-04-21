import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, BookOpen, Target, CheckCircle2 } from 'lucide-react';

interface AgendaItem {
    id: string;
    type: 'class' | 'mission';
    title: string;
    time?: string;
    date: Date;
    status?: string;
    meta?: any;
}

export const AgendaView: React.FC = () => {
    const [items, setItems] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgenda = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // 1. Fetch Student ID from profiles link
                const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('student_id', session.user.id)
                    .single();

                if (!student) return;

                // 2. Fetch Appointments
                const { data: appointments } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('student_id', student.id)
                    .gte('start_time', new Date().toISOString())
                    .order('start_time', { ascending: true });

                // 3. Fetch Missions (limit to 5 most recent pending)
                const { data: missions } = await supabase
                    .from('assignments')
                    .select('*, activities(title, type)')
                    .eq('student_id', student.id)
                    .eq('status', 'pending')
                    .order('assigned_at', { ascending: false })
                    .limit(5);

                const agendaItems: AgendaItem[] = [];

                // Transform Appointments
                appointments?.forEach(app => {
                    agendaItems.push({
                        id: app.id,
                        type: 'class',
                        title: app.title,
                        date: new Date(app.start_time),
                        time: new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        meta: app.description || undefined
                    });
                });

                // Transform Missions
                missions?.forEach(miss => {
                    agendaItems.push({
                        id: miss.id,
                        type: 'mission',
                        title: (miss.activities as any)?.title || 'Missão Sem Título',
                        date: new Date(miss.assigned_at || Date.now()),
                        status: miss.status || undefined,
                        meta: (miss.activities as any)?.type || undefined
                    });
                });

                // Sort everything by date
                agendaItems.sort((a, b) => a.date.getTime() - b.date.getTime());
                setItems(agendaItems);

            } catch (err) {
                console.error('[AgendaView] Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenda();
    }, []);

    if (loading) return <div className="agenda-loading">Sincronizando agenda...</div>;

    if (items.length === 0) return (
        <div className="agenda-empty">
            <div className="empty-glow">✨</div>
            <h3>Sua agenda está livre!</h3>
            <p>Aproveite para revisar seus itens na loja ou praticar no modo livre.</p>
        </div>
    );

    return (
        <div className="agenda-container">
            <h2 className="agenda-title">Atividades a fazer</h2>
            
            <div className="timeline">
                {items.map((item, idx) => {
                    const isToday = item.date.toDateString() === new Date().toDateString();
                    
                    return (
                        <div key={item.id} className={`timeline-item ${item.type}`}>
                            <div className="timeline-left">
                                <div className="time-box">
                                    {isToday ? (
                                        <span className="today-badge">HOJE</span>
                                    ) : (
                                        <span className="date-label">
                                            {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    )}
                                    <span className="hour-label">{item.time || '—'}</span>
                                </div>
                                <div className="line-node" />
                            </div>

                            <div className="timeline-content">
                                <div className="content-card">
                                    <div className="card-icon">
                                        {item.type === 'class' ? <Clock size={16} /> : <Target size={16} />}
                                    </div>
                                    <div className="card-info">
                                        <div className="card-type-label">
                                            {item.type === 'class' ? 'AULA AGENDADA' : 'MISSÃO PENDENTE'}
                                        </div>
                                        <h4 className="card-title">{item.title}</h4>
                                        {item.meta && item.type === 'class' && (
                                            <p className="card-meta">{item.meta}</p>
                                        )}
                                    </div>
                                    <div className="card-action-hint">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .agenda-container {
                    background: white;
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid var(--color-slate-border);
                    height: 100%;
                }
                .agenda-title {
                    font-family: var(--font-outfit);
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    margin-bottom: 2rem;
                }

                .timeline {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .timeline-item {
                    display: flex;
                    gap: 1.5rem;
                    position: relative;
                }

                .timeline-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;
                    flex-shrink: 0;
                }

                .time-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }
                .today-badge {
                    background: #22c55e;
                    color: white;
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                }
                .date-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                }
                .hour-label {
                    font-size: 0.7rem;
                    color: var(--color-slate-mid);
                    font-weight: 600;
                }

                .line-node {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 0 0 2px var(--color-brand);
                    background: white;
                    margin-top: 1rem;
                    z-index: 2;
                }
                .timeline-item::after {
                    content: '';
                    position: absolute;
                    left: 29px;
                    top: 40px;
                    bottom: -30px;
                    width: 2px;
                    background: var(--color-slate-border);
                    z-index: 1;
                }
                .timeline-item:last-child::after {
                    display: none;
                }

                .timeline-content {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                }
                .content-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--color-ice);
                    padding: 1rem;
                    border-radius: 1.25rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border: 1.5px solid transparent;
                }
                .content-card:hover {
                    background: white;
                    border-color: var(--color-brand);
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(88,49,126,0.06);
                }

                .card-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 0.75rem;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-brand);
                    flex-shrink: 0;
                }
                .timeline-item.class .card-icon { color: #3b82f6; }
                .timeline-item.mission .card-icon { color: #f59e0b; }

                .card-info {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                }
                .card-type-label {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    color: var(--color-slate-mid);
                    margin-bottom: 0.2rem;
                }
                .card-title {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .card-meta {
                    font-size: 0.75rem;
                    color: var(--color-slate-mid);
                    margin-top: 0.2rem;
                }

                .card-action-hint {
                    color: var(--color-slate-border);
                }

                .agenda-loading, .agenda-empty {
                    padding: 3rem;
                    text-align: center;
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px dashed var(--color-slate-border);
                }
                .empty-glow { font-size: 2rem; margin-bottom: 0.5rem; }
                .agenda-empty h3 { font-family: var(--font-outfit); font-weight: 800; margin-bottom: 0.5rem; }
                .agenda-empty p { font-size: 0.85rem; color: var(--color-slate-mid); }
            `}</style>
        </div>
    );
};

const ChevronRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
