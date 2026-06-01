import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';
import { STORE_ITEMS } from '../../lib/store';

type AssignmentWithActivity = Tables<'assignments'> & {
  activities: Tables<'activities'>;
};

export default function MissionList() {
  const [missions, setMissions] = useState<AssignmentWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch profile
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(profileData);

        // Fetch missions via secure API
        const response = await fetch('/api/student/missions', {
          headers: {
              'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar missões');
        }

        const data = await response.json();
        setMissions(data.missions || []);
      } catch (err) {
        console.error('[MissionList] Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Concluída</span>;
      case 'in_progress':
        return <span className="status-badge in-progress">Em andamento</span>;
      default:
        return <span className="status-badge pending">Pendente</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'escuta': return '🎧';
      case 'mrp': return '🎭';
      case 'flashcards': return '🃏';
      case 'lego': return '🧱';
      case 'destrave1': return '📖';
      default: return '📄';
    }
  };

  const handleStartMission = (mission: AssignmentWithActivity) => {
    if (!mission.activities) {
        alert('Esta atividade ainda não teve as permissões de acesso liberadas pelo seu professor.');
        return;
    }
    const type = mission.activities.type;
    // Redirect based on type
    if (type === 'escuta') window.location.href = `/dashboard/missions/escuta?assignment=${mission.id}`;
    if (type === 'mrp') window.location.href = `/dashboard/missions/mrp?assignment=${mission.id}`;
    if (type === 'flashcards') window.location.href = `/dashboard/missions/flashcards?assignment=${mission.id}`;
    if (type === 'destrave1') window.location.href = `/dashboard/missions/destrave1?assignment=${mission.id}`;
    if (type === 'lego') window.location.href = `/dashboard/missions/lego?assignment=${mission.id}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (profile?.role === 'teacher') {
    return (
      <div className="message-card">
        <h3>Visão de Professor</h3>
        <p>Como professor, você deve gerenciar seus alunos na aba "Alunos" para ver o progresso deles.</p>
        <a href="/dashboard" className="btn-action">Ver Alunos</a>
      </div>
    );
  }

  return (
    <div className="missions-container">
      <div className="header-section">
        <div className="flex items-baseline gap-2 mb-1">
           <h1 className="title" style={{ margin: 0 }}>Minhas Missões</h1>
           {profile?.equipped?.title && (
             <span className="equipped-title-tag">
               {STORE_ITEMS.find(i => i.id === profile.equipped.title)?.name || ''}
             </span>
           )}
        </div>
        <p className="subtitle">Olá, <strong>{profile?.full_name?.split(' ')[0] || 'Aluno'}</strong>! Mergulhe no japonês com as tarefas preparadas pelo seu professor.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card balance-card">
          <div className="flex items-center gap-2 mb-1">
             <span style={{ fontSize: '1rem' }}>🪙</span>
             <p className="stat-label" style={{ margin: 0 }}>Meus Coins</p>
          </div>
          <p className="stat-value" style={{ color: '#d97706' }}>
            {profile?.coins || 0} <span className="dc-label">DC</span>
          </p>
        </div>
        <div className="stat-card balance-card">
          <div className="flex items-center gap-2 mb-1">
             <span style={{ fontSize: '1rem' }}>⚡</span>
             <p className="stat-label" style={{ margin: 0 }}>Nível XP</p>
          </div>
          <p className="stat-value" style={{ color: '#4f46e5' }}>
            {profile?.xp || 0} <span className="dc-label">XP</span>
          </p>
        </div>
      </div>

      {missions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h2 className="empty-title">Nenhuma missão encontrada</h2>
          <p className="empty-desc">
            Seu professor ainda não enviou tarefas para sua conta: <strong>{profile?.full_name || 'Usuário'}</strong>
          </p>
        </div>
      ) : (
        <div className="mission-grid">
          {missions.map((mission) => {
            const config = (mission.activities?.config as any) || {};
            const language = config.language || 'Japonês';
            const level = config.level || 'Iniciante';
            const dateStr = mission.assigned_at ? new Date(mission.assigned_at).toLocaleDateString('pt-BR') : '—';
            
            // Lógica para detectar revisão pendente (SRS)
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const hasDueRevision = config.repetition?.some((m: any) => {
              const scheduled = new Date(m.scheduledDate).toISOString().split('T')[0];
              return m.status === 'pending' && scheduled <= todayStr;
            }) || (mission.result_data as any)?.repetition?.some((m: any) => {
              const scheduled = new Date(m.scheduledDate).toISOString().split('T')[0];
              return m.status === 'pending' && scheduled <= todayStr;
            });

            return (
              <div 
                key={mission.id} 
                className={`mission-card ${mission.status === 'completed' ? 'completed-card' : ''}`}
                onClick={() => handleStartMission(mission)}
              >
                <div className="mission-type-icon">
                  {getTypeIcon(mission.activities?.type || 'escuta')}
                </div>
                <div className="mission-content">
                  <div className="mission-header">
                    <h3 className="mission-title">{mission.activities?.title || 'Missão Sem Título'}</h3>
                    <div className="mission-badges">
                      {hasDueRevision && (
                        <span className="status-badge due-revision animate-pulse">
                          🔔 REVISÃO DISPONÍVEL
                        </span>
                      )}
                      {getStatusBadge(mission.status)}
                    </div>
                  </div>
                  <div className="mission-footer">
                    <span className="mission-meta">🗣️ {language}</span>
                    <span className="mission-meta">📊 {level}</span>
                    <span className="mission-meta">📅 {dateStr}</span>
                  </div>
                </div>
                <div className="mission-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .missions-container {
          padding-bottom: 2rem;
        }
        .header-section {
          margin-bottom: 2rem;
        }
        .title {
          font-family: var(--font-outfit);
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-slate-dark);
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: var(--color-slate-mid);
          font-size: 1rem;
        }

        .equipped-title-tag {
          background: var(--color-ice);
          color: var(--color-brand);
          font-family: var(--font-outfit);
          font-weight: 900;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          border: 1.5px solid rgba(88,49,126,0.1);
          animation: fade-in 0.5s ease;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border: 1px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-family: var(--font-outfit);
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
          color: var(--color-slate-dark);
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .dc-label {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .balance-card {
           border-bottom: 4px solid var(--color-slate-border);
           transition: all 0.3s ease;
        }
        .balance-card:hover {
           transform: translateY(-4px);
           border-bottom-color: var(--color-brand);
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .mission-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: white;
          border: 1px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 200ms ease;
          position: relative;
          overflow: hidden;
        }
        .mission-card:hover {
          border-color: var(--color-brand);
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .mission-type-icon {
          width: 60px;
          height: 60px;
          background: var(--color-ice);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
        }
        .mission-content {
          flex: 1;
        }
        .mission-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }
        .mission-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }
        .mission-title {
          font-family: var(--font-outfit);
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-slate-dark);
          margin: 0;
          line-height: 1.3;
        }
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 2rem;
        }
        .status-badge.pending {
          background: #FEF3C7;
          color: #92400E;
        }
        .status-badge.in-progress {
          background: #DBEAFE;
          color: #1E40AF;
        }
        .status-badge.completed {
          background: #DCFCE7;
          color: #166534;
        }
        .status-badge.due-revision {
          background: #FEF3C7;
          color: #D97706;
          border: 1px solid #FCD34D;
        }

        .mission-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: 0.8rem;
          color: var(--color-slate-mid);
        }

        .mission-arrow {
          color: var(--color-slate-border);
          transition: color 200ms ease, transform 200ms ease;
        }
        .mission-card:hover .mission-arrow {
          color: var(--color-brand);
          transform: translateX(4px);
        }

        .completed-card {
          opacity: 0.85;
          background: var(--color-ice);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border: 2px dashed var(--color-slate-border);
          border-radius: 2rem;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        .loading-container {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--color-ice);
          border-top-color: var(--color-brand);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .message-card {
          background: white;
          padding: 2rem;
          border-radius: 1.5rem;
          border: 1px solid var(--color-slate-border);
          text-align: center;
        }

        @media (max-width: 640px) {
          .mission-type-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
