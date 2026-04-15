import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { X, Search, Loader2, BookOpen, FileText, Check } from 'lucide-react';

const MaterialLinkModal = ({ activityId, activityTitle, onClose }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data: allMaterials, error: matError } = await supabase.from("materials").select("id, name, type").eq("teacher_id", session.user.id).order("created_at", { ascending: false });
        if (matError) throw matError;
        setMaterials(allMaterials || []);
        const { data: links, error: linkError } = await supabase.from("activity_materials").select("material_id").eq("activity_id", activityId);
        if (linkError) throw linkError;
        const linkedIds = new Set(links?.map((l) => l.material_id) || []);
        setSelectedIds(linkedIds);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [activityId]);
  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from("activity_materials").delete().eq("activity_id", activityId);
      if (selectedIds.size > 0) {
        const toInsert = Array.from(selectedIds).map((matId) => ({
          activity_id: activityId,
          material_id: matId
        }));
        const { error } = await supabase.from("activity_materials").insert(toInsert);
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      console.error("Error saving links:", err);
      alert("Erro ao salvar vínculos.");
    } finally {
      setSaving(false);
    }
  };
  const filteredMaterials = materials.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsx("div", { className: "mlm-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "mlm-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("header", { className: "mlm-header", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mlm-pretitle", children: "Materiais de Apoio" }),
        /* @__PURE__ */ jsx("h3", { className: "mlm-title", children: activityTitle })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "mlm-close", onClick: onClose, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mlm-search-container", children: [
      /* @__PURE__ */ jsx(Search, { className: "mlm-search-icon", size: 18 }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar material...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "mlm-search-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mlm-content", children: loading ? /* @__PURE__ */ jsxs("div", { className: "mlm-loading", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "mlm-spinner", size: 32 }),
      /* @__PURE__ */ jsx("p", { children: "Carregando seus materiais..." })
    ] }) : filteredMaterials.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mlm-empty", children: [
      /* @__PURE__ */ jsx(BookOpen, { size: 48, className: "mlm-empty-icon" }),
      /* @__PURE__ */ jsx("p", { children: search ? "Nenhum material encontrado para esta busca." : "Você ainda não subiu nenhum material." }),
      !search && /* @__PURE__ */ jsx("p", { className: "mlm-empty-sub", children: 'Vá em "Materiais" no menu lateral para subir seus arquivos primeiro.' })
    ] }) : /* @__PURE__ */ jsx("div", { className: "mlm-list", children: filteredMaterials.map((m) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `mlm-item ${selectedIds.has(m.id) ? "selected" : ""}`,
        onClick: () => handleToggle(m.id),
        children: [
          /* @__PURE__ */ jsx("div", { className: "mlm-item-icon", children: /* @__PURE__ */ jsx(FileText, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "mlm-item-info", children: [
            /* @__PURE__ */ jsx("span", { className: "mlm-item-name", children: m.name }),
            /* @__PURE__ */ jsx("span", { className: "mlm-item-type", children: m.type.toUpperCase() })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `mlm-checkbox ${selectedIds.has(m.id) ? "checked" : ""}`, children: selectedIds.has(m.id) && /* @__PURE__ */ jsx(Check, { size: 14 }) })
        ]
      },
      m.id
    )) }) }),
    /* @__PURE__ */ jsxs("footer", { className: "mlm-footer", children: [
      /* @__PURE__ */ jsx("button", { className: "mlm-btn-cancel", onClick: onClose, children: "Cancelar" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "mlm-btn-save",
          onClick: handleSave,
          disabled: saving,
          children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "mlm-spinner sm", size: 16 }) : null,
            saving ? "Salvando..." : `Vincular (${selectedIds.size})`
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                    .mlm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; animation: mlm-fadein 0.2s ease; }
                    @keyframes mlm-fadein { from { opacity: 0; } to { opacity: 1; } }
                    .mlm-modal { background: white; border-radius: 1.75rem; width: 100%; max-width: 500px; box-shadow: 0 25px 60px rgba(15,23,42,0.25); overflow: hidden; animation: mlm-slidein 0.25s ease; display: flex; flex-direction: column; max-height: 90vh; }
                    @keyframes mlm-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    
                    .mlm-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem 1.75rem 1rem; border-bottom: 1px solid #f1f5f9; }
                    .mlm-pretitle { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-brand); margin-bottom: 0.25rem; }
                    .mlm-title { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.1; }
                    .mlm-close { background: var(--color-ice); border: none; border-radius: 0.75rem; width: 36px; height: 36px; cursor: pointer; color: var(--color-slate-mid); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                    .mlm-close:hover { background: #e2e8f0; color: var(--color-slate-dark); }
                    
                    .mlm-search-container { padding: 1rem 1.75rem; position: relative; }
                    .mlm-search-icon { position: absolute; left: 2.5rem; top: 50%; transform: translateY(-50%); color: var(--color-slate-mid); }
                    .mlm-search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; font-family: var(--font-inter); font-size: 0.9rem; outline: none; transition: 0.2s; }
                    .mlm-search-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }
                    
                    .mlm-content { flex: 1; overflow-y: auto; padding: 0 1.75rem 1.5rem; min-height: 200px; }
                    .mlm-loading, .mlm-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 3rem 1rem; text-align: center; }
                    .mlm-spinner { animation: mlm-spin 1s linear infinite; color: var(--color-brand); }
                    .mlm-spinner.sm { margin-right: 8px; }
                    @keyframes mlm-spin { to { transform: rotate(360deg); } }
                    
                    .mlm-empty-icon { color: var(--color-slate-border); }
                    .mlm-empty p { font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                    .mlm-empty-sub { font-size: 0.85rem; color: var(--color-slate-mid); font-weight: 400 !important; }
                    
                    .mlm-list { display: flex; flex-direction: column; gap: 0.5rem; }
                    .mlm-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); cursor: pointer; transition: 0.15s; }
                    .mlm-item:hover { border-color: var(--color-brand); background: rgba(88,49,126,0.02); }
                    .mlm-item.selected { border-color: var(--color-brand); background: rgba(88,49,126,0.05); }
                    
                    .mlm-item-icon { width: 36px; height: 36px; background: var(--color-ice); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--color-brand); }
                    .mlm-item-info { flex: 1; display: flex; flex-direction: column; }
                    .mlm-item-name { font-weight: 700; color: var(--color-slate-dark); font-size: 0.9rem; }
                    .mlm-item-type { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); }
                    
                    .mlm-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--color-slate-border); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                    .mlm-checkbox.checked { background: var(--color-brand); border-color: var(--color-brand); color: white; }
                    
                    .mlm-footer { padding: 1.5rem 1.75rem; border-top: 1px solid #f1f5f9; display: flex; gap: 1rem; }
                    .mlm-btn-cancel { flex: 1; padding: 0.875rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                    .mlm-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
                    .mlm-btn-save { flex: 1.5; padding: 0.875rem; border-radius: 1rem; border: none; background: var(--color-brand); font-family: var(--font-outfit); font-weight: 800; color: white; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                    .mlm-btn-save:hover { filter: brightness(1.1); transform: scale(1.02); }
                    .mlm-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
                ` })
  ] }) });
};

const TYPE_LABELS = {
  flashcards: { icon: "🃏", label: "Destrave Cards", color: "#f97316" },
  escuta: { icon: "🎧", label: "Destrave a Escuta", color: "#8b5cf6" },
  mrp: { icon: "🎭", label: "Destrave MRP", color: "#0ea5e9" }
};
function ActivitiesPanel() {
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState(/* @__PURE__ */ new Set());
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [sharingActivity, setSharingActivity] = useState(null);
  const [shareTab, setShareTab] = useState("platform");
  const [experimentalLink, setExperimentalLink] = useState(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkingActivity, setLinkingActivity] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("[ActivitiesPanel] No session found.");
        setLoading(false);
        return;
      }
      const token = session.access_token;
      try {
        const actRes = await fetch("/api/activities/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const actData = await actRes.json();
        if (!actRes.ok) {
          setError(actData.error || "Erro ao carregar atividades do servidor.");
        } else {
          setActivities(actData.activities ?? []);
        }
      } catch (aErr) {
        setError("Falha de conexão com a biblioteca de missões.");
      }
      try {
        const { data: stuData, error: stuErr } = await supabase.from("students").select("id, name").eq("teacher_id", session.user.id).order("name");
        if (!stuErr) {
          setStudents(stuData ?? []);
        }
      } catch (sErr) {
      }
    } catch (err) {
      setError("Um erro fatal impediu o carregamento da central.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const closeModal = () => {
    setSharingActivity(null);
    setSelectedStudents(/* @__PURE__ */ new Set());
    setExperimentalLink(null);
    setShareTab("platform");
  };
  const generateExperimentalLink = async () => {
    if (!sharingActivity) return;
    setGeneratingLink(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch("/api/activities/share-experimental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ activityId: sharingActivity.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setExperimentalLink(`${window.location.origin}/share/${data.uuid}`);
    } catch (err) {
      showToast(err.message || "Erro ao gerar link experimental", "error");
    } finally {
      setGeneratingLink(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Link copiado!");
  };
  const toggleStudent = (id) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const handleAssign = async () => {
    if (!sharingActivity || selectedStudents.size === 0) return;
    setAssigning(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showToast("Sessão expirada. Faça login novamente.", "error");
      setAssigning(false);
      return;
    }
    try {
      const res = await fetch("/api/activities/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          activityId: sharingActivity.id,
          studentIds: Array.from(selectedStudents)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Erro ao atribuir atividade.", "error");
      } else if (data.assigned > 0) {
        showToast(`✅ Enviado para ${data.assigned} aluno(s)!`);
        closeModal();
      } else {
        showToast(data.message || "Estes alunos já receberam esta missão.", "error");
        closeModal();
      }
    } catch (err) {
      showToast("Erro de conexão ao atribuir.", "error");
    } finally {
      setAssigning(false);
    }
  };
  const handleDelete = async (id, title) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"? Esta ação é permanente.`)) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const res = await fetch(`/api/activities/delete?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        showToast("Atividade excluída com sucesso.");
      } else {
        showToast("Erro ao excluir atividade.", "error");
      }
    } catch (err) {
      showToast("Erro de rede ao excluir.", "error");
    }
  };
  const handleDuplicate = async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const res = await fetch("/api/activities/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setActivities((prev) => [data.activity, ...prev]);
        showToast("Atividade duplicada!");
      } else {
        showToast("Erro ao duplicar atividade.", "error");
      }
    } catch (err) {
      showToast("Erro de rede ao duplicar.", "error");
    }
  };
  const handleRename = async (id, currentTitle) => {
    const newTitle = prompt("Novo título para a atividade:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const res = await fetch("/api/activities/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id, title: newTitle })
      });
      if (res.ok) {
        const data = await res.json();
        setActivities((prev) => prev.map((a) => a.id === id ? data.activity : a));
        showToast("Título atualizado.");
      } else {
        showToast("Erro ao renomear.", "error");
      }
    } catch (err) {
      showToast("Erro de rede.", "error");
    }
  };
  const getSubtitle = (a) => {
    const cfg = a.config;
    if (!cfg) return "0 itens";
    let baseSub = "";
    if (a.type === "flashcards") {
      const count = cfg.cards?.length || cfg.cardCount || 0;
      baseSub = `${count} card${count !== 1 ? "s" : ""} • Nível ${cfg.level ?? "—"}`;
    } else if (a.type === "escuta") {
      const count = cfg.questions?.length || 0;
      baseSub = `${count} questão${count !== 1 ? "ões" : "ão"}`;
    } else if (a.type === "mrp") {
      const count = cfg.questions?.length || 0;
      baseSub = `${count} questão${count !== 1 ? "ões" : "ão"} • Nível ${cfg.level ?? "—"}`;
    }
    const matCount = a.material_count?.[0]?.count || 0;
    const matSuffix = matCount > 0 ? ` • 📎 ${matCount}` : "";
    return `${baseSub}${matSuffix}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "ap-loading", children: [
      /* @__PURE__ */ jsx("div", { className: "ap-spinner" }),
      /* @__PURE__ */ jsx("p", { children: "Carregando atividades..." })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "ap-header", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "ap-title", children: "Central de Atividades" }),
        /* @__PURE__ */ jsx("p", { className: "ap-subtitle", children: "Todas as missões que você gerou. Atribua aos alunos conforme necessário." })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "ap-count-badge", children: [
        activities.length,
        " atividade",
        activities.length !== 1 ? "s" : ""
      ] })
    ] }),
    error ? /* @__PURE__ */ jsxs("div", { className: "ap-error-state", children: [
      /* @__PURE__ */ jsx("span", { children: "⚠️" }),
      /* @__PURE__ */ jsx("p", { children: error }),
      /* @__PURE__ */ jsx("button", { onClick: fetchData, className: "ap-btn-retry", children: "Tentar novamente" })
    ] }) : activities.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "ap-empty", children: [
      /* @__PURE__ */ jsx("span", { children: "📭" }),
      /* @__PURE__ */ jsx("p", { children: "Nenhuma atividade salva ainda." }),
      /* @__PURE__ */ jsx("p", { className: "ap-empty-sub", children: 'Gere um deck de flashcards, uma missão de escuta ou um MRP e clique em "Salvar".' })
    ] }) : /* @__PURE__ */ jsx("div", { className: "ap-grid", children: activities.map((a) => {
      const meta = TYPE_LABELS[a.type] ?? { icon: "📄", label: a.type, color: "#64748b" };
      return /* @__PURE__ */ jsxs("div", { className: "ap-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "ap-card-top", children: [
          /* @__PURE__ */ jsxs("span", { className: "ap-type-pill", style: { background: `${meta.color}18`, color: meta.color }, children: [
            meta.icon,
            " ",
            meta.label
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ap-menu-container", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `ap-action-btn dots ${activeMenuId === a.id ? "active" : ""}`,
                onClick: (e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === a.id ? null : a.id);
                },
                children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1" }),
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "5", r: "1" }),
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "19", r: "1" })
                ] })
              }
            ),
            activeMenuId === a.id && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "ap-menu-backdrop", onClick: () => setActiveMenuId(null) }),
              /* @__PURE__ */ jsxs("div", { className: "ap-dropdown-menu", children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => window.location.href = `/dashboard/missions/${a.type}?edit=${a.id}`, children: [
                  /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                    /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                    /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                  ] }),
                  "Editar Conteúdo"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => {
                  handleDuplicate(a.id);
                  setActiveMenuId(null);
                }, children: [
                  /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                    /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                    /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                  ] }),
                  "Duplicar"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => {
                  setLinkingActivity(a);
                  setActiveMenuId(null);
                }, children: [
                  /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" }) }),
                  "Vincular Materiais"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => {
                  handleRename(a.id, a.title);
                  setActiveMenuId(null);
                }, children: [
                  /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                    /* @__PURE__ */ jsx("path", { d: "M12 20h9" }),
                    /* @__PURE__ */ jsx("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })
                  ] }),
                  "Renomear"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "ap-menu-divider" }),
                /* @__PURE__ */ jsxs("button", { className: "delete", onClick: () => {
                  handleDelete(a.id, a.title);
                  setActiveMenuId(null);
                }, children: [
                  /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                    /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
                    /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
                  ] }),
                  "Excluir Definitivamente"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "ap-card-title", children: a.title || "Sem título" }),
        /* @__PURE__ */ jsx("p", { className: "ap-card-sub", children: getSubtitle(a) }),
        /* @__PURE__ */ jsxs("div", { className: "ap-card-footer", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "ap-btn-preview",
              title: "Rodar no próprio navegador",
              onClick: () => window.location.href = `/play/${a.type}/${a.id}?test=true`,
              children: [
                /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "M5 3l14 9-14 9V3z" }) }),
                "Testar agora"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "ap-btn-share-main",
              onClick: () => setSharingActivity(a),
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }),
                  /* @__PURE__ */ jsx("polyline", { points: "16 6 12 2 8 6" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "2", x2: "12", y2: "15" })
                ] }),
                "Compartilhar"
              ]
            }
          )
        ] })
      ] }, a.id);
    }) }),
    sharingActivity && /* @__PURE__ */ jsx("div", { className: "ap-modal-overlay", onClick: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "ap-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("header", { className: "ap-modal-header", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "ap-modal-pretitle", children: "Compartilhar Missão" }),
          /* @__PURE__ */ jsx("h3", { className: "ap-modal-title", children: sharingActivity?.title })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "ap-modal-close", onClick: closeModal, children: "✕" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ap-tabs", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `ap-tab-btn ${shareTab === "platform" ? "active" : ""}`,
            onClick: () => setShareTab("platform"),
            children: "Na plataforma"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `ap-tab-btn ${shareTab === "public" ? "active" : ""}`,
            onClick: () => setShareTab("public"),
            children: "Link Público"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `ap-tab-btn ${shareTab === "experimental" ? "active" : ""}`,
            onClick: () => setShareTab("experimental"),
            children: "Link Experimental"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ap-tab-content", children: [
        shareTab === "platform" && /* @__PURE__ */ jsxs("div", { className: "animation-fade-in", children: [
          /* @__PURE__ */ jsx("p", { className: "ap-modal-instruction", children: "Selecione os alunos que receberão esta atividade no portal:" }),
          students.length === 0 ? /* @__PURE__ */ jsx("p", { className: "ap-no-students", children: "Nenhum aluno cadastrado ainda." }) : /* @__PURE__ */ jsx("ul", { className: "ap-student-list", children: students.map((s) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `ap-student-item ${selectedStudents.has(s.id) ? "selected" : ""}`,
              onClick: () => toggleStudent(s.id),
              children: [
                /* @__PURE__ */ jsx("div", { className: "ap-student-avatar", children: (s.name || "U").charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsx("span", { className: "ap-student-name", children: s.name || "Usuário" }),
                /* @__PURE__ */ jsx("div", { className: `ap-checkbox ${selectedStudents.has(s.id) ? "checked" : ""}`, children: selectedStudents.has(s.id) && /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) })
              ]
            },
            s.id
          )) }),
          /* @__PURE__ */ jsxs("footer", { className: "ap-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { className: "ap-btn-cancel", onClick: closeModal, children: "Cancelar" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "ap-btn-confirm",
                disabled: selectedStudents.size === 0 || assigning,
                onClick: handleAssign,
                children: [
                  assigning ? /* @__PURE__ */ jsx("span", { className: "ap-spinner sm" }) : null,
                  assigning ? "Atribuindo..." : `Atribuir (${selectedStudents.size})`
                ]
              }
            )
          ] })
        ] }),
        shareTab === "experimental" && /* @__PURE__ */ jsxs("div", { className: "animation-fade-in", children: [
          /* @__PURE__ */ jsx("p", { className: "ap-modal-instruction", children: "Gere um link público para um aluno experimental. O link será de uso único." }),
          !experimentalLink ? /* @__PURE__ */ jsxs(
            "button",
            {
              className: "ap-btn-confirm w-full mb-4",
              onClick: generateExperimentalLink,
              disabled: generatingLink,
              children: [
                generatingLink ? /* @__PURE__ */ jsx("span", { className: "ap-spinner sm mr-2" }) : "🔗 ",
                generatingLink ? "Gerando..." : "Gerar Link de Uso Único"
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "ap-link-box", children: [
            /* @__PURE__ */ jsx("input", { className: "ap-link-input", readOnly: true, value: experimentalLink }),
            /* @__PURE__ */ jsx("button", { className: "ap-link-copy", onClick: () => copyToClipboard(experimentalLink), children: "Copiar" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "ap-link-hint", children: "⚠️ Atenção: Assim que o aluno concluir o exercício, o link expirará automaticamente." })
        ] }),
        shareTab === "public" && sharingActivity && /* @__PURE__ */ jsxs("div", { className: "animation-fade-in", children: [
          /* @__PURE__ */ jsx("p", { className: "ap-modal-instruction", children: "Link para a sua Landing Page pública. Qualquer aluno pode se cadastrar para fazer a missão, sendo capturado como Lead e redirecionado para o seu WhatsApp posteriormente." }),
          /* @__PURE__ */ jsxs("div", { className: "ap-link-box", children: [
            /* @__PURE__ */ jsx("input", { className: "ap-link-input", readOnly: true, value: `${window.location.origin}/convite/${sharingActivity.id}` }),
            /* @__PURE__ */ jsx("button", { className: "ap-link-copy", onClick: () => copyToClipboard(`${window.location.origin}/convite/${sharingActivity.id}`), children: "Copiar" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "ap-link-hint", children: "🚀 Ótimo para usar no seu Instagram, YouTube ou disparos de e-mail!" })
        ] })
      ] })
    ] }) }),
    linkingActivity && /* @__PURE__ */ jsx(
      MaterialLinkModal,
      {
        activityId: linkingActivity.id,
        activityTitle: linkingActivity.title,
        onClose: () => setLinkingActivity(null)
      }
    ),
    toast && /* @__PURE__ */ jsx("div", { className: `ap-toast ${toast.type}`, children: toast.msg }),
    /* @__PURE__ */ jsx("style", { children: `
                .ap-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem; color: var(--color-slate-mid); }
                .ap-spinner { width: 38px; height: 38px; border: 3px solid var(--color-slate-border); border-top-color: var(--color-brand); border-radius: 50%; animation: ap-spin 0.7s linear infinite; }
                .ap-spinner.sm { width: 16px; height: 16px; border-width: 2px; }
                @keyframes ap-spin { to { transform: rotate(360deg); } }

                .ap-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
                .ap-title { font-family: var(--font-outfit); font-size: 1.875rem; font-weight: 800; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .ap-subtitle { font-size: 1rem; color: var(--color-slate-mid); margin: 0; }
                .ap-count-badge { padding: 0.4rem 1rem; background: var(--color-ice); color: var(--color-brand); border-radius: 999px; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; white-space: nowrap; align-self: center; }

                .ap-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
                .ap-empty span { font-size: 3.5rem; }
                .ap-empty p { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                .ap-empty-sub { font-size: 0.9rem; color: var(--color-slate-mid); max-width: 380px; line-height: 1.6; }

                .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

                .ap-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 200ms, box-shadow 200ms; position: relative; }
                .ap-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,41,59,0.08); border-color: #cbd5e1; }

                .ap-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .ap-type-pill { padding: 0.35rem 0.8rem; border-radius: 999px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.02em; }
                
                .ap-menu-container { position: relative; }
                .ap-action-btn.dots { width: 32px; height: 32px; border-radius: 10px; background: var(--color-ice); border: none; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .ap-action-btn.dots:hover, .ap-action-btn.dots.active { background: var(--color-brand); color: white; }
                
                .ap-menu-backdrop { position: fixed; inset: 0; z-index: 50; }
                .ap-dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; width: 220px; background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 60; padding: 0.5rem; overflow: hidden; animation: menuShow 0.2s ease-out; }
                @keyframes menuShow { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                
                .ap-dropdown-menu button { width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: none; background: none; border-radius: 0.6rem; font-family: var(--font-outfit); font-weight: 600; font-size: 0.875rem; color: var(--color-slate-dark); cursor: pointer; text-align: left; transition: 0.15s; }
                .ap-dropdown-menu button:hover { background: var(--color-ice); color: var(--color-brand); }
                .ap-dropdown-menu button.delete { color: #dc2626; }
                .ap-dropdown-menu button.delete:hover { background: #fee2e2; }
                .ap-menu-divider { height: 1.5px; background: var(--color-slate-border); margin: 0.4rem; }

                .ap-card-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.2; }
                .ap-card-sub { font-size: 0.85rem; color: var(--color-slate-mid); margin-bottom: 1rem; }

                .ap-card-footer { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                .ap-btn-preview { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--color-ice); border: 1.5px solid var(--color-slate-border); border-radius: 0.875rem; color: var(--color-slate-dark); font-family: var(--font-outfit); font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-preview:hover { background: white; border-color: var(--color-brand); color: var(--color-brand); }
                .ap-btn-share-main { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--color-brand); border: none; border-radius: 0.875rem; color: white; font-family: var(--font-outfit); font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-share-main:hover { filter: brightness(1.1); transform: scale(1.02); }

                /* MODAL */
                .ap-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: ap-fadein 0.2s ease; }
                @keyframes ap-fadein { from { opacity: 0; } to { opacity: 1; } }
                .ap-modal { background: white; border-radius: 1.75rem; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(15,23,42,0.25); overflow: hidden; animation: ap-slidein 0.25s ease; }
                @keyframes ap-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .ap-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem 1.75rem 1rem; }
                .ap-modal-pretitle { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-brand); margin-bottom: 0.25rem; }
                .ap-modal-title { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.1; }
                .ap-modal-close { background: var(--color-ice); border: none; border-radius: 0.75rem; width: 36px; height: 36px; cursor: pointer; font-size: 0.9rem; color: var(--color-slate-mid); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .ap-modal-close:hover { background: #e2e8f0; color: var(--color-slate-dark); }

                .ap-tabs { display: flex; margin: 0 1.75rem; padding: 0.4rem; background: var(--color-ice); border-radius: 1rem; gap: 0.4rem; }
                .ap-tab-btn { flex: 1; padding: 0.6rem; border: none; background: transparent; border-radius: 0.75rem; font-family: var(--font-outfit); font-weight: 700; font-size: 0.85rem; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                .ap-tab-btn.active { background: white; color: var(--color-brand); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                .ap-tab-content { padding: 1.5rem 1.75rem; }
                .ap-modal-instruction { font-size: 0.95rem; color: var(--color-slate-mid); margin-bottom: 1rem; line-height: 1.5; }

                .ap-student-list { list-style: none; margin: 0; padding: 0; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.5rem; }
                .ap-student-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); cursor: pointer; transition: 0.15s; }
                .ap-student-item:hover { border-color: var(--color-brand); background: rgba(88,49,126,0.02); }
                .ap-student-item.selected { border-color: var(--color-brand); background: rgba(88,49,126,0.05); }
                .ap-student-avatar { width: 38px; height: 38px; border-radius: 12px; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; display: flex; align-items: center; justify-content: center; }
                .ap-student-name { font-weight: 700; color: var(--color-slate-dark); font-size: 0.95rem; flex: 1; }
                .ap-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--color-slate-border); display: flex; align-items: center; justify-content: center; }
                .ap-checkbox.checked { background: var(--color-brand); border-color: var(--color-brand); }

                .ap-link-box { background: white; border: 2px solid var(--color-slate-border); border-radius: 1rem; padding: 0.5rem; display: flex; gap: 0.5rem; margin: 1.5rem 0; }
                .ap-link-input { border: none; background: transparent; padding: 0.5rem; flex: 1; font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-dark); outline: none; min-width: 0; }
                .ap-link-copy { padding: 0.6rem 1.25rem; background: var(--color-action); color: white; border: none; border-radius: 0.6rem; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
                .ap-link-copy:hover { filter: brightness(1.1); transform: scale(1.05); }
                .ap-link-hint { font-size: 0.8rem; color: var(--color-slate-mid); font-style: italic; line-height: 1.4; }

                .ap-modal-footer { display: flex; gap: 1rem; padding-top: 1.5rem; border-top: 1.5px solid var(--color-slate-border); margin-top: 1rem; }
                .ap-btn-cancel { flex: 1; padding: 0.875rem; background: var(--color-ice); color: var(--color-slate-mid); border: none; border-radius: 1rem; font-family: var(--font-outfit); font-weight: 700; cursor: pointer; }
                .ap-btn-confirm { flex: 1.5; padding: 0.875rem; background: var(--color-brand); color: white; border: none; border-radius: 1rem; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .ap-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

                .ap-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); padding: 1rem 2rem; border-radius: 999px; background: #0f172a; color: white; font-family: var(--font-outfit); font-weight: 800; font-size: 0.9rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; animation: toastUp 0.3s ease-out; }
                @keyframes toastUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

                .ap-error-state { padding: 4rem 2rem; text-align: center; background: #fff1f2; border: 1.5px dashed #fecaca; border-radius: 2rem; }
                .ap-btn-retry { margin-top: 1.5rem; padding: 0.75rem 2rem; background: #e11d48; color: white; border: none; border-radius: 1rem; font-weight: 800; cursor: pointer; }

                @media (max-width: 640px) {
                    .ap-grid { grid-template-columns: 1fr; }
                    .ap-modal { border-radius: 1.75rem 1.75rem 0 0; align-self: flex-end; }
                    .ap-modal-overlay { align-items: flex-end; }
                }
            ` })
  ] });
}

const $$Activities = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Central de Atividades — Destrave Hub", "activeNav": "activities", "data-astro-cid-6almswbo": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-6almswbo> <div class="breadcrumb" data-astro-cid-6almswbo> <a href="/dashboard" data-astro-cid-6almswbo>Dashboard</a> <span class="separator" data-astro-cid-6almswbo>/</span> <span class="current" data-astro-cid-6almswbo>Central de Atividades</span> </div> </div> ${renderComponent($$result2, "ActivitiesPanel", ActivitiesPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/activities/ActivitiesPanel.tsx", "client:component-export": "default", "data-astro-cid-6almswbo": true })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/activities.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/activities.astro";
const $$url = "/dashboard/activities";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Activities,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
