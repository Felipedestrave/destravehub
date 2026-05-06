import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { getRoadmapPhrase, type RoadmapContext } from '../../lib/roadmap-phrases';
import { CheckCircle2, Clock, Target, BookOpen, Lock, ChevronRight, Info, HelpCircle, Star } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RoadmapNode {
  id: string;
  type: 'class' | 'mission' | 'srs' | 'chest';
  title: string;
  status: 'completed' | 'active' | 'upcoming' | 'locked';
  date?: Date;
  meta?: string;
  link?: string;
}

// ─── Math Helpers for S-Curve ────────────────────────────────────────────────

function getNodePosition(index: number) {
  // Winding path logic using pixel coordinates for a 800px wide board
  const spacingY = 160;
  const amplitude = 260; // Swings left/right by 260px
  const frequency = 0.5; // Frequency of the S-curve
  
  const x = 400 + Math.sin(index * frequency) * amplitude;
  const y = index * spacingY + 100;
  
  return { x, y };
}

// ─── Components ──────────────────────────────────────────────────────────────

const MapNode: React.FC<{
  node: RoadmapNode;
  index: number;
  isBuddyHere: boolean;
  buddyAvatarUrl: string;
  onClick: (node: RoadmapNode) => void;
}> = ({ node, index, isBuddyHere, buddyAvatarUrl, onClick }) => {
  const { x, y } = getNodePosition(index);

  const bgColor = {
    completed: 'linear-gradient(135deg, #22c55e, #16a34a)',
    active: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-hover))',
    upcoming: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
    locked: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
  }[node.status];

  const Icon = {
    class: Clock,
    mission: Target,
    srs: BookOpen,
    chest: Star,
  }[node.type];

  // Penalty visual check
  const isOverdue = node.status !== 'completed' && node.date && node.date < new Date();
  const delayDays = isOverdue ? Math.floor((new Date().getTime() - node.date!.getTime()) / (1000 * 3600 * 24)) : 0;
  
  let ringColor = isBuddyHere ? 'gold' : 'rgba(255,255,255,0.2)';
  if (isOverdue) {
    ringColor = delayDays > 15 ? '#ef4444' : delayDays > 3 ? '#f59e0b' : ringColor;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
    >
      {/* Buddy Token */}
      {isBuddyHere && (
        <motion.div
          layoutId="buddy-token"
          animate={{ y: [-15, -25, -15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div 
            className="buddy-token-ui"
            style={{ 
              backgroundImage: `url(${buddyAvatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'white'
            }} 
          />
        </motion.div>
      )}

      {/* Main Node Circle */}
      <motion.button
        whileHover={node.status !== 'locked' ? { scale: 1.15, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' } : {}}
        whileTap={node.status !== 'locked' ? { scale: 0.95 } : {}}
        onClick={() => node.status !== 'locked' && onClick(node)}
        style={{
          background: bgColor,
          border: `4px solid ${ringColor}`,
          borderRadius: '16px', // Rounded square for board game feel
          width: node.status === 'active' ? '86px' : '70px',
          height: node.status === 'active' ? '86px' : '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: node.status !== 'locked' ? 'pointer' : 'not-allowed',
          boxShadow: node.status === 'active' 
            ? '0 8px 0px rgba(88,49,126,0.5), 0 15px 30px rgba(0,0,0,0.2)' 
            : '0 6px 0px rgba(0,0,0,0.1), 0 10px 15px rgba(0,0,0,0.05)',
          transform: node.status !== 'locked' ? 'translateY(-4px)' : 'none',
          position: 'relative',
          transition: 'all 0.2s',
        }}
      >
        {node.status === 'completed' ? (
          <CheckCircle2 size={28} color="white" />
        ) : node.status === 'locked' ? (
          <Lock size={20} color="#94a3b8" />
        ) : node.type === 'chest' ? (
          <span style={{ fontSize: '1.8rem' }}>🎁</span>
        ) : (
          <Icon size={24} color="white" />
        )}

        {isOverdue && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#ef4444',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'black',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
            }}
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* Mini-Card Label */}
      <div style={{
        marginTop: '0.75rem',
        textAlign: 'center',
        width: '200px',
        marginLeft: '-65px',
      }}>
        <div style={{
          background: 'white',
          padding: '0.6rem 0.8rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          display: 'inline-block',
          border: '1px solid var(--color-slate-border)',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <Icon size={12} color="var(--color-slate-mid)" />
            <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-slate-mid)' }}>
              {node.date ? node.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem data'}
            </span>
            {isOverdue && <span style={{ fontSize: '0.6rem', color: 'white', background: '#ef4444', padding: '2px 6px', borderRadius: '100px', fontWeight: 900 }}>ATRASADO</span>}
            {node.type === 'srs' && (
              <span title="Revisão Espaçada: Faça no dia certo para ganhar 100% das moedas e fixar na memória!" style={{ background: 'var(--color-ice)', color: 'var(--color-slate-mid)', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', cursor: 'help' }}>?</span>
            )}
          </div>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: node.status === 'locked' ? '#94a3b8' : 'var(--color-slate-dark)',
            fontFamily: 'var(--font-outfit)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{node.title}</p>
          {node.meta && (
            <span style={{ fontSize: '0.65rem', color: node.type === 'chest' ? '#f59e0b' : 'var(--color-brand)', fontWeight: 800, display: 'block', marginTop: '4px' }}>
              {node.meta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Roadmap Component ──────────────────────────────────────────────────

export const AdventureRoadmap: React.FC = () => {
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [activeTab, setActiveTab] = useState<'regras' | 'srs'>('regras');
  const [senseiMsg, setSenseiMsg] = useState('');
  const [buddyAvatarUrl, setBuddyAvatarUrl] = useState('/assets/avatars/tanuki-novato.png');

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Load profile & buddy
      const { data: profile } = await supabase
        .from('profiles')
        .select('equipped')
        .eq('id', session.user.id)
        .single();

      const equippedData = (profile?.equipped as any);
      if (equippedData?.avatar) {
        const { data: storeItem } = await (supabase as any)
          .from('store_items')
          .select('preview_url')
          .eq('id', equippedData.avatar)
          .single();
        if (storeItem?.preview_url) setBuddyAvatarUrl(storeItem.preview_url as string);
      }

      // 2. Load student & assignments
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', session.user.id)
        .single();
      if (!student) return;

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

      const roadmapNodes: RoadmapNode[] = [];

      // Logic to build nodes...
      appointments?.forEach(app => {
        const date = new Date(app.start_time);
        roadmapNodes.push({
          id: app.id, type: 'class', title: app.title, date,
          status: date < new Date() ? 'completed' : date.toDateString() === new Date().toDateString() ? 'active' : 'upcoming',
          meta: 'Aula Agendada', link: '/dashboard/calendar'
        });
      });

      assignments?.forEach(miss => {
        const title = (miss.activities as any)?.title || 'Missão';
        roadmapNodes.push({
          id: miss.id, type: 'mission', title, date: new Date(miss.assigned_at || new Date().toISOString()),
          status: miss.status === 'completed' ? 'completed' : 'active',
          link: `/dashboard/missions/${(miss.activities as any)?.type}?assignment=${miss.id}`
        });

        // Add SRS
        const res = miss.result_data as any;
        if (res?.repetition) {
          res.repetition.forEach((m: any) => {
            const date = new Date(m.scheduledDate);
            roadmapNodes.push({
              id: `${miss.id}-srs-${m.milestone}`, type: 'srs', title: `Revisão: ${title}`, date,
              status: m.status === 'completed' ? 'completed' : date <= new Date() ? 'active' : 'upcoming',
              meta: `SRS Etapa ${m.milestone}`, link: `/dashboard/missions/${(miss.activities as any)?.type}?assignment=${miss.id}`
            });
          });
        }
      });

      roadmapNodes.sort((a, b) => a.date!.getTime() - b.date!.getTime());

      // Inject Chests every 8 steps
      const nodesWithChests: RoadmapNode[] = [];
      let segmentStartIdx = 0;

      roadmapNodes.forEach((node, idx) => {
        nodesWithChests.push(node);
        if ((idx + 1) % 8 === 0) {
          const segmentTasks = roadmapNodes.slice(segmentStartIdx, idx + 1);
          const isSegmentPerfect = segmentTasks.every(n => n.status === 'completed');
          const isChestReached = node.status === 'completed';

          let chestStatus: 'completed' | 'active' | 'upcoming' | 'locked' = 'upcoming';
          let chestTitle = 'Baú de Recompensas';
          let chestMeta = '🎁 Até 50 Moedas';

          if (isChestReached) {
            chestStatus = 'completed';
            if (isSegmentPerfect) {
              chestTitle = 'Baú de Ouro Aberto!';
              chestMeta = '🏆 +50 Moedas';
            } else {
              chestTitle = 'Baú de Prata Aberto!';
              chestMeta = '🔓 +20 (Recupere +30!)';
            }
          } else if (node.status === 'locked') {
            chestStatus = 'locked';
          }

          nodesWithChests.push({
            id: `chest-${idx}`,
            type: 'chest',
            title: chestTitle,
            status: chestStatus,
            meta: chestMeta,
            date: node.date,
          });

          segmentStartIdx = idx + 1;
        }
      });

      setNodes(nodesWithChests);

      // Determine Sensei message based on gaps
      let lastCompletedIdx = -1;
      for (let i = nodesWithChests.length - 1; i >= 0; i--) {
        if (nodesWithChests[i].status === 'completed') {
          lastCompletedIdx = i;
          break;
        }
      }

      const hasSkippedTasks = nodesWithChests.some((n, i) => i < lastCompletedIdx && n.status !== 'completed' && n.type !== 'chest');
      const hasOverdue = nodesWithChests.some(n => n.status !== 'completed' && n.date && n.date < new Date() && n.type !== 'chest');

      if (hasSkippedTasks) {
        setSenseiMsg("Opa! Percebi que você avançou na jornada, mas deixou buracos na fundação. Volte lá e complete suas revisões! ⚠️");
      } else if (hasOverdue) {
        setSenseiMsg("Ei! Temos algumas tarefas atrasadas no caminho. Vamos regularizar isso e garantir seus bônus? 🔥");
      } else {
        setSenseiMsg("Sua jornada está perfeita e no prazo! Qual será o próximo passo hoje? 🎌");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let activeNodeIndex = 0;
  if (nodes.length > 0) {
    let lastCompletedIndex = -1;
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].status === 'completed') {
        lastCompletedIndex = i;
        break;
      }
    }
    // Buddy stands on the first space AFTER the furthest completed task
    activeNodeIndex = lastCompletedIndex + 1;
    if (activeNodeIndex >= nodes.length) activeNodeIndex = nodes.length - 1;
    if (activeNodeIndex === -1) activeNodeIndex = 0;

    }

    // Buddys custom message for SRS nodes (SAFE HOOK CALL)
    useEffect(() => {
        if (nodes.length > 0 && nodes[activeNodeIndex]) {
            const activeNode = nodes[activeNodeIndex];
            if (!senseiMsg.includes('buracos') && !senseiMsg.includes('atrasadas') && activeNode.type === 'srs') {
                setSenseiMsg("Ei! Sabia que se não revisar hoje, seu cérebro vai apagar grande parte do que você aprendeu? Vamos fortalecer essa memória! 🧠");
            }
        }
    }, [nodes, activeNodeIndex, senseiMsg]);

    const handleNodeClick = (node: RoadmapNode) => {
    if (node.status === 'locked') return;
    
    // 1-Click Access for pending missions/reviews
    if ((node.type === 'mission' || node.type === 'srs') && node.status !== 'completed' && node.link) {
      window.location.href = node.link;
      return;
    }
    
    // Open modal for classes, chests, or completed items
    setSelectedNode(node);
  };

  if (loading) return <div className="loading-state">Desenhando o caminho...</div>;

  return (
    <div className="adventure-roadmap-container">
      {/* HEADER SECTION */}
      <div className="roadmap-header">
        <div className="header-left">
           <button 
             onClick={() => window.history.back()}
             className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-brand mr-2"
             title="Voltar"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div className="header-icon">🗺️</div>
           <div>
             <h1>Meu Caminho</h1>
             <p>{nodes.filter(n => n.status === 'completed').length} de {nodes.length} etapas concluídas</p>
           </div>
        </div>
        
        <div className="header-right">
           <button className="rules-btn" onClick={() => setShowRules(true)}>
             <HelpCircle size={18} />
             Como jogar?
           </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="global-progress">
        <div className="progress-track">
           <motion.div 
             className="progress-fill" 
             initial={{ width: 0 }}
             animate={{ width: `${(nodes.filter(n => n.status === 'completed').length / nodes.length) * 100}%` }}
           />
        </div>
      </div>

      {/* GAME BOARD MAP */}
      <div className="game-board" style={{ height: nodes.length * 160 + 300 }}>
        {/* SVG Path line - 2 layers for border effect */}
        <svg className="map-svg-line" viewBox={`0 0 800 ${nodes.length * 160 + 300}`}>
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand)" />
              <stop offset="50%" stopColor="var(--color-action)" />
              <stop offset="100%" stopColor="var(--color-brand-hover)" />
            </linearGradient>
            <filter id="trackShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#000" floodOpacity="0.15" />
            </filter>
          </defs>
          
          {/* Outer thick border */}
          <path
            d={nodes.map((_, i) => {
              const { x, y } = getNodePosition(i);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="white"
            strokeWidth="56"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trackShadow)"
          />
          
          {/* Inner colored track */}
          <path
            d={nodes.map((_, i) => {
              const { x, y } = getNodePosition(i);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '8%', left: '12%', fontSize: '3.5rem', opacity: 0.3, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>📚</div>
        <div style={{ position: 'absolute', top: '25%', right: '15%', fontSize: '4rem', opacity: 0.25, transform: 'rotate(10deg)', pointerEvents: 'none' }}>🖌️</div>
        <div style={{ position: 'absolute', top: '45%', left: '15%', fontSize: '3rem', opacity: 0.3, transform: 'rotate(-5deg)', pointerEvents: 'none' }}>🎌</div>
        <div style={{ position: 'absolute', top: '65%', right: '12%', fontSize: '3.5rem', opacity: 0.25, transform: 'rotate(20deg)', pointerEvents: 'none' }}>📝</div>
        <div style={{ position: 'absolute', top: '82%', left: '18%', fontSize: '3.5rem', opacity: 0.3, transform: 'rotate(-10deg)', pointerEvents: 'none' }}>🧠</div>
        <div style={{ position: 'absolute', bottom: '8%', right: '15%', fontSize: '3.5rem', opacity: 0.3, transform: 'rotate(15deg)', pointerEvents: 'none' }}>🍵</div>

        {nodes.map((node, i) => (
          <MapNode 
            key={node.id} 
            node={node} 
            index={i} 
            isBuddyHere={i === activeNodeIndex} 
            buddyAvatarUrl={buddyAvatarUrl}
            onClick={handleNodeClick} 
          />
        ))}
      </div>

      {/* FIXED SENSEI GUIDE */}
      <div className="sensei-fixed-guide">
         <motion.div 
           animate={{ y: [0, -5, 0] }} 
           transition={{ duration: 4, repeat: Infinity }}
           className="sensei-bubble"
         >
           <p>{senseiMsg}</p>
         </motion.div>
         <div className="sensei-avatar-container">
            <img src="/avatars/sensei.png" alt="Sensei" />
            <span className="sensei-name">Sensei Felipe</span>
         </div>
      </div>

      {/* RULES MODAL */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
          >
            <motion.div 
              className="rules-modal"
              initial={{ y: 50, scale: 0.9 }} 
              animate={{ y: 0, scale: 1 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>📜 Manual da Jornada</h2>
                <button className="close-btn" onClick={() => setShowRules(false)}>✕</button>
              </div>

              <div className="rules-tabs">
                <button 
                  onClick={() => setActiveTab('regras')}
                  style={{ background: activeTab === 'regras' ? 'var(--color-brand)' : 'transparent', color: activeTab === 'regras' ? 'white' : 'var(--color-slate-mid)', border: 'none', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}
                >
                  Regras do Caminho
                </button>
                <button 
                  onClick={() => setActiveTab('srs')}
                  style={{ background: activeTab === 'srs' ? 'var(--color-brand)' : 'transparent', color: activeTab === 'srs' ? 'white' : 'var(--color-slate-mid)', border: 'none', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}
                >
                  A Magia da Revisão 🧠
                </button>
              </div>
              
              <div className="rules-content">
                {activeTab === 'regras' ? (
                  <>
                    <section>
                      <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 800 }}>Como Avançar?</h3>
                      <p style={{ color: 'var(--color-slate-mid)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        O seu <strong>Buddy</strong> (o peão flutuante) avança pelas casinhas conforme você completa suas tarefas.
                      </p>
                      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-slate-mid)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                        <li><strong>Ação Rápida:</strong> Clique nas missões e revisões pendentes para ir direto ao exercício.</li>
                        <li><strong>Não pule etapas:</strong> Se você fizer uma tarefa futura e esquecer uma antiga, o Buddy avança, mas a casa abandonada ficará vermelha e o Sensei chamará sua atenção!</li>
                      </ul>
                    </section>

                    <section style={{ marginTop: '1.5rem', background: '#fffbeb', padding: '1rem', borderRadius: '1rem', border: '2px solid #fde68a' }}>
                      <h3 style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 800 }}>
                        <span style={{ fontSize: '1.5rem' }}>🎁</span> Baús Híbridos
                      </h3>
                      <p style={{ color: '#92400e', fontSize: '0.9rem', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                        A cada <strong>8 etapas</strong> você alcança um baú! Só de chegar lá (mesmo pulando tarefas) você abre o <strong>Baú de Prata (+20 moedas)</strong>. Mas, se tiver feito 100% das tarefas anteriores sem pular nada, ele vira um <strong>Baú de Ouro (+50 moedas)</strong>! Deixou algo pra trás? Volte, complete e recupere suas 30 moedas!
                      </p>
                    </section>

                    <section className="penalties-section" style={{ marginTop: '1.5rem' }}>
                      <h3>⚠️ Sistema de Penalidades</h3>
                      <div className="penalty-list">
                        <div className="penalty-item"><span>3 dias</span> <p>Alerta visual (Casas piscando)</p></div>
                        <div className="penalty-item"><span>7 dias</span> <p>Perda do bônus de pontualidade</p></div>
                        <div className="penalty-item"><span>15 dias</span> <p>Multa de -5 moedas no saldo</p></div>
                        <div className="penalty-item alert"><span>21 dias</span> <p>Mercado Destrave bloqueado por 1 semana</p></div>
                        <div className="penalty-item danger"><span>30+ dias</span> <p>Bloqueio de acúmulo por 1 semana</p></div>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <section>
                      <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 800 }}>A Curva do Esquecimento</h3>
                      <p style={{ color: 'var(--color-slate-mid)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Você sabia que seu cérebro deleta naturalmente as informações que não usa? Para garantir que você não esqueça o que estudou, usamos um sistema científico chamado <strong>Repetição Espaçada (SRS)</strong>.
                      </p>
                      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-slate-mid)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                        <li><strong>Etapa 1:</strong> 1 dia depois</li>
                        <li><strong>Etapa 2:</strong> 5 dias depois</li>
                        <li><strong>Etapa 3:</strong> 10 dias depois</li>
                        <li><strong>Etapa 4:</strong> 16 dias depois</li>
                        <li><strong>Etapa 5:</strong> 25 dias depois</li>
                      </ul>
                    </section>

                    <section style={{ marginTop: '1.5rem', background: '#f0fdf4', padding: '1rem', borderRadius: '1rem', border: '2px solid #bbf7d0' }}>
                      <h3 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem', fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 800 }}>
                        <span style={{ fontSize: '1.5rem' }}>💰</span> Moedas Dinâmicas
                      </h3>
                      <p style={{ color: '#166534', fontSize: '0.9rem', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                        A pontualidade vale ouro! 
                        <br/><br/>
                        ✅ <strong>No dia certo:</strong> Ganha 100% das moedas da etapa.<br/>
                        ⚠️ <strong>Atrasado:</strong> Ganha 50% das moedas (se fizer antes da próxima revisão).<br/>
                        ❌ <strong>Perdida:</strong> Ganha 0 moedas se pular a etapa completamente.
                      </p>
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NODE DETAIL MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
             <motion.div className="node-detail-card" onClick={e => e.stopPropagation()}>
                <h3>{selectedNode.title}</h3>
                <p>{selectedNode.meta || 'Uma etapa importante do seu aprendizado.'}</p>
                <div className="modal-actions">
                  {selectedNode.link && selectedNode.status !== 'completed' && (
                    <a href={selectedNode.link} className="start-btn">Iniciar Atividade</a>
                  )}
                  <button onClick={() => setSelectedNode(null)} className="back-btn">Voltar</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .adventure-roadmap-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }
        .roadmap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .header-left { display: flex; gap: 1rem; align-items: center; }
        .header-icon { font-size: 2.5rem; }
        .header-left h1 { font-family: var(--font-outfit); font-weight: 900; font-size: 1.8rem; margin: 0; }
        .header-left p { color: var(--color-slate-mid); font-weight: 600; margin: 0; }
        
        .rules-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 2px solid var(--color-slate-border);
          padding: 0.6rem 1rem;
          border-radius: 1rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          cursor: pointer;
          transition: all 0.2s;
        }
        .rules-btn:hover { border-color: var(--color-brand); color: var(--color-brand); }

        .global-progress { margin-bottom: 3rem; }
        .progress-track { background: var(--color-ice); height: 10px; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--color-brand), #22c55e); }

        .game-board { 
          position: relative; 
          width: 100%; 
          max-width: 800px;
          margin: 0 auto;
          mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
        }
        .map-svg-line { 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          z-index: 0; 
        }

        .buddy-token-ui {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          border: 4px solid white;
          position: relative;
        }
        .buddy-token-ui::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 12px 10px 0;
          border-style: solid;
          border-color: white transparent transparent transparent;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
        }

        .sensei-fixed-guide {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
          z-index: 100;
          pointer-events: none;
        }
        .sensei-bubble {
          background: white;
          border: 2px solid var(--color-brand);
          padding: 1rem;
          border-radius: 1.5rem 1.5rem 0 1.5rem;
          max-width: 240px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          pointer-events: auto;
        }
        .sensei-bubble p { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--color-brand); line-height: 1.4; }
        .sensei-avatar-container { display: flex; flex-direction: column; align-items: center; }
        .sensei-avatar-container img { width: 90px; height: 90px; object-fit: contain; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2)); }
        .sensei-name { font-size: 0.7rem; font-weight: 900; color: var(--color-slate-mid); text-transform: uppercase; margin-top: 0.5rem; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px); z-index: 500;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }
        .rules-modal, .node-detail-card {
          background: white; border-radius: 2rem; padding: 2rem; width: 100%; max-width: 500px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-shrink: 0; }
        .modal-header h2 { font-family: var(--font-outfit); font-weight: 900; margin: 0; color: var(--color-brand); }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }

        .rules-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--color-ice); padding-bottom: 1rem; flex-shrink: 0; }

        .rules-content {
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        .rules-content::-webkit-scrollbar { width: 6px; }
        .rules-content::-webkit-scrollbar-track { background: var(--color-ice); border-radius: 10px; }
        .rules-content::-webkit-scrollbar-thumb { background: var(--color-slate-mid); border-radius: 10px; }

        .penalty-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .penalty-item { display: flex; gap: 1rem; background: #f8fafc; padding: 0.75rem; border-radius: 1rem; align-items: center; }
        .penalty-item span { font-weight: 900; color: var(--color-brand); min-width: 65px; font-size: 0.8rem; }
        .penalty-item p { margin: 0; font-size: 0.85rem; font-weight: 600; color: var(--color-slate-dark); }
        .penalty-item.alert { border-left: 4px solid #f59e0b; }
        .penalty-item.danger { border-left: 4px solid #ef4444; }

        .start-btn { 
          display: block; width: 100%; background: var(--color-brand); color: white; 
          text-align: center; text-decoration: none; padding: 1rem; border-radius: 1rem;
          font-weight: 800; font-family: var(--font-outfit); margin-bottom: 0.75rem;
        }
        .back-btn { 
          width: 100%; background: var(--color-ice); border: none; padding: 1rem; 
          border-radius: 1rem; font-weight: 700; cursor: pointer;
        }

        .loading-state { padding: 5rem; text-align: center; font-family: var(--font-outfit); font-weight: 800; color: var(--color-slate-mid); }
      `}</style>
    </div>
  );
};
