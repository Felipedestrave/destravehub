import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
    ChevronLeft, ChevronRight, CheckCircle2, MessageCircle,
    Plus, TrendingUp, Clock, AlertTriangle, DollarSign, X, Loader2, RotateCcw
} from 'lucide-react';

const MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const CURRENCY_SYMBOLS: Record<string, string> = {
    BRL: 'R$', JPY: '¥', USD: '$', EUR: '€'
};

const formatAmount = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    if (currency === 'JPY') return `${symbol} ${Math.round(amount).toLocaleString('ja-JP')}`;
    return `${symbol} ${amount.toFixed(2).replace('.', ',')}`;
};

const statusConfig = {
    paid: { label: 'Pago', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    pending: { label: 'Pendente', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    overdue: { label: 'Atrasado', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

interface Payment {
    id: string;
    student_id: string;
    amount: number;
    currency: string;
    due_date: string;
    paid_at: string | null;
    status: 'paid' | 'pending';
    description: string;
    lesson_count?: number;
    students: { name: string; billing_type: string; billing_currency: string; billing_package_size?: number; };
}

interface Metrics {
    totalPaid: number;
    totalPending: number;
    overdue: number;
    ticketMedio: number;
}

interface NewChargeForm {
    student_id: string;
    amount: string;
    currency: string;
    due_date: string;
    description: string;
}

export default function FinancePanel() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [payments, setPayments] = useState<Payment[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingPaid, setMarkingPaid] = useState<string | null>(null);
    const [markingPending, setMarkingPending] = useState<string | null>(null);
    const [showNewCharge, setShowNewCharge] = useState(false);
    const [savingCharge, setSavingCharge] = useState(false);
    const [newCharge, setNewCharge] = useState<NewChargeForm>({
        student_id: '', amount: '', currency: 'BRL',
        due_date: new Date().toISOString().split('T')[0],
        description: 'Aula Avulsa'
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/finance/list?month=${month}&year=${year}`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setPayments(data.payments || []);
                setMetrics(data.metrics || null);
            }
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    const fetchStudents = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data } = await supabase
            .from('students')
            .select('id, name, billing_currency')
            .eq('teacher_id', session.user.id)
            .order('name');
        setStudents(data || []);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const handleMarkPaid = async (paymentId: string) => {
        setMarkingPaid(paymentId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await fetch('/api/finance/mark-paid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ payment_id: paymentId })
            });
            await fetchData();
        } finally {
            setMarkingPaid(null);
        }
    };

    const handleMarkPending = async (paymentId: string) => {
        setMarkingPending(paymentId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            await fetch('/api/finance/mark-pending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ payment_id: paymentId })
            });
            await fetchData();
        } finally {
            setMarkingPending(null);
        }
    };

    const handleWhatsApp = (payment: Payment) => {
        const student = payment.students;
        const amount = formatAmount(payment.amount, payment.currency);
        const due = new Date(payment.due_date + 'T12:00:00').toLocaleDateString('pt-BR');
        const msg = encodeURIComponent(
            `Olá, ${student.name}! 😊\n\nPassando para lembrar que temos um pagamento de *${amount}* com vencimento em *${due}*.\n\n${payment.description}\n\nQualquer dúvida, é só falar! Arigato! 🙏`
        );
        // Try to get student whatsapp
        window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    };

    const handleCreateCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCharge(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch('/api/finance/create-charge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify(newCharge)
            });
            if (res.ok) {
                setShowNewCharge(false);
                setNewCharge({ student_id: '', amount: '', currency: 'BRL', due_date: new Date().toISOString().split('T')[0], description: 'Aula Avulsa' });
                await fetchData();
            }
        } finally {
            setSavingCharge(false);
        }
    };

    const navigateMonth = (delta: number) => {
        let m = month + delta;
        let y = year;
        if (m > 12) { m = 1; y++; }
        if (m < 1) { m = 12; y--; }
        setMonth(m); setYear(y);
    };

    const isOverdue = (p: Payment) => p.status === 'pending' && new Date(p.due_date + 'T12:00:00') < today;

    const paymentStatus = (p: Payment): keyof typeof statusConfig =>
        p.status === 'paid' ? 'paid' : isOverdue(p) ? 'overdue' : 'pending';

    const sorted = [...payments].sort((a, b) => {
        const order = { overdue: 0, pending: 1, paid: 2 };
        return order[paymentStatus(a)] - order[paymentStatus(b)];
    });

    return (
        <div className="finance-panel">
            {/* ── Month Navigator ── */}
            <div className="finance-header">
                <button onClick={() => navigateMonth(-1)} className="nav-btn"><ChevronLeft size={20} /></button>
                <div className="month-display">
                    <span className="month-name">{MONTHS_PT[month - 1]}</span>
                    <span className="month-year">{year}</span>
                </div>
                <button onClick={() => navigateMonth(1)} className="nav-btn"><ChevronRight size={20} /></button>
            </div>

            {/* ── Metrics ── */}
            {metrics && (
                <div className="metrics-grid">
                    <div className="metric-card metric-card--green">
                        <div className="metric-icon"><CheckCircle2 size={22} /></div>
                        <div>
                            <p className="metric-label">Faturamento do Mês</p>
                            <p className="metric-value">R$ {metrics.totalPaid.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                    <div className="metric-card metric-card--amber">
                        <div className="metric-icon"><Clock size={22} /></div>
                        <div>
                            <p className="metric-label">A Receber</p>
                            <p className="metric-value">R$ {metrics.totalPending.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                    <div className="metric-card metric-card--red">
                        <div className="metric-icon"><AlertTriangle size={22} /></div>
                        <div>
                            <p className="metric-label">Em Atraso</p>
                            <p className="metric-value">{metrics.overdue} {metrics.overdue === 1 ? 'aluno' : 'alunos'}</p>
                        </div>
                    </div>
                    <div className="metric-card metric-card--blue">
                        <div className="metric-icon"><TrendingUp size={22} /></div>
                        <div>
                            <p className="metric-label">Ticket Médio</p>
                            <p className="metric-value">R$ {metrics.ticketMedio.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Action Bar ── */}
            <div className="action-bar">
                <h2 className="section-title">Cobranças de {MONTHS_PT[month - 1]}</h2>
                <button onClick={() => setShowNewCharge(true)} className="btn-new-charge">
                    <Plus size={16} /> Nova Cobrança
                </button>
            </div>

            {/* ── Payments List ── */}
            {loading ? (
                <div className="loading-state"><Loader2 size={28} className="animate-spin text-brand" /></div>
            ) : sorted.length === 0 ? (
                <div className="empty-state">
                    <DollarSign size={40} className="empty-icon" />
                    <p>Nenhuma cobrança neste mês.</p>
                    <span>Clique em "Nova Cobrança" para adicionar uma entrada manual.</span>
                </div>
            ) : (
                <div className="payments-list">
                    {sorted.map(payment => {
                        const status = paymentStatus(payment);
                        const cfg = statusConfig[status];
                        const student = payment.students;
                        const isPaying = markingPaid === payment.id;

                        return (
                            <div key={payment.id} className={`payment-row ${status === 'paid' ? 'payment-row--paid' : ''}`}>
                                <div className="payment-left">
                                    <div className="payment-avatar">
                                        {student?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="payment-student">{student?.name || '—'}</p>
                                        <p className="payment-desc">
                                            {payment.description}
                                            {payment.lesson_count !== undefined && (
                                                <span className="usage-badge">
                                                    ({payment.lesson_count}/{student?.billing_package_size || 4} aulas)
                                                </span>
                                            )}
                                        </p>
                                        <p className="payment-due">
                                            Vence: {new Date(payment.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="payment-right">
                                    <p className="payment-amount">
                                        {formatAmount(payment.amount, payment.currency)}
                                    </p>
                                    <span className={`status-badge ${cfg.color}`}>
                                        <span className={`status-dot ${cfg.dot}`} />
                                        {cfg.label}
                                    </span>
                                    <div className="payment-actions">
                                        {payment.status !== 'paid' ? (
                                            <button
                                                onClick={() => handleMarkPaid(payment.id)}
                                                disabled={isPaying}
                                                className="btn-mark-paid"
                                                title="Marcar como Pago"
                                            >
                                                {isPaying ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkPending(payment.id)}
                                                disabled={markingPending === payment.id}
                                                className="btn-revert"
                                                title="Reverter para Pendente"
                                            >
                                                {markingPending === payment.id ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleWhatsApp(payment)}
                                            className="btn-whatsapp"
                                            title="Enviar lembrete via WhatsApp"
                                        >
                                            <MessageCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── New Charge Modal ── */}
            {showNewCharge && (
                <div className="modal-overlay" onClick={() => setShowNewCharge(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Nova Cobrança Manual</h3>
                            <button onClick={() => setShowNewCharge(false)} className="modal-close"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreateCharge} className="modal-form">
                            <div className="mf-group">
                                <label>Aluno *</label>
                                <select
                                    value={newCharge.student_id}
                                    onChange={e => setNewCharge(p => ({ ...p, student_id: e.target.value }))}
                                    required className="mf-input"
                                >
                                    <option value="">Selecionar aluno...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="mf-row">
                                <div className="mf-group">
                                    <label>Moeda</label>
                                    <select value={newCharge.currency} onChange={e => setNewCharge(p => ({ ...p, currency: e.target.value }))} className="mf-input">
                                        <option value="BRL">R$ (BRL)</option>
                                        <option value="JPY">¥ (JPY)</option>
                                        <option value="USD">$ (USD)</option>
                                        <option value="EUR">€ (EUR)</option>
                                    </select>
                                </div>
                                <div className="mf-group">
                                    <label>Valor *</label>
                                    <input type="number" min="0" step="0.01" value={newCharge.amount}
                                        onChange={e => setNewCharge(p => ({ ...p, amount: e.target.value }))}
                                        required className="mf-input" placeholder="0,00" />
                                </div>
                            </div>
                            <div className="mf-group">
                                <label>Data de Vencimento</label>
                                <input type="date" value={newCharge.due_date}
                                    onChange={e => setNewCharge(p => ({ ...p, due_date: e.target.value }))}
                                    className="mf-input" />
                            </div>
                            <div className="mf-group">
                                <label>Descrição</label>
                                <input type="text" value={newCharge.description}
                                    onChange={e => setNewCharge(p => ({ ...p, description: e.target.value }))}
                                    className="mf-input" placeholder="Ex: Pacote 4 aulas, Aula avulsa..." />
                            </div>
                            <div className="mf-actions">
                                <button type="button" onClick={() => setShowNewCharge(false)} className="mf-btn-cancel">Cancelar</button>
                                <button type="submit" disabled={savingCharge} className="mf-btn-submit">
                                    {savingCharge ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    Criar Cobrança
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .finance-panel { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

                /* Month Nav */
                .finance-header { display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
                .nav-btn { padding: 0.5rem; border-radius: 0.75rem; border: 1.5px solid var(--color-slate-border); background: white; color: var(--color-slate-dark); cursor: pointer; transition: all 0.2s; display: flex; }
                .nav-btn:hover { border-color: var(--color-brand); color: var(--color-brand); }
                .month-display { display: flex; flex-direction: column; align-items: center; min-width: 160px; }
                .month-name { font-family: var(--font-outfit); font-size: 1.75rem; font-weight: 900; color: var(--color-slate-dark); line-height: 1; }
                .month-year { font-size: 0.9rem; font-weight: 700; color: var(--color-slate-mid); }

                /* Metrics */
                .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                @media (min-width: 640px) { .metrics-grid { grid-template-columns: repeat(4, 1fr); } }
                .metric-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s; }
                .metric-card:hover { transform: translateY(-2px); }
                .metric-icon { width: 44px; height: 44px; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .metric-card--green .metric-icon { background: #D1FAE5; color: #059669; }
                .metric-card--amber .metric-icon { background: #FEF3C7; color: #D97706; }
                .metric-card--red .metric-icon { background: #FEE2E2; color: #DC2626; }
                .metric-card--blue .metric-icon { background: #DBEAFE; color: #2563EB; }
                .metric-label { font-size: 0.7rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
                .metric-value { font-family: var(--font-outfit); font-size: 1.15rem; font-weight: 900; color: var(--color-slate-dark); }

                /* Action Bar */
                .action-bar { display: flex; justify-content: space-between; align-items: center; }
                .section-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); }
                .btn-new-charge { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; background: var(--color-brand); color: white; border: none; border-radius: 0.875rem; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
                .btn-new-charge:hover { filter: brightness(1.1); transform: translateY(-1px); }

                /* Loading / Empty */
                .loading-state { display: flex; justify-content: center; padding: 3rem 0; }
                .empty-state { text-align: center; padding: 3rem 1rem; background: white; border: 2px dashed var(--color-slate-border); border-radius: 1.5rem; }
                .empty-icon { margin: 0 auto 1rem; color: var(--color-slate-mid); }
                .empty-state p { font-weight: 700; color: var(--color-slate-dark); font-size: 1rem; margin-bottom: 0.5rem; }
                .empty-state span { font-size: 0.85rem; color: var(--color-slate-mid); }

                /* Payments */
                .payments-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .payment-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 1rem 1.25rem; transition: box-shadow 0.2s, border-color 0.2s; }
                .payment-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); border-color: var(--color-brand); }
                .payment-row--paid { opacity: 0.65; }
                .payment-left { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }
                .payment-avatar { width: 42px; height: 42px; border-radius: 0.875rem; background: var(--color-brand); color: white; font-weight: 900; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .payment-student { font-weight: 800; color: var(--color-slate-dark); font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .payment-desc { font-size: 0.78rem; color: var(--color-slate-mid); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }
                .usage-badge { background: var(--color-brand-light); color: var(--color-brand); padding: 0.1rem 0.4rem; border-radius: 0.4rem; font-size: 0.65rem; font-weight: 800; }
                .payment-due { font-size: 0.72rem; color: var(--color-slate-mid); margin-top: 2px; }
                .payment-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0; }
                .payment-amount { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 900; color: var(--color-slate-dark); }
                .status-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
                .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
                .payment-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
                .btn-mark-paid { display: flex; align-items: center; justify-content: center; padding: 0.4rem; border-radius: 0.5rem; border: none; background: #D1FAE5; color: #059669; cursor: pointer; transition: all 0.2s; }
                .btn-mark-paid:hover { background: #059669; color: white; }
                .btn-mark-paid:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-revert { display: flex; align-items: center; justify-content: center; padding: 0.4rem; border-radius: 0.5rem; border: none; background: #E2E8F0; color: #475569; cursor: pointer; transition: all 0.2s; }
                .btn-revert:hover { background: #475569; color: white; }
                .btn-revert:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-whatsapp { display: flex; align-items: center; justify-content: center; padding: 0.4rem; border-radius: 0.5rem; border: none; background: #DCFCE7; color: #16A34A; cursor: pointer; transition: all 0.2s; }
                .btn-whatsapp:hover { background: #16A34A; color: white; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
                .modal-box { background: white; border-radius: 1.5rem; padding: 2rem; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(0,0,0,0.2); animation: modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .modal-header h3 { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); }
                .modal-close { padding: 0.375rem; border-radius: 0.5rem; border: none; background: var(--color-ice); color: var(--color-slate-mid); cursor: pointer; display: flex; }
                .modal-close:hover { background: var(--color-slate-border); }
                .modal-form { display: flex; flex-direction: column; gap: 1rem; }
                .mf-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .mf-group label { font-size: 0.8rem; font-weight: 700; color: var(--color-slate-dark); }
                .mf-input { padding: 0.7rem 1rem; border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem; background: var(--color-ice); color: var(--color-slate-dark); font-size: 0.95rem; outline: none; transition: border-color 0.2s; width: 100%; }
                .mf-input:focus { border-color: var(--color-brand); }
                .mf-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 0.75rem; }
                .mf-actions { display: flex; gap: 0.75rem; padding-top: 0.5rem; }
                .mf-btn-cancel { flex: 1; padding: 0.75rem; border: 1.5px solid var(--color-slate-border); border-radius: 0.875rem; background: white; color: var(--color-slate-mid); font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .mf-btn-cancel:hover { border-color: var(--color-slate-dark); color: var(--color-slate-dark); }
                .mf-btn-submit { flex: 2; padding: 0.75rem; border: none; border-radius: 0.875rem; background: var(--color-brand); color: white; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .mf-btn-submit:hover { filter: brightness(1.1); }
                .mf-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
