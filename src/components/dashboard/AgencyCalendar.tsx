import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';

type Student = Tables<'students'>;
type Appointment = Tables<'appointments'>;

interface CalendarEvent extends Appointment {
    student?: Student;
}

export default function AgencyCalendar() {
    const [viewDate, setViewDate] = useState(new Date());
    const [students, setStudents] = useState<Student[]>([]);
    const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Form States
    const [formTitle, setFormTitle] = useState('');
    const [formStudentId, setFormStudentId] = useState('');
    const [formStartTime, setFormStartTime] = useState('09:00');
    const [formDuration, setFormDuration] = useState('60'); // minutes

    const fetchInitialData = useCallback(async (tid: string) => {
        setLoading(true);
        try {
            // Fetch students for the dropdown
            const { data: stds } = await supabase
                .from('students')
                .select('*')
                .eq('teacher_id', tid)
                .order('name');

            setStudents(stds || []);

            // Fetch appointments
            const { data: apps } = await supabase
                .from('appointments')
                .select('*, student:students(*)')
                .eq('teacher_id', tid);

            setAppointments(apps as CalendarEvent[] || []);
        } catch (err) {
            console.error('Error fetching calendar data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setTeacherId(session.user.id);
                fetchInitialData(session.user.id);
            }
        };
        checkUser();
    }, [fetchInitialData]);

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleDayClick = (dayDate: Date) => {
        setSelectedDate(dayDate);
        setShowModal(true);
        setFormTitle('');
        setFormStudentId('');
    };

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacherId || !selectedDate) return;

        setModalLoading(true);

        // Construct ISO strings
        const start = new Date(selectedDate);
        const [hours, mins] = formStartTime.split(':').map(Number);
        start.setHours(hours, mins, 0, 0);

        const end = new Date(start.getTime() + parseInt(formDuration) * 60000);

        try {
            const { data, error } = await supabase
                .from('appointments')
                .insert({
                    teacher_id: teacherId,
                    student_id: formStudentId || null,
                    title: formTitle || (formStudentId ? `Aula: ${students.find(s => s.id === formStudentId)?.name}` : 'Aula'),
                    start_time: start.toISOString(),
                    end_time: end.toISOString(),
                    color: '#58317E' // Default brand color
                })
                .select('*, student:students(*)')
                .single();

            if (error) throw error;

            setAppointments(prev => [...prev, data as CalendarEvent]);
            setShowModal(false);
        } catch (err) {
            alert('Erro ao agendar aula.');
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    // Render Calendar Grid
    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells for previous month padding
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Real days
        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isToday = new Date().toDateString() === date.toDateString();

            // Map appointments for this day
            const dayEvents = appointments.filter(app => {
                const appDate = new Date(app.start_time);
                return appDate.toDateString() === date.toDateString();
            }).sort((a, b) => a.start_time.localeCompare(b.start_time));

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(date)}
                >
                    <span className="day-number">{d}</span>
                    <div className="event-stack">
                        {dayEvents.slice(0, 3).map(event => (
                            <div key={event.id} className="event-pill" title={event.title}>
                                {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.student?.name || event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="event-more">+{dayEvents.length - 3} mais</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return <div className="calendar-loading">Carregando Agenda...</div>;
    }

    return (
        <div className="calendar-wrapper">
            {/* Header */}
            <header className="calendar-header">
                <div>
                    <h2 className="calendar-month-title">
                        {viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                </div>
                <div className="calendar-nav-btns">
                    <button onClick={() => setViewDate(new Date())} className="btn-today">Hoje</button>
                    <button onClick={() => changeMonth(-1)} className="nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button onClick={() => changeMonth(1)} className="nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </header>

            {/* Weekdays Labels */}
            <div className="weekday-header">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="weekday-label">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="calendar-grid">
                {renderCalendar()}
            </div>

            {/* Modal for adding events */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Agendar Aula — {selectedDate?.toLocaleDateString('pt-BR')}</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
                        </div>

                        <form onSubmit={handleCreateAppointment} className="modal-form">
                            <div className="form-group">
                                <label>Aluno</label>
                                <select
                                    value={formStudentId}
                                    onChange={e => setFormStudentId(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Selecione um aluno (opcional)</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.language})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Título (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Aula de Conversação"
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label>Horário</label>
                                    <input
                                        type="time"
                                        value={formStartTime}
                                        onChange={e => setFormStartTime(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duração (minutos)</label>
                                    <select
                                        value={formDuration}
                                        onChange={e => setFormDuration(e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">1h</option>
                                        <option value="90">1h 30min</option>
                                        <option value="120">2h</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                                <button type="submit" disabled={modalLoading} className="btn-confirm">
                                    {modalLoading ? 'Agendando...' : 'Confirmar Agenda'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .calendar-wrapper {
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px solid var(--color-slate-border);
                    padding: 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .calendar-month-title {
                    font-family: var(--font-outfit);
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    text-transform: capitalize;
                }
                .calendar-nav-btns {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                .nav-btn, .btn-today {
                    background: var(--color-ice);
                    border: 1px solid var(--color-slate-border);
                    color: var(--color-slate-dark);
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .btn-today { padding: 0.5rem 1rem; }
                .nav-btn:hover, .btn-today:hover { background: white; border-color: var(--color-brand); }

                .weekday-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    margin-bottom: 0.5rem;
                }
                .weekday-label {
                    text-align: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1px;
                    background: var(--color-slate-border);
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    overflow: hidden;
                }
                .calendar-day {
                    background: white;
                    min-height: 120px;
                    padding: 0.75rem;
                    cursor: pointer;
                    transition: background 0.15s;
                    position: relative;
                }
                .calendar-day:hover { background: #F8FAFC; }
                .calendar-day.empty { background: #FAFAFA; cursor: default; }
                .calendar-day.today { background: rgba(88,49,126,0.03); }
                .calendar-day.today .day-number {
                    background: var(--color-brand);
                    color: white;
                    width: 24px; height: 24px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 6px;
                }

                .day-number {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                }

                .event-stack {
                    margin-top: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .event-pill {
                    background: var(--color-brand);
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .event-more {
                    font-size: 0.65rem;
                    color: var(--color-slate-mid);
                    font-weight: 600;
                    padding-left: 0.2rem;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(30,41,59,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }
                .modal-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .modal-header h3 {
                    font-family: var(--font-outfit);
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                }
                .close-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--color-slate-mid); }
                
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .form-group label { font-size: 0.8rem; font-weight: 700; color: var(--color-slate-dark); }
                .form-input {
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    font-size: 0.9rem;
                    outline: none;
                }
                .form-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }
                .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                .btn-cancel {
                    padding: 0.6rem 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-confirm {
                    padding: 0.6rem 1.5rem;
                    border-radius: 0.75rem;
                    background: var(--color-action);
                    color: white;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-confirm:hover { transform: translateY(-2px); }
                .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

                .calendar-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 400px;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    color: var(--color-brand);
                }
            `}</style>
        </div>
    );
}
