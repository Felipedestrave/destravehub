import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useCallback, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';

function AgencyCalendar() {
  const [viewDate, setViewDate] = useState(/* @__PURE__ */ new Date());
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formStudentId, setFormStudentId] = useState("");
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formDuration, setFormDuration] = useState("60");
  const fetchInitialData = useCallback(async (tid) => {
    setLoading(true);
    try {
      const { data: stds } = await supabase.from("students").select("*").eq("teacher_id", tid).order("name");
      setStudents(stds || []);
      const { data: apps } = await supabase.from("appointments").select("*, student:students(*)").eq("teacher_id", tid);
      setAppointments(apps || []);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
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
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const changeMonth = (offset) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  const handleDayClick = (dayDate) => {
    setSelectedDate(dayDate);
    setShowModal(true);
    setFormTitle("");
    setFormStudentId("");
  };
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!teacherId || !selectedDate) return;
    setModalLoading(true);
    const start = new Date(selectedDate);
    const [hours, mins] = formStartTime.split(":").map(Number);
    start.setHours(hours, mins, 0, 0);
    const end = new Date(start.getTime() + parseInt(formDuration) * 6e4);
    try {
      const { data, error } = await supabase.from("appointments").insert({
        teacher_id: teacherId,
        student_id: formStudentId || null,
        title: formTitle || (formStudentId ? `Aula: ${students.find((s) => s.id === formStudentId)?.name}` : "Aula"),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        color: "#58317E"
        // Default brand color
      }).select("*, student:students(*)").single();
      if (error) throw error;
      setAppointments((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      alert("Erro ao agendar aula.");
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };
  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(/* @__PURE__ */ jsx("div", { className: "calendar-day empty" }, `empty-${i}`));
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const isToday = (/* @__PURE__ */ new Date()).toDateString() === date.toDateString();
      const dayEvents = appointments.filter((app) => {
        const appDate = new Date(app.start_time);
        return appDate.toDateString() === date.toDateString();
      }).sort((a, b) => a.start_time.localeCompare(b.start_time));
      days.push(
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `calendar-day ${isToday ? "today" : ""}`,
            onClick: () => handleDayClick(date),
            children: [
              /* @__PURE__ */ jsx("span", { className: "day-number", children: d }),
              /* @__PURE__ */ jsxs("div", { className: "event-stack", children: [
                dayEvents.slice(0, 3).map((event) => /* @__PURE__ */ jsxs("div", { className: "event-pill", title: event.title, children: [
                  new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  " - ",
                  event.student?.name || event.title
                ] }, event.id)),
                dayEvents.length > 3 && /* @__PURE__ */ jsxs("div", { className: "event-more", children: [
                  "+",
                  dayEvents.length - 3,
                  " mais"
                ] })
              ] })
            ]
          },
          d
        )
      );
    }
    return days;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "calendar-loading", children: "Carregando Agenda..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "calendar-wrapper", children: [
    /* @__PURE__ */ jsxs("header", { className: "calendar-header", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "calendar-month-title", children: viewDate.toLocaleString("pt-BR", { month: "long", year: "numeric" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "calendar-nav-btns", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setViewDate(/* @__PURE__ */ new Date()), className: "btn-today", children: "Hoje" }),
        /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(-1), className: "nav-btn", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(1), className: "nav-btn", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "weekday-header", children: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => /* @__PURE__ */ jsx("div", { className: "weekday-label", children: d }, d)) }),
    /* @__PURE__ */ jsx("div", { className: "calendar-grid", children: renderCalendar() }),
    showModal && /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: (e) => e.target === e.currentTarget && setShowModal(false), children: /* @__PURE__ */ jsxs("div", { className: "modal-box", children: [
      /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
        /* @__PURE__ */ jsxs("h3", { children: [
          "Agendar Aula — ",
          selectedDate?.toLocaleDateString("pt-BR")
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowModal(false), className: "close-btn", children: "✕" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateAppointment, className: "modal-form", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { children: "Aluno" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: formStudentId,
              onChange: (e) => setFormStudentId(e.target.value),
              className: "form-input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um aluno (opcional)" }),
                students.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                  s.name,
                  " (",
                  s.language,
                  ")"
                ] }, s.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { children: "Título (Opcional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ex: Aula de Conversação",
              value: formTitle,
              onChange: (e) => setFormTitle(e.target.value),
              className: "form-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "row", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { children: "Horário" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "time",
                value: formStartTime,
                onChange: (e) => setFormStartTime(e.target.value),
                className: "form-input",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { children: "Duração (minutos)" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: formDuration,
                onChange: (e) => setFormDuration(e.target.value),
                className: "form-input",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "30", children: "30 min" }),
                  /* @__PURE__ */ jsx("option", { value: "45", children: "45 min" }),
                  /* @__PURE__ */ jsx("option", { value: "60", children: "1h" }),
                  /* @__PURE__ */ jsx("option", { value: "90", children: "1h 30min" }),
                  /* @__PURE__ */ jsx("option", { value: "120", children: "2h" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "modal-actions", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowModal(false), className: "btn-cancel", children: "Cancelar" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: modalLoading, className: "btn-confirm", children: modalLoading ? "Agendando..." : "Confirmar Agenda" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
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
            ` })
  ] });
}

const $$Calendar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Agenda — Destrave Hub", "activeNav": "calendar", "data-astro-cid-daqjudws": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="calendar-page-header" data-astro-cid-daqjudws> <div class="breadcrumb" data-astro-cid-daqjudws> <a href="/dashboard" data-astro-cid-daqjudws>Dashboard</a> <span class="separator" data-astro-cid-daqjudws>/</span> <span class="current" data-astro-cid-daqjudws>Agenda da Semana</span> </div> <div class="title-section" data-astro-cid-daqjudws> <h1 class="page-title" data-astro-cid-daqjudws>Minha Agenda</h1> <p class="page-subtitle" data-astro-cid-daqjudws>Organize suas aulas e horários com seus alunos.</p> </div> </div> ${renderComponent($$result2, "AgencyCalendar", AgencyCalendar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/AgencyCalendar", "client:component-export": "default", "data-astro-cid-daqjudws": true })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/calendar.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/calendar.astro";
const $$url = "/dashboard/calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Calendar,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
