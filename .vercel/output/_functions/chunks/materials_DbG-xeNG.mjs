import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { toast, Toaster } from 'react-hot-toast';

const MaterialsManager = () => {
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState("");
  const [materials, setMaterials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      const userIsTeacher = profile?.role === "teacher";
      const userId = session.user.id;
      let actualTeacherId = userId;
      if (!userIsTeacher) {
        const { data: studentProfile } = await supabase.from("students").select("teacher_id").eq("student_id", userId).single();
        if (studentProfile) actualTeacherId = studentProfile.teacher_id;
      }
      setIsTeacher(userIsTeacher);
      setUser(session.user);
      setCurrentTeacherId(actualTeacherId);
      fetchMaterials(userId, userIsTeacher, actualTeacherId);
      if (userIsTeacher) {
        fetchStudents(actualTeacherId);
      }
    };
    init();
  }, []);
  const fetchMaterials = async (userId, userIsTeacher, actualTeacherId) => {
    try {
      setLoading(true);
      let folderQuery = supabase.from("materials_folders").select("*").eq("teacher_id", actualTeacherId).order("name");
      const { data: folderData, error: folderError } = await folderQuery;
      if (folderError) throw folderError;
      setFolders(folderData || []);
      let query = supabase.from("materials").select("*, activities(title)").order("created_at", { ascending: false });
      if (userIsTeacher) {
        query = query.eq("teacher_id", userId);
      } else {
        const { data: studentInfo } = await supabase.from("students").select("id").eq("student_id", userId).single();
        if (studentInfo) {
          query = query.or(`student_id.eq.${studentInfo.id},student_id.is.null`).eq("teacher_id", actualTeacherId);
        }
      }
      const { data, error } = await query;
      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
      toast.error("Não foi possível carregar os materiais.");
    } finally {
      setLoading(false);
    }
  };
  const fetchStudents = async (tId) => {
    try {
      const { data, error } = await supabase.from("students").select("id, name").eq("teacher_id", tId);
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 10MB.");
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("materials").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { error: dbError } = await supabase.from("materials").insert({
        name: file.name,
        file_path: filePath,
        teacher_id: user.id,
        student_id: selectedStudent === "all" ? null : selectedStudent,
        folder_id: currentFolderId,
        type: fileExt?.toLowerCase() === "pdf" ? "pdf" : "image"
      });
      if (dbError) throw dbError;
      toast.success("Material enviado com sucesso!");
      fetchMaterials(user.id, isTeacher, currentTeacherId);
    } catch (err) {
      console.error("Erro no upload:", err);
      toast.error("Falha ao enviar arquivo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Tem certeza que deseja excluir esta pasta? Arquivos dentro dela ficarão sem pasta.")) return;
    try {
      const { error } = await supabase.from("materials_folders").delete().eq("id", folderId);
      if (error) throw error;
      toast.success("Pasta excluída.");
      setFolders(folders.filter((f) => f.id !== folderId));
      if (currentFolderId === folderId) setCurrentFolderId(null);
    } catch (err) {
      console.error("Erro ao deletar pasta:", err);
      toast.error("Houve um erro ao excluir a pasta.");
    }
  };
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const { data, error } = await supabase.from("materials_folders").insert({
        name: newFolderName,
        teacher_id: user.id,
        parent_id: currentFolderId
      }).select().single();
      if (error) throw error;
      setFolders([data, ...folders]);
      setNewFolderName("");
      setIsCreatingFolder(false);
      toast.success("Pasta criada!");
    } catch (err) {
      console.error("Erro ao criar pasta:", err);
      toast.error("Houve um erro ao criar a pasta.");
    }
  };
  const handleMoveToFolder = async (materialId, folderId) => {
    try {
      const { error } = await supabase.from("materials").update({ folder_id: folderId }).eq("id", materialId);
      if (error) throw error;
      setMaterials(materials.map(
        (m) => m.id === materialId ? { ...m, folder_id: folderId } : m
      ));
      toast.success("Material movido!");
    } catch (err) {
      console.error("Erro ao mover material:", err);
      toast.error("Não foi possível mover o material.");
    }
  };
  const getBreadcrumbs = () => {
    const crumbs = [{ id: null, name: "Início" }];
    if (!currentFolderId) return crumbs;
    const path = [];
    let curr = folders.find((f) => f.id === currentFolderId);
    while (curr) {
      path.unshift({ id: curr.id, name: curr.name });
      const parentId = curr.parent_id;
      curr = folders.find((f) => f.id === parentId);
    }
    return [...crumbs, ...path];
  };
  const handleDelete = async (material) => {
    if (!confirm("Tem certeza que deseja excluir este material?")) return;
    try {
      const { error: storageError } = await supabase.storage.from("materials").remove([material.file_path]);
      if (storageError) throw storageError;
      const { error: dbError } = await supabase.from("materials").delete().eq("id", material.id);
      if (dbError) throw dbError;
      toast.success("Material excluído.");
      setMaterials(materials.filter((m) => m.id !== material.id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      toast.error("Erro ao excluir material.");
    }
  };
  const onDragStart = (e, materialId) => {
    e.dataTransfer.setData("materialId", materialId);
  };
  const onDrop = (e, targetFolderId) => {
    e.preventDefault();
    const materialId = e.dataTransfer.getData("materialId");
    if (materialId) {
      handleMoveToFolder(materialId, targetFolderId);
    }
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const filteredFolders = folders.filter((f) => f.parent_id === currentFolderId);
  const filteredMaterials = materials.filter((m) => m.folder_id === currentFolderId);
  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from("materials").getPublicUrl(path);
    return data.publicUrl;
  };
  return /* @__PURE__ */ jsxs("div", { className: "materials-container", children: [
    /* @__PURE__ */ jsxs("header", { className: "materials-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "materials-title", children: isTeacher ? "Gerenciador de Materiais" : "Meus Materiais de Apoio" }),
      isTeacher && /* @__PURE__ */ jsxs("div", { className: "materials-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "folder-btn",
            onClick: () => setIsCreatingFolder(true),
            children: "📁 Nova Pasta"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedStudent,
            onChange: (e) => setSelectedStudent(e.target.value),
            className: "student-select",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "Para todos os alunos" }),
              students.map((s) => /* @__PURE__ */ jsxs("option", { value: s.id, children: [
                "Exclusivo: ",
                s.name
              ] }, s.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "upload-btn",
            onClick: () => fileInputRef.current?.click(),
            disabled: uploading,
            children: uploading ? "Enviando..." : "Subir Arquivo"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            onChange: handleUpload,
            style: { display: "none" },
            accept: ".pdf,image/*"
          }
        )
      ] })
    ] }),
    isCreatingFolder && /* @__PURE__ */ jsxs("div", { className: "folder-creation-modal", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Nome da pasta...",
          value: newFolderName,
          onChange: (e) => setNewFolderName(e.target.value),
          className: "folder-input",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsx("button", { onClick: handleCreateFolder, children: "Criar" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setIsCreatingFolder(false), children: "Cancelar" })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "materials-breadcrumb", children: getBreadcrumbs().map((crumb, idx) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `breadcrumb-item ${crumb.id === currentFolderId ? "active" : ""}`,
          onClick: () => setCurrentFolderId(crumb.id),
          onDrop: (e) => onDrop(e, crumb.id),
          onDragOver,
          children: crumb.name
        }
      ),
      idx < getBreadcrumbs().length - 1 && /* @__PURE__ */ jsx("span", { className: "breadcrumb-separator", children: "/" })
    ] }, crumb.id || "root")) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "loading-state", children: "Carregando materiais..." }) : filteredFolders.length === 0 && filteredMaterials.length === 0 ? /* @__PURE__ */ jsx("div", { className: "empty-state", children: "Esta pasta está vazia." }) : /* @__PURE__ */ jsxs("div", { className: "materials-grid", children: [
      filteredFolders.map((folder) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "folder-card",
          onClick: () => setCurrentFolderId(folder.id),
          onDrop: (e) => onDrop(e, folder.id),
          onDragOver,
          children: [
            /* @__PURE__ */ jsx("div", { className: "folder-icon", children: "📁" }),
            /* @__PURE__ */ jsx("div", { className: "folder-info", children: /* @__PURE__ */ jsx("h3", { children: folder.name }) }),
            isTeacher && /* @__PURE__ */ jsx(
              "button",
              {
                className: "delete-folder-btn",
                onClick: (e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.id);
                },
                children: "×"
              }
            )
          ]
        },
        folder.id
      )),
      filteredMaterials.map((material) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "material-card",
          draggable: isTeacher,
          onDragStart: (e) => onDragStart(e, material.id),
          children: [
            /* @__PURE__ */ jsx("div", { className: "material-icon", children: material.type === "pdf" ? "📄" : "🖼️" }),
            /* @__PURE__ */ jsxs("div", { className: "material-info", children: [
              /* @__PURE__ */ jsx("h3", { children: material.name }),
              /* @__PURE__ */ jsxs("div", { className: "material-meta", children: [
                material.activities?.title && /* @__PURE__ */ jsxs("span", { className: "mission-badge", children: [
                  "📎 ",
                  material.activities.title
                ] }),
                material.student_id && /* @__PURE__ */ jsx("span", { className: "student-badge", children: "👤 Privado" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "material-actions-row", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: getPublicUrl(material.file_path),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "view-btn",
                  children: "Ver"
                }
              ),
              isTeacher && /* @__PURE__ */ jsx(
                "button",
                {
                  className: "delete-btn",
                  onClick: () => handleDelete(material),
                  children: "Excluir"
                }
              )
            ] })
          ]
        },
        material.id
      ))
    ] })
  ] });
};

const $$Materials = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Materiais — Destrave Hub", "activeNav": "materials" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4"> ${renderComponent($$result2, "MaterialsManager", MaterialsManager, { "client:load": true, "teacherId": "", "isTeacher": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/materials/MaterialsManager", "client:component-export": "MaterialsManager" })} ${renderComponent($$result2, "Toaster", Toaster, { "client:load": true, "position": "bottom-right", "client:component-hydration": "load", "client:component-path": "react-hot-toast", "client:component-export": "Toaster" })} </div> ` })} ${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/materials.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/materials.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/materials.astro";
const $$url = "/dashboard/materials";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Materials,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
