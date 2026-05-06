import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';
import { ChevronLeft, ChevronRight, MoreVertical, Calendar as CalendarIcon, Clock, User, X, Check, Edit2, Trash2, BookOpen, MessageSquare, FileText, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

type Student = Tables<'students'>;
type Appointment = Tables<'appointments'>;

interface CalendarEvent extends Appointment {
    student?: Student;
    teacher?: {
        display_name: string | null;
        full_name: string | null;
    };
}

type StudentWithProfile = Student & {
    profiles?: {
        whatsapp: string | null;
    } | null;
};

export default function AgencyCalendar() {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [students, setStudents] = useState<StudentWithProfile[]>([]);
    const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<CalendarEvent | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Context Menu state
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Form States
    const [formTitle, setFormTitle] = useState('');
    const [formStudentId, setFormStudentId] = useState('');
    const [formStartTime, setFormStartTime] = useState('09:00');
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formDuration, setFormDuration] = useState('60'); // minutes
    const [formRecurrence, setFormRecurrence] = useState<'none' | 'weekly' | 'biweekly' | 'monthly'>('none');
    const [formRecurrenceCount, setFormRecurrenceCount] = useState('4');
    const [formMeetingLink, setFormMeetingLink] = useState('');
    const [formNotifyWhatsApp, setFormNotifyWhatsApp] = useState(true);
    const [whatsappFallback, setWhatsappFallback] = useState('');
    const [isMultiMode, setIsMultiMode] = useState(false);
    const [multiSelectedDates, setMultiSelectedDates] = useState<string[]>([]);

    // Session Log Modal states
    const [showLogModal, setShowLogModal] = useState(false);
    const [logActiveTab, setLogActiveTab] = useState<'summary' | 'materials' | 'next'>('summary');
    const [logAppointment, setLogAppointment] = useState<CalendarEvent | null>(null);
    const [allTeacherMaterials, setAllTeacherMaterials] = useState<any[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    
    // Log form states
    const [logTopics, setLogTopics] = useState('');
    const [logEngagement, setLogEngagement] = useState<'baixo' | 'médio' | 'alto'>('médio');
    const [logRealDuration, setLogRealDuration] = useState('60');
    const [logNotes, setLogNotes] = useState('');
    const [logNextPlan, setLogNextPlan] = useState('');

    const fetchInitialData = useCallback(async (uid: string, role: 'teacher' | 'student') => {
        setLoading(true);
        try {
            // Fetch students list only for teachers
            if (role === 'teacher') {
                const { data: stds } = await supabase
                    .from('students')
                    .select('*, profiles!student_id(whatsapp)')
                    .eq('teacher_id', uid)
                    .order('name');
                setStudents(stds as any || []);

                const { data: apps } = await supabase
                    .from('appointments')
                    .select('*, student:students(*, profiles!student_id(whatsapp))')
                    .eq('teacher_id', uid);
                setAppointments(apps as any[] || []);
            } else {
                // First get the internal student ID from the students table
                const { data: studentRecord } = await supabase
                    .from('students')
                    .select('id')
                    .eq('student_id', uid)
                    .single();

                if (studentRecord) {
                    // Fetch student's own appointments
                    const { data: apps } = await supabase
                        .from('appointments')
                        .select('*, student:students(*), teacher:profiles!appointments_teacher_id_fkey(display_name, full_name)')
                        .eq('student_id', studentRecord.id);
                    setAppointments(apps as any[] || []);
                }
            }
        } catch (err) {
            console.error('Error fetching calendar data:', err);
            toast.error('Erro ao carregar dados da agenda.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const uid = session.user.id;
                setUserId(uid);
                
                // Determine role from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', uid)
                    .single();
                
                const role = profile?.role || 'teacher';
                setUserRole(role as 'teacher' | 'student');
                
                if (role === 'teacher') setTeacherId(uid);
                
                fetchInitialData(uid, role as 'teacher' | 'student');
            }
        };
        checkUser();
    }, [fetchInitialData]);

    // Handle outside clicks for the context menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const openCreateModal = () => {
        setEditingAppointment(null);
        setFormTitle('');
        setFormStudentId('');
        setFormStartTime('09:00');
        setFormDate(selectedDate.toISOString().split('T')[0]);
        setFormDuration('60');
        setFormRecurrence('none');
        setFormMeetingLink('');
        setWhatsappFallback('');
        setIsMultiMode(false);
        setMultiSelectedDates([selectedDate.toISOString().split('T')[0]]);
        setShowModal(true);
    };

    const openEditModal = (app: CalendarEvent) => {
        setEditingAppointment(app);
        setFormTitle(app.title);
        setFormStudentId(app.student_id || '');
        const date = new Date(app.start_time);
        setFormStartTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
        setFormDate(date.toISOString().split('T')[0]);
        
        const duration = (new Date(app.end_time).getTime() - date.getTime()) / 60000;
        setFormDuration(duration.toString());
        
        setShowModal(true);
        setActiveMenuId(null);
    };

    const handleSaveAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacherId || (!selectedDate && !isMultiMode)) return;

        setModalLoading(true);
        const [hours, mins] = formStartTime.split(':').map(Number);
        const durationMs = parseInt(formDuration) * 60000;

        // Determine all target dates
        let targetDates: Date[] = [];
        if (isMultiMode) {
            targetDates = multiSelectedDates.map(d => {
                const date = new Date(d + 'T12:00:00'); // Neutral time to avoid TZ shifts
                date.setHours(hours, mins, 0, 0);
                return date;
            });
        } else {
            const start = new Date(formDate + 'T12:00:00');
            start.setHours(hours, mins, 0, 0);
            targetDates.push(start);

            if (formRecurrence !== 'none') {
                const count = parseInt(formRecurrenceCount);
                for (let i = 1; i < count; i++) {
                    const next = new Date(start);
                    if (formRecurrence === 'weekly') next.setDate(start.getDate() + (i * 7));
                    if (formRecurrence === 'biweekly') next.setDate(start.getDate() + (i * 14));
                    if (formRecurrence === 'monthly') next.setMonth(start.getMonth() + i);
                    targetDates.push(next);
                }
            }
        }

        try {
            const selectedStudent = students.find(s => s.id === formStudentId);
            const finalTitle = formTitle || (formStudentId ? `Aula: ${selectedStudent?.name}` : 'Aula');

            // Save WhatsApp fallback if provided
            if (whatsappFallback && selectedStudent && !selectedStudent.profiles?.whatsapp && selectedStudent.student_id) {
                await supabase
                    .from('profiles')
                    .update({ whatsapp: whatsappFallback })
                    .eq('id', selectedStudent.student_id);
                
                // Update local state for future sessions
                setStudents(prev => prev.map(s => s.id === selectedStudent.id ? {
                    ...s,
                    profiles: { ...s.profiles, whatsapp: whatsappFallback }
                } : s));
            }

            if (editingAppointment) {
                // Update single
                const start = targetDates[0];
                const end = new Date(start.getTime() + durationMs);
                const { data, error } = await supabase
                    .from('appointments')
                    .update({
                        student_id: formStudentId || null,
                        title: finalTitle,
                        start_time: start.toISOString(),
                        end_time: end.toISOString(),
                        description: (editingAppointment.description || '') + (formMeetingLink ? ` [LINK:${formMeetingLink}]` : '')
                    })
                    .eq('id', editingAppointment.id)
                    .select('*, student:students(*)')
                    .single();

                if (error) throw error;
                setAppointments(prev => prev.map(a => a.id === data.id ? data as CalendarEvent : a));
                toast.success('Aula atualizada!');
            } else {
                // Insert one or multiple
                const inserts = targetDates.map(date => ({
                    teacher_id: teacherId,
                    student_id: formStudentId || null,
                    title: finalTitle,
                    start_time: date.toISOString(),
                    end_time: new Date(date.getTime() + durationMs).toISOString(),
                    color: '#58317E',
                    description: formMeetingLink ? `[LINK:${formMeetingLink}]` : ''
                }));

                const { data, error } = await supabase
                    .from('appointments')
                    .insert(inserts)
                    .select('*, student:students(*)');

                if (error) throw error;
                setAppointments(prev => [...prev, ...(data as any[])]);
                toast.success(`${inserts.length > 1 ? `${inserts.length} aulas agendadas!` : 'Aula agendada!'}`);

                // WhatsApp Notification (Informal)
                const finalPhone = selectedStudent?.profiles?.whatsapp || whatsappFallback;
                if (formNotifyWhatsApp && selectedStudent && finalPhone) {
                    const firstName = selectedStudent.name.split(' ')[0];
                    const firstDate = targetDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    const firstTime = targetDates[0].toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const linkMsg = formMeetingLink ? `\n\n*Instruções de Acesso:*\n${formMeetingLink}\n` : '';
                    const msg = `Olá, ${firstName}! Nossa próxima aula agendada é no dia ${firstDate} às ${firstTime}.${linkMsg}\nTe espero lá. Tamo junto!`;
                    
                    const waLink = `https://wa.me/${finalPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
                    window.open(waLink, '_blank');
                }
            }
            setShowModal(false);
        } catch (err) {
            toast.error('Erro ao salvar agendamento.');
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    const handleMarkAttendance = async (app: CalendarEvent) => {
        // Validation: Presence already marked?
        if (app.description?.includes('[PRESENÇA]')) {
            toast.error('Presença já registrada para esta aula.');
            return;
        }

        // Must have at least the student entry ID
        if (!app.student_id) {
            toast.error('Não foi possível identificar o aluno desta aula.');
            return;
        }

        if (!userId) {
            toast.error('Usuário não autenticado no sistema.');
            return;
        }

        // Open the log modal
        setLogAppointment(app);
        setLogRealDuration(( (new Date(app.end_time).getTime() - new Date(app.start_time).getTime()) / 60000 ).toString());
        setLogTopics(app.title || '');
        setLogNotes('');
        setLogNextPlan('');
        setLogEngagement('médio');
        setSelectedMaterials([]);
        setLogActiveTab('summary');
        
        // Fetch teacher materials for sharing tab
        const { data: mats } = await supabase
            .from('materials')
            .select('*')
            .eq('teacher_id', userId)
            .is('student_id', null); // Only show unshared/private ones in list

        setAllTeacherMaterials(mats || []);
        setShowLogModal(true);
        setActiveMenuId(null);
    };

    const handleSaveLog = async () => {
        if (!logAppointment || !userId || !logAppointment.student_id) {
            toast.error('Dados incompletos para salvar o histórico.');
            return;
        }
        
        const studentProfileId = logAppointment.student?.student_id;
        const studentInternalId = logAppointment.student_id;

        setModalLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            const response = await fetch('/api/teacher/log-presence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    appointmentId: logAppointment.id,
                    studentInternalId,
                    studentProfileId,
                    topics: logTopics,
                    engagement: logEngagement,
                    duration: logRealDuration,
                    notes: logNotes,
                    nextPlan: logNextPlan,
                    selectedMaterials
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Erro ao salvar log');

            // Update local state
            setAppointments(prev => prev.map(a => a.id === logAppointment.id ? { 
                ...a, 
                description: (a.description || '') + ' [PRESENÇA]' 
            } : a));

            toast.success(result.message || 'Aula registrada com sucesso!');
            setShowLogModal(false);
        } catch (err: any) {
            console.error('SaveLog Error:', err);
            toast.error(`Erro ao salvar: ${err.message || 'Verifique sua conexão'}`);
        } finally {
            setModalLoading(false);
        }
    };

    const handleSendReminder = (app: CalendarEvent) => {
        const student = app.student as any;
        const phone = student?.profiles?.whatsapp;
        if (!phone) {
            toast.error('Aluno sem WhatsApp cadastrado.');
            return;
        }

        const firstName = (student?.name || 'aluno').split(' ')[0];
        const time = new Date(app.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Extract link from description if exists (using dotAll style regex)
        const linkMatch = app.description?.match(/\[LINK:([\s\S]*?)\]/);
        const link = linkMatch ? linkMatch[1] : null;
        const linkMsg = link ? `\n\n*Instruções de Acesso:*\n${link}\n` : '';

        const msg = `Bom dia, ${firstName}! Passando para lembrar da nossa aula de hoje às ${time}.${linkMsg}\nNos vemos daqui a pouco! 🚀`;
        const waLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
        window.open(waLink, '_blank');
    };

    const handleMarkAbsence = async (app: CalendarEvent) => {
        if (!confirm(`Confirmar falta para ${app.student?.name}? Isso zerará a sequência de presença (streak). O aluno perderá os bônus acumulados e voltará a ganhar apenas as 10 moedas base na próxima aula.`)) return;

        const studentProfileId = app.student?.student_id;
        setModalLoading(true);

        try {
            // 1. Reset Streak in Profile
            if (studentProfileId) {
                await supabase
                    .from('profiles')
                    .update({ attendance_streak: 0 })
                    .eq('id', studentProfileId);
            }

            // 2. Mark appointment as Absence
            const { error: appError } = await supabase
                .from('appointments')
                .update({ description: (app.description || '') + ' [FALTA]' })
                .eq('id', app.id);
            if (appError) throw appError;

            // Update local state
            setAppointments(prev => prev.map(a => a.id === app.id ? { 
                ...a, 
                description: (a.description || '') + ' [FALTA]' 
            } : a));

            toast.success('Falta registrada. O bônus do aluno foi resetado.');
        } catch (err: any) {
            console.error('MarkAbsence Error:', err);
            toast.error('Erro ao registrar falta.');
        } finally {
            setModalLoading(false);
            setActiveMenuId(null);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm('Tem certeza que deseja cancelar esta aula?')) return;
        
        try {
            const { error } = await supabase.from('appointments').delete().eq('id', id);
            if (error) throw error;
            setAppointments(prev => prev.filter(a => a.id !== id));
            toast.success('Aula cancelada com sucesso.');
        } catch (err) {
            toast.error('Erro ao cancelar aula.');
            console.error(err);
        }
        setActiveMenuId(null);
    };

    const selectedDayEvents = appointments.filter(app => {
        const appDate = new Date(app.start_time);
        return appDate.toDateString() === selectedDate.toDateString();
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));

    const renderCalendarGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="cal-day empty" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();
            
            const hasEvents = appointments.some(app => {
                const appDate = new Date(app.start_time);
                return appDate.toDateString() === date.toDateString();
            });

            days.push(
                <motion.div
                    key={d}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-val">{d}</span>
                    {hasEvents && <div className="event-dot" />}
                </motion.div>
            );
        }
        return days;
    };

    if (loading) {
        return (
            <div className="calendar-loading">
                <div className="spinner"></div>
                <p>Carregando sua agenda...</p>
            </div>
        );
    }

    return (
        <div className="calendar-page-container">
            {/* Header Actions */}
            <header className="actions-header">
                <div>
                    <h2 className="section-title">
                        {userRole === 'teacher' ? 'Ações do Calendário' : 'Minha Agenda'}
                    </h2>
                    <p className="section-subtitle">
                        {userRole === 'teacher' 
                            ? 'Agende novas aulas ou marque presenças pendentes.' 
                            : 'Visualize seus horários de aula e compromissos.'}
                    </p>
                </div>
                {userRole === 'teacher' && (
                    <div className="action-buttons">
                        <button onClick={openCreateModal} className="btn-primary">
                            <CalendarIcon size={18} />
                            Agendar Aula
                        </button>
                        <button className="btn-ghost">
                            <Check size={18} />
                            Marcar Presenças
                        </button>
                    </div>
                )}
            </header>

            <div className="calendar-main-layout">
                {/* Left Column: Monthly View */}
                <div className="calendar-card side-calendar">
                    <div className="side-cal-header">
                        <button onClick={() => changeMonth(-1)} className="nav-icon"><ChevronLeft size={20} /></button>
                        <h3>{viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)} className="nav-icon"><ChevronRight size={20} /></button>
                    </div>

                    <div className="side-cal-weekdays">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                            <div key={d} className="weekday">{d}</div>
                        ))}
                    </div>

                    <div className="side-cal-grid">
                        {renderCalendarGrid()}
                    </div>
                </div>

                {/* Right Column: Day Appointments */}
                <div className="calendar-card day-details">
                    <div className="day-header">
                        <h3>Aulas para {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                    </div>

                    <div className="appointments-list">
                        {selectedDayEvents.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📅</div>
                                <p>Nenhuma aula agendada para este dia.</p>
                                {userRole === 'teacher' && (
                                    <button onClick={openCreateModal} className="btn-link">Agendar agora</button>
                                )}
                            </div>
                        ) : (
                            selectedDayEvents.map(app => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={app.id} 
                                    className="appointment-item"
                                    style={{ zIndex: activeMenuId === app.id ? 50 : 1 }}
                                >
                                    <div className="app-info">
                                        <h4 className="student-name">
                                            {userRole === 'teacher' 
                                                ? (app.student?.name || app.title)
                                                : (app.teacher ? `Aula com Sensei ${app.teacher.display_name || app.teacher.full_name?.split(' ')[0]}` : app.title)
                                            }
                                        </h4>
                                        <div className="app-meta">
                                            <span><Clock size={14} /> {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(app.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {app.description?.includes('[PRESENÇA]') && (
                                                <span className="status-badge attended"><Check size={12} /> Presença Marcada</span>
                                            )}
                                            {app.description?.includes('[FALTA]') && (
                                                <span className="status-badge attended" style={{ background: '#fee2e2', color: '#dc2626' }}><X size={12} /> Faltou</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {userRole === 'teacher' && (
                                        <div className="app-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {!app.description?.includes('[PRESENÇA]') && !app.description?.includes('[FALTA]') && (
                                                <button 
                                                    onClick={() => handleSendReminder(app)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                                    title="Enviar Lembrete WhatsApp"
                                                >
                                                    <MessageSquare size={16} />
                                                </button>
                                            )}
                                            <button 
                                                className="action-trigger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === app.id ? null : app.id);
                                                }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            <AnimatePresence>
                                                {activeMenuId === app.id && (
                                                    <motion.div 
                                                        ref={menuRef}
                                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                        className="context-menu"
                                                    >
                                                        {!app.description?.includes('[PRESENÇA]') && !app.description?.includes('[FALTA]') && (
                                                            <>
                                                                <button onClick={() => handleMarkAttendance(app)} className="menu-item highlight">
                                                                    <Check size={16} /> Marcar Presença
                                                                </button>
                                                                <button onClick={() => handleMarkAbsence(app)} className="menu-item text-red-500">
                                                                    <X size={16} /> Registrar Falta
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => openEditModal(app)} className="menu-item">
                                                            <Edit2 size={16} /> Remarcar
                                                        </button>
                                                        <button onClick={() => handleDeleteAppointment(app.id)} className="menu-item delete">
                                                            <Trash2 size={16} /> Cancelar Aula
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for adding/editing events */}
            <AnimatePresence>
                {showModal && (
                    <div className="mod-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="mod-box"
                        >
                            <div className="mod-header">
                                <h3>{editingAppointment ? 'Remarcar Aula' : 'Agendar Nova Aula'}</h3>
                                <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSaveAppointment} className="mod-form">
                                <div className="mod-body scroll-y">
                                    <div className="f-group">
                                    <label>Aluno</label>
                                    <select
                                        value={formStudentId}
                                        onChange={e => setFormStudentId(e.target.value)}
                                        className="f-input"
                                        required={!formTitle}
                                    >
                                        <option value="">Selecione um aluno</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="f-group">
                                    <label>Título ou Objetivo (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Aula de Reforço"
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        className="f-input"
                                    />
                                </div>
                                
                                <div className="f-group">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        value={formDate}
                                        onChange={e => setFormDate(e.target.value)}
                                        className="f-input"
                                        required
                                    />
                                </div>

                                <div className="f-row">
                                    <div className="f-group">
                                        <label>Horário</label>
                                        <input
                                            type="time"
                                            value={formStartTime}
                                            onChange={e => setFormStartTime(e.target.value)}
                                            className="f-input"
                                            required
                                        />
                                    </div>
                                    <div className="f-group">
                                        <label>Duração</label>
                                        <select
                                            value={formDuration}
                                            onChange={e => setFormDuration(e.target.value)}
                                            className="f-input"
                                        >
                                            <option value="30">30 min</option>
                                            <option value="45">45 min</option>
                                            <option value="60">1h</option>
                                            <option value="90">1h 30min</option>
                                            <option value="120">2h</option>
                                        </select>
                                    </div>
                                </div>

                                {!editingAppointment && (
                                    <div className="f-group bg-ice/50 p-4 rounded-2xl border border-slate-border/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="m-0 text-brand font-bold flex items-center gap-2">
                                                <CalendarIcon size={16} /> Estratégia de Agenda
                                            </label>
                                            <button 
                                                type="button"
                                                onClick={() => setIsMultiMode(!isMultiMode)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 transition-all ${isMultiMode ? 'bg-brand text-white border-brand' : 'text-slate-mid border-slate-border hover:border-brand/40'}`}
                                            >
                                                {isMultiMode ? 'Modo: Multi-Datas' : 'Mudar para Multi-Datas'}
                                            </button>
                                        </div>

                                        {isMultiMode ? (
                                            <div className="grid grid-cols-4 gap-2 mb-2">
                                                {/* Mini selector for multi-dates could go here, but for now simple multiSelectedDates check */}
                                                <p className="col-span-4 text-[11px] text-slate-mid italic">Selecione os dias clicando no calendário atrás antes de abrir este modal (Melhoria Futura) ou use a recorrência abaixo:</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <label className="text-[10px] uppercase font-bold text-slate-mid block mb-1">Repetir Aula</label>
                                                    <select
                                                        value={formRecurrence}
                                                        onChange={e => setFormRecurrence(e.target.value as any)}
                                                        className="f-input"
                                                    >
                                                        <option value="none">Não repetir</option>
                                                        <option value="weekly">Semanalmente</option>
                                                        <option value="biweekly">Quinzenalmente</option>
                                                        <option value="monthly">Mensalmente</option>
                                                    </select>
                                                </div>
                                                {formRecurrence !== 'none' && (
                                                    <div className="w-24">
                                                        <label className="text-[10px] uppercase font-bold text-slate-mid block mb-1">Vezes</label>
                                                        <input 
                                                            type="number" 
                                                            value={formRecurrenceCount} 
                                                            onChange={e => setFormRecurrenceCount(e.target.value)} 
                                                            className="f-input"
                                                            min="2"
                                                            max="52"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="f-group">
                                    <label>Instruções de Acesso (Link, ID, Senha)</label>
                                    <textarea
                                        placeholder="Cole o link do Meet ou o convite completo do Zoom aqui..."
                                        value={formMeetingLink}
                                        onChange={e => setFormMeetingLink(e.target.value)}
                                        className="f-input h-24 pt-3 resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-200">
                                    <input 
                                        type="checkbox" 
                                        id="notifyWA"
                                        checked={formNotifyWhatsApp}
                                        onChange={e => setFormNotifyWhatsApp(e.target.checked)}
                                        className="w-5 h-5 accent-green-600"
                                    />
                                    <label htmlFor="notifyWA" className="m-0 text-sm font-bold text-green-800 cursor-pointer flex-1">
                                        Notificar aluno via WhatsApp ao confirmar
                                    </label>
                                </div>

                                {formNotifyWhatsApp && formStudentId && !students.find(s => s.id === formStudentId)?.profiles?.whatsapp && (
                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 animate-fade-in">
                                        <label className="text-[10px] font-black text-amber-700 uppercase mb-1 block">WhatsApp não cadastrado para este aluno:</label>
                                        <input 
                                            type="text"
                                            placeholder="Digite o WhatsApp para salvar..."
                                            value={whatsappFallback}
                                            onChange={e => setWhatsappFallback(e.target.value)}
                                            className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>
                                )}

                                </div>
                                <div className="mod-actions">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                                    <button type="submit" disabled={modalLoading} className="btn-save">
                                        {modalLoading ? 'Salvando...' : editingAppointment ? 'Atualizar Aula' : 'Confirmar Agenda'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal for Class Session Log */}
            <AnimatePresence>
                {showLogModal && (
                    <div className="mod-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogModal(false)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="mod-box log-modal"
                        >
                            <div className="mod-header log-header">
                                <div>
                                    <h3>Registrar Histórico da Aula</h3>
                                    <p className="log-subtitle">Aluno: {logAppointment?.student?.name} • Data: {new Date(logAppointment?.start_time || '').toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => setShowLogModal(false)} className="close-btn"><X size={20} /></button>
                            </div>

                            <div className="log-tabs">
                                <button className={`log-tab ${logActiveTab === 'summary' ? 'active' : ''}`} onClick={() => setLogActiveTab('summary')}>
                                    <MessageSquare size={16} /> Resumo
                                </button>
                                <button className={`log-tab ${logActiveTab === 'materials' ? 'active' : ''}`} onClick={() => setLogActiveTab('materials')}>
                                    <Library size={16} /> Materiais
                                </button>
                                <button className={`log-tab ${logActiveTab === 'next' ? 'active' : ''}`} onClick={() => setLogActiveTab('next')}>
                                    <FileText size={16} /> Próxima Aula
                                </button>
                            </div>

                            <div className="log-content scroll-y">
                                {logActiveTab === 'summary' && (
                                    <div className="log-step">
                                        <div className="f-group">
                                            <label>O que foi coberto na aula?</label>
                                            <textarea 
                                                className="f-input f-text" 
                                                placeholder="Ex: Revisão do simple past, exercícios de conversação..."
                                                value={logTopics}
                                                onChange={e => setLogTopics(e.target.value)}
                                            />
                                        </div>
                                        <div className="f-row">
                                            <div className="f-group">
                                                <label>Engajamento do Aluno</label>
                                                <div className="engagement-options">
                                                    {(['baixo', 'médio', 'alto'] as const).map(opt => (
                                                        <label key={opt} className={`eng-opt ${logEngagement === opt ? 'active' : ''}`}>
                                                            <input type="radio" name="engagement" value={opt} checked={logEngagement === opt} onChange={() => setLogEngagement(opt)} />
                                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="f-group">
                                                <label>Duração Real (minutos)</label>
                                                <input type="number" className="f-input" value={logRealDuration} onChange={e => setLogRealDuration(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="f-group">
                                            <label>Notas e Observações</label>
                                            <textarea 
                                                className="f-input f-text" 
                                                placeholder="Notas internas sobre o desenvolvimento do aluno..."
                                                value={logNotes}
                                                onChange={e => setLogNotes(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {logActiveTab === 'materials' && (
                                    <div className="log-step">
                                        <label className="section-label">Compartilhar Materiais da Biblioteca</label>
                                        <div className="library-selection">
                                            {allTeacherMaterials.length === 0 ? (
                                                <div className="empty-lib">Sua biblioteca está vazia. Suba arquivos no Gerenciador de Materiais.</div>
                                            ) : (
                                                allTeacherMaterials.map(m => (
                                                    <label key={m.id} className={`lib-item ${selectedMaterials.includes(m.id) ? 'selected' : ''}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedMaterials.includes(m.id)} 
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedMaterials([...selectedMaterials, m.id]);
                                                                else setSelectedMaterials(selectedMaterials.filter(id => id !== m.id));
                                                            }} 
                                                        />
                                                        <span className="lib-icon">{m.type === 'pdf' ? '📄' : '🖼️'}</span>
                                                        <span className="lib-name">{m.name}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {logActiveTab === 'next' && (
                                    <div className="log-step">
                                        <div className="f-group">
                                            <label>Programação para a Próxima Aula</label>
                                            <textarea 
                                                className="f-input f-text" 
                                                style={{ height: '200px' }}
                                                placeholder="Quais tópicos ou atividades você planeja para o próximo encontro?"
                                                value={logNextPlan}
                                                onChange={e => setLogNextPlan(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mod-actions log-footer">
                                <button onClick={() => setShowLogModal(false)} className="btn-cancel">Cancelar</button>
                                <button className="btn-save" onClick={handleSaveLog} disabled={modalLoading}>
                                    {modalLoading ? 'Salvando...' : 'Confirmar Presença e Salvar'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .calendar-page-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .actions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: white;
                    padding: 1.5rem 2rem;
                    border-radius: 1.25rem;
                    border: 1px solid var(--color-slate-border);
                    box-shadow: var(--shadow-card);
                }

                .section-title {
                    font-family: var(--font-outfit);
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0;
                    color: var(--color-slate-dark);
                }

                .section-subtitle {
                    color: var(--color-slate-mid);
                    margin: 0.25rem 0 0 0;
                    font-size: 0.95rem;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .calendar-main-layout {
                    display: grid;
                    grid-template-columns: 7fr 3fr;
                    gap: 1.5rem;
                    align-items: start;
                }

                .calendar-card {
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px solid var(--color-slate-border);
                    box-shadow: var(--shadow-card);
                    position: relative;
                }

                .side-calendar {
                    padding: 1.5rem;
                }

                .side-cal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .side-cal-header h3 {
                    margin: 0;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    text-transform: capitalize;
                    color: var(--color-slate-dark);
                }

                .nav-icon {
                    background: var(--color-ice);
                    border: none;
                    color: var(--color-slate-dark);
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .nav-icon:hover {
                    background: var(--color-lilac);
                    color: var(--color-brand);
                }

                .side-cal-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    margin-bottom: 0.5rem;
                }

                .weekday {
                    text-align: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    padding: 0.5rem 0;
                }

                .side-cal-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                }

                .cal-day {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-slate-dark);
                    position: relative;
                    transition: all 0.2s;
                }

                .cal-day:hover { background: var(--color-ice); }
                .cal-day.empty { cursor: default; }
                .cal-day.empty:hover { background: none; }
                
                .cal-day.today {
                    color: var(--color-brand);
                    background: var(--color-lilac);
                }

                .cal-day.selected {
                    background: var(--color-brand);
                    color: white;
                }

                .event-dot {
                    width: 4px;
                    height: 4px;
                    background: currentColor;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 6px;
                }

                .day-details {
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                }

                .day-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--color-slate-border);
                }

                .day-header h3 {
                    margin: 0;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    color: var(--color-slate-dark);
                }

                .appointments-list {
                    padding: 1.5rem 2rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .appointment-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-white);
                    transition: all 0.2s;
                }

                .appointment-item:hover {
                    border-color: var(--color-brand);
                    box-shadow: 0 4px 12px rgba(88, 49, 126, 0.08);
                }

                .app-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .student-name {
                    margin: 0;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--color-slate-dark);
                }

                .app-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    font-size: 0.85rem;
                    color: var(--color-slate-mid);
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.15rem 0.5rem;
                    border-radius: 99px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .status-badge.attended {
                    background: #DCFCE7;
                    color: #166534;
                }

                .menu-item.highlight {
                    color: var(--color-brand);
                    background: var(--color-lilac);
                }
                .menu-item.highlight:hover {
                    background: #EBE4FF;
                }

                .app-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .app-actions {
                    position: relative;
                }

                .action-trigger {
                    background: none;
                    border: none;
                    color: var(--color-slate-mid);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.2s;
                }

                .action-trigger:hover {
                    background: var(--color-ice);
                    color: var(--color-slate-dark);
                }

                .context-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 100;
                    width: 180px;
                    padding: 0.5rem;
                    margin-top: 0.5rem;
                }

                .menu-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--color-slate-dark);
                    cursor: pointer;
                    border-radius: 0.5rem;
                    transition: background 0.2s;
                }

                .menu-item:hover { background: var(--color-ice); }
                .menu-item.delete { color: #EF4444; }
                .menu-item.delete:hover { background: #FEF2F2; }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    text-align: center;
                    color: var(--color-slate-mid);
                }

                .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

                .btn-link {
                    background: none;
                    border: none;
                    color: var(--color-brand);
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: underline;
                    margin-top: 0.5rem;
                }

                /* Modal Unified Styles */
                .mod-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(30,41,59,0.5);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                }

                .mod-box {
                    background: white;
                    width: 100%;
                    max-width: 480px;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    max-height: 95vh;
                }

                .mod-header {
                    padding: 1.5rem 2rem;
                    background: var(--color-brand);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .mod-header h3 {
                    margin: 0;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 1.25rem;
                }

                .close-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }
                .close-btn:hover { opacity: 1; }

                .mod-form { 
                    display: flex; 
                    flex-direction: column; 
                    flex: 1; 
                    overflow: hidden;
                    padding: 0;
                    gap: 0;
                }
                .mod-body {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    flex: 1;
                    overflow-y: auto;
                }
                .f-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .f-group label { font-size: 0.85rem; font-weight: 700; color: var(--color-slate-dark); }
                .f-input {
                    padding: 0.875rem 1.25rem;
                    border-radius: 1rem;
                    border: 2px solid var(--color-slate-border);
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .f-input:focus { border-color: var(--color-brand); }
                .f-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .mod-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.25rem 2rem;
                    background: #F8FAFC;
                    border-top: 1px solid var(--color-slate-border);
                }

                .btn-cancel {
                    padding: 0.875rem 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--color-slate-border);
                    background: white;
                    font-weight: 700;
                    cursor: pointer;
                }

                .btn-save {
                    padding: 0.875rem 2rem;
                    border-radius: 1rem;
                    background: var(--color-action);
                    color: white;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: var(--shadow-btn);
                    transition: transform 0.2s;
                }
                .btn-save:hover { transform: translateY(-2px); }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--color-ice);
                    border-top-color: var(--color-brand);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .calendar-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 1rem;
                }

                /* Log Modal Styles */
                .log-modal {
                    max-width: 700px !important;
                }

                .log-header {
                    background: var(--color-brand);
                    padding: 1.5rem 2rem;
                }

                .log-subtitle {
                    font-size: 0.85rem;
                    opacity: 0.9;
                    margin: 0.25rem 0 0 0;
                }

                .log-tabs {
                    display: flex;
                    background: #F1F5F9;
                    padding: 0.5rem;
                    gap: 0.5rem;
                }

                .log-tab {
                    flex: 1;
                    padding: 0.75rem;
                    border: none;
                    background: none;
                    border-radius: 0.5rem;
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .log-tab.active {
                    background: white;
                    color: var(--color-brand);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .log-content {
                    padding: 1.5rem 2rem;
                    overflow-y: auto;
                    flex: 1;
                }

                .f-text {
                    height: 120px;
                    resize: none;
                }

                .engagement-options {
                    display: flex;
                    gap: 0.5rem;
                }

                .eng-opt {
                    flex: 1;
                    padding: 0.6rem;
                    border: 2px solid var(--color-slate-border);
                    border-radius: 0.75rem;
                    text-align: center;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }

                .eng-opt input { display: none; }

                .eng-opt.active {
                    border-color: var(--color-brand);
                    background: var(--color-lilac);
                    color: var(--color-brand);
                }

                .section-label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    margin-bottom: 1rem;
                }

                .library-selection {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .lib-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                }

                .lib-item:hover { border-color: var(--color-brand); }
                .lib-item.selected {
                    background: var(--color-lilac);
                    border-color: var(--color-brand);
                }

                .lib-icon { font-size: 1.25rem; }
                .lib-name { font-weight: 600; font-size: 0.9rem; color: var(--color-slate-dark); }

                .log-footer {
                    padding: 1.25rem 2rem;
                    background: #F8FAFC;
                    border-top: 1px solid var(--color-slate-border);
                    margin: 0;
                }

                .scroll-y {
                    scrollbar-width: thin;
                    scrollbar-color: var(--color-slate-border) transparent;
                }
                .scroll-y::-webkit-scrollbar { width: 6px; }
                .scroll-y::-webkit-scrollbar-thumb { background: var(--color-slate-border); border-radius: 10px; }

                .empty-lib {
                    text-align: center;
                    padding: 2rem;
                    color: var(--color-slate-mid);
                    font-size: 0.9rem;
                    border: 2px dashed var(--color-slate-border);
                    border-radius: 1rem;
                }

                @media (max-width: 900px) {
                    .calendar-main-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
