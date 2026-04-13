# 📋 Plano de Implementação: LMS, Histórico e Notificações

Este plano detalha as próximas fases de desenvolvimento do Destrave Hub, priorizando a gestão de materiais pedagógicos, o histórico de aulas e o sistema de notificações.

---

## 🛠️ Fase 1: LMS - Biblioteca de Materiais (Prioridade #1)
**Objetivo:** Permitir que o professor faça upload de arquivos (PDF/PNG) e os disponibilize para os alunos.

### 1.1. Infraestrutura de Banco e Storage
- [ ] **Supabase Storage:** Criar bucket `materials` com políticas RLS (Professor: full access, Aluno: read only).
- [ ] **Tabela `materials`:**
  - `id`: UUID (PK)
  - `name`: Text
  - `file_path`: Text (caminho no storage)
  - `teacher_id`: UUID (FK profiles)
  - `student_id`: UUID (FK students, opcional para materiais exclusivos)
  - `type`: Text (pdf, image, link)
  - `created_at`: Timestamptz

### 1.2. Backend (API)
- [ ] `POST /api/materials/upload`: Endpoint para receber o arquivo e salvar no Storage + Banco.
- [ ] `GET /api/materials/list`: Listar materiais filtrados por professor ou aluno.
- [ ] `DELETE /api/materials/delete`: Remover arquivo e registro.

### 1.3. Frontend (UI/UX)
- [ ] **Dashboard Professor:** Aba "Materiais" para gerenciar arquivos.
- [ ] **Dashboard Aluno:** Seção de "Materiais de Apoio".
- [ ] **Gaveta Lateral (Side Panel):** Componente `MaterialsDrawer.tsx` integrado às telas de jogo (Escuta/MRP/Cards) para consulta rápida.

---

## 🎭 Fase 2: Histórico do Sensei & Evolução (Prioridade #2)
**Objetivo:** Registrar o progresso pedagógico e visualizar o crescimento do aluno.

### 2.1. Registro de Aulas
- [ ] **Tabela `lesson_logs`:**
  - `id`: UUID (PK)
  - `teacher_id`: UUID (FK profiles)
  - `student_id`: UUID (FK students)
  - `topics`: Text[] (Assuntos abordados)
  - `notes`: Text (Observações privadas/públicas)
  - `date`: Timestamptz

### 2.2. Dashboard de Evolução
- [ ] **Visualização de XP/Notas:** Gráfico de linha mostrando a evolução do aluno nas últimas missões.
- [ ] **Painel de Desempenho:** Resumo de pontos fortes e fracos automatizado via IA (opcional).

---

## 🔔 Fase 3: Notificações In-App (Urgência)
**Objetivo:** Manter alunos e professores informados sobre novas atividades e conclusões.

### 3.1. Infraestrutura
- [ ] **Tabela `notifications`:**
  - `id`: UUID (PK)
  - `user_id`: UUID (FK profiles)
  - `title`: Text
  - `message`: Text
  - `type`: Enum (assignment, completion, system)
  - `read`: Boolean (default false)
  - `link`: Text (opcional para redirecionamento)
  - `created_at`: Timestamptz

### 3.2. Implementação
- [ ] **Trigger no Backend:** Sempre que uma missão for atribuída (`assignment` criado), gerar notificação para o aluno.
- [ ] **Componente de Badge:** Ícone de sino no `DashboardLayout.astro`.
- [ ] **Central de Notificações:** Tela simples para listar e marcar como lidas.

---

## 📝 Notas de Implementação
- **Buddy Audio:** O usuário gerará os arquivos MP3 manualmente e os inserirá em `/public/assets/buddy-voices/`.
- **Tecnologias:** React 19, Astro, Supabase RLS, Framer Motion para animações de UI.

---

## ✅ Critérios de Aceite
1. Professor consegue subir um PDF e o aluno visualiza na gaveta lateral durante a missão.
2. O histórico de tópicos da aula é persistido e visível no perfil do aluno.
3. Aluno recebe um alerta visual (ou badge) ao receber uma nova missão.
