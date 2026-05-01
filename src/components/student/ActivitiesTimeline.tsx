import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, Clock, Target, BookOpen, AlertCircle } from 'lucide-react';

interface TimelineNode {
  id: string;
  type: 'class' | 'mission' | 'srs';
  title: string;
  status: 'completed' | 'active' | 'upcoming' | 'locked';
  date: Date;
  meta?: string;
  link?: string;
}

export const ActivitiesTimeline: React.FC = () => {
  const [nodes, setNodes] = useState<TimelineNode[]>([]);
  const [loading, setLoading] = useState(true);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Auto-scroll to active item when loaded
    if (!loading && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, nodes]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', session.user.id)
        .single();
      if (!student) return;

      // Fetch
      const { data: assignments } = await supabase
        .from('assignments')
        .select('*, activities(title, type)')
        .eq('student_id', student.id)
        .order('assigned_at', { ascending: true });

      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', student.id)
        .order('start_time', { ascending: true });

      const allNodes: TimelineNode[] = [];

      appointments?.forEach(app => {
        const date = new Date(app.start_time);
        allNodes.push({
          id: app.id, type: 'class', title: app.title, date,
          status: date < new Date() ? 'completed' : date.toDateString() === new Date().toDateString() ? 'active' : 'upcoming',
          meta: 'Aula Agendada', link: '/dashboard/calendar'
        });
      });

      assignments?.forEach(miss => {
        const title = (miss.activities as any)?.title || 'Missão';
        allNodes.push({
          id: miss.id, type: 'mission', title, date: new Date(miss.assigned_at || new Date().toISOString()),
          status: miss.status === 'completed' ? 'completed' : 'active',
          link: `/dashboard/missions/${(miss.activities as any)?.type}?assignment=${miss.id}`
        });

        const res = miss.result_data as any;
        if (res?.repetition) {
          res.repetition.forEach((m: any) => {
            const date = new Date(m.scheduledDate);
            allNodes.push({
              id: `${miss.id}-srs-${m.milestone}`, type: 'srs', title: `Revisão: ${title}`, date,
              status: m.status === 'completed' ? 'completed' : date <= new Date() ? 'active' : 'upcoming',
              meta: `SRS Etapa ${m.milestone}`, link: `/dashboard/missions/${(miss.activities as any)?.type}?assignment=${miss.id}`
            });
          });
        }
      });

      // Sort chronological
      allNodes.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Find the "Active" focus (first non-completed task)
      let activeIndex = allNodes.findIndex(n => n.status !== 'completed');
      if (activeIndex === -1) activeIndex = allNodes.length - 1; // if all done, focus on last
      if (activeIndex === -1) activeIndex = 0;

      // Slice logic: 15 before, 34 after (Total 50)
      const start = Math.max(0, activeIndex - 15);
      const end = Math.min(allNodes.length, activeIndex + 35);
      
      const limitedNodes = allNodes.slice(start, end);

      setNodes(limitedNodes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'class': return <Clock size={20} />;
      case 'mission': return <Target size={20} />;
      case 'srs': return <BookOpen size={20} />;
      default: return <CheckCircle2 size={20} />;
    }
  };

  if (loading) return <div className="p-12 text-center font-bold text-slate-500">Montando sua linha do tempo...</div>;

  return (
    <div className="timeline-page-container">
      <div className="timeline-header">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-brand"
            title="Voltar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1>Linha do Tempo de Atividades</h1>
        </div>
        <p>Acompanhe seu histórico recente e seus próximos passos.</p>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-vertical-line" />
        
        {nodes.map((node, i) => {
          const isOverdue = node.status !== 'completed' && node.date < new Date();
          const isToday = node.date.toDateString() === new Date().toDateString();
          const isActiveFocus = node.status !== 'completed' && !isOverdue && isToday; // Simplification of active
          const isFirstPending = i === nodes.findIndex(n => n.status !== 'completed'); // Real active focus
          
          return (
            <div 
              key={node.id} 
              className={`timeline-row ${isFirstPending ? 'active-focus' : ''} ${node.status}`}
              ref={isFirstPending ? activeRef : null}
            >
              {/* Date Column */}
              <div className="date-col">
                <span className="date-day">{node.date.getDate()}</span>
                <span className="date-month">{node.date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                <span className="date-year">{node.date.getFullYear()}</span>
              </div>

              {/* Node Column */}
              <div className="node-col">
                <div className={`node-circle ${node.type}`}>
                  {node.status === 'completed' ? <CheckCircle2 size={16} /> : getIcon(node.type)}
                </div>
              </div>

              {/* Content Column */}
              <div className="content-col" onClick={() => {
                 if (node.status !== 'completed' && node.link) window.location.href = node.link;
              }}>
                <div className="content-card">
                  <div className="card-top">
                    <span className="card-type-tag">
                      {node.type === 'class' ? 'AULA' : node.type === 'mission' ? 'MISSÃO' : 'REVISÃO SRS'}
                    </span>
                    {isOverdue && <span className="tag-overdue">ATRASADO</span>}
                    {isToday && !isOverdue && <span className="tag-today">HOJE</span>}
                  </div>
                  
                  <h3 className="card-title">{node.title}</h3>
                  {node.meta && <p className="card-meta">{node.meta}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .timeline-page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        .timeline-header {
          margin-bottom: 3rem;
          text-align: center;
        }
        .timeline-header h1 {
          font-family: var(--font-outfit);
          font-size: 2rem;
          font-weight: 900;
          color: var(--color-slate-dark);
          margin: 0;
        }
        .timeline-header p {
          color: var(--color-slate-mid);
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .timeline-wrapper {
          position: relative;
        }
        .timeline-vertical-line {
          position: absolute;
          left: 100px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-ice);
          z-index: 0;
        }

        .timeline-row {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .date-col {
          width: 80px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-right: 1.5rem;
        }
        .date-day { font-size: 1.5rem; font-weight: 900; color: var(--color-slate-dark); line-height: 1; }
        .date-month { font-size: 0.8rem; font-weight: 800; color: var(--color-brand); }
        .date-year { font-size: 0.7rem; color: var(--color-slate-mid); font-weight: 600; }

        .node-col {
          width: 40px;
          display: flex;
          justify-content: center;
        }
        .node-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--color-slate-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-slate-mid);
          box-shadow: 0 0 0 4px var(--color-slate-bg);
          transition: all 0.2s;
        }

        .timeline-row.completed .node-circle {
          background: #22c55e;
          border-color: #22c55e;
          color: white;
        }
        .timeline-row.active-focus .node-circle {
          background: var(--color-brand);
          border-color: var(--color-brand);
          color: white;
          transform: scale(1.2);
          box-shadow: 0 0 0 6px rgba(88,49,126,0.15);
        }

        .content-col {
          flex: 1;
          padding-left: 1.5rem;
        }
        .content-card {
          background: white;
          border: 1px solid var(--color-slate-border);
          padding: 1.25rem;
          border-radius: 1.25rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .content-card:hover {
          border-color: var(--color-brand);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transform: translateX(4px);
        }
        .timeline-row.active-focus .content-card {
          border-color: var(--color-brand);
          border-width: 2px;
          box-shadow: 0 10px 30px rgba(88,49,126,0.1);
        }

        .card-top { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
        .card-type-tag { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); letter-spacing: 0.05em; }
        .tag-overdue { background: #ef4444; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-weight: 900; }
        .tag-today { background: #22c55e; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-weight: 900; }

        .card-title { font-size: 1.1rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .card-meta { font-size: 0.85rem; color: var(--color-slate-mid); margin: 0.3rem 0 0; }

      `}</style>
    </div>
  );
};
