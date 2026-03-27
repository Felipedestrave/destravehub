# 📊 Log de Evolução — Destrave Hub

Este documento registra o progresso da implementação, decisões técnicas e o estado atual do projeto. **Sempre consulte e atualize este arquivo ao retomar ou finalizar uma sessão de trabalho.**

---

- [x] **Segurança e Acesso:** Logout de professor corrigido e `RoleGuard` implementado (Geradores restritos).
- [x] CRUD Completo na Central (Deletar, Duplicar, Renomear, Editar Conteúdo)
- [x] **Padronização de PDF IA:** MRP e Flashcards agora leem PDFs diretamente através do Gemini Sensei API.
- **Status:** Sistema de Gestão de Atividades (CRUD Pro), Gerador Multimodal e Controle de Acesso concluídos.
- **Última Atualização:** 27/03/2026 (18:00h)
- **GitHub:** `https://github.com/Felipedestrave/destravehub.git` (Branch `main`)

---

## ✅ O que já foi implementado

### 1. Reconstrução do Banco de Dados (Supabase)
... (mantido) ...

### 2. Módulo Destrave Draw 🎨
- [x] **Arquitetura Modular:** Componentes React 19 desacoplados.
- [x] **Integração Dashboard:** Adicionado link na lateral com ícone de pincel.
- [x] **Responsividade & Layout:** 
  - [x] Sidebar mobile (hambúrguer) + backdrop.
  - [x] Fix de conflito CSS (Mobile Nav vs Desktop Sidebar).
  - [x] Fontes dinâmicas (`clamp`) e toolbar adaptável.
  - [x] Canvas com ResizeObserver/Width dinâmico para respeitar a sidebar.
- [x] **Infraestrutura IA:** Dictionary e TTS operando via Gemini Flash Lite 2.0.
- [x] **Gestão de Alunos (LMS):**
    - [x] Página dedicada de cadastro (`/dashboard/students/new`).
    - [x] Criação de contas oficiais (Auth) via API Administrativa.
    - [x] Suporte a níveis genéricos de proficiência e múltiplos idiomas.
    - [x] Tela de sucesso com compartilhamento de credenciais.
- [x] **Agenda do Professor (Calendário):**
    - [x] Visualização mensal dinâmica.
    - [x] Agendamento de aulas vinculadas aos alunos cadastrados.
    - [x] Interface moderna integrada à paleta do sistema.
- [x] **Módulo Destrave a Escuta (MVP):**
    - [x] `src/types/escuta.ts` — Tipos migrados do protótipo (Question, GeneratedData, GameResult, etc).
    - [x] `/api/missions/generate-questions` — API Route que processa PDF via Gemini e retorna questões estruturadas.
    - [x] `/api/missions/generate-audio` — API Route de TTS com vozes contextuais (Zephyr, Puck, Kore, etc).
    - [x] `/api/missions/save-result` — Persiste resultado em `activities` + `assignments` no Supabase.
    - [x] `EscutaApp.tsx` — Orquestrador React com estados UPLOAD/PLAYING/RESULT.
    - [x] `UploadScreen.tsx` — Upload de PDF, seleção de dificuldade, foco e quantidade (Ice Meta).
    - [x] `GameScreen.tsx` — Interface de jogo com WebAudio API, controle de velocidade e feedback (Ice Meta).
    - [x] `ResultScreen.tsx` — Tela de resultado com estrelas, precisão e revisão item a item.
- [x] **Módulo Destrave MRP 🎭:**
    - [x] `src/types/mrp.ts` — Tipos (Question, QuizConfig, UserAnswer, JLPTLevel).
    - [x] `/api/mrp/generate-questions` — IA gera cenários de Role Play baseados em nível e contexto.
    - [x] `/api/mrp/validate-answer` — IA avalia polidez e naturalidade de respostas discursivas japonês.
    - [x] `/api/mrp/save-result` — Persiste resultado em `activities` (formatado como JSON no `config`).
    - [x] `MrpApp.tsx`, `ConfigScreen.tsx`, `GameScreen.tsx`, `ResultScreen.tsx` (Ice Meta Design).
- [x] **Módulo Destrave Cards 🃏:**
    - [x] `src/types/flashcards.ts` — Tipos (Flashcard, FlashDeck, DeckConfig).
    - [x] `/api/flashcards/generate-deck` — IA extrai vocabulário/gramática estratégica da aula.
    - [x] `/api/flashcards/save-deck` — Salva deck approved pelo professor em `activities`.
    - [x] `FlashcardsApp.tsx`, `DeckGenerator.tsx`, `ReviewStudio.tsx` (Editor de Aprovação), `CardViewer.tsx` (Flip 3D & SRS).
- [x] **Polimento & Responsividade (UX Pro Max) 📱:**
    - [x] **Draw Toolbar:** Nova toolbar responsiva (Vertical no Desktop / Horizontal na Base no Mobile).
    - [x] **Efeitos Visuais:** Reposicionamento ergonômico dos botões de interação (Matsuri, Rocket) no mobile.
    - [x] **Módulo de Missões:** Grid adaptativo (`auto-fill`) para visualização de cards em múltiplas colunas em telas maiores.
    - [x] **MRP Game Screen:** Ajustes de padding e escala de fonte para experiência mobile-first.
    - [x] **Navegação:** Sidebar e Header com comportamentos de toque aprimorados.
- [x] **Otimização de Custos & IA ⚖️:**
    - [x] **Estratégia Gemini:** Implementação de modelos estáveis (2026):
        - `gemini-2.5-flash`: Modelo principal para Processamento de PDFs, MRP e Flashcards.
        - `gemini-1.5-flash`: Fallback e TTS específico.
- [x] **Interface & Navegação:**
    - [x] Reorganização do menu lateral: Alunos > Agenda > Draw > Escuta > MRP > Cards > Missões.
    - [x] Renomeação de "Flashcards" para "Destrave Cards".
    - [x] **Deploy & Backup:** Primeito Sync/Push completo para GitHub (`main`).
    - [x] **Sincronização de Banco (Schema Sync):**
    - [x] Renomeada coluna `content` para `config` em `activities`.
    - [x] Adicionada coluna `type` em `activities`.
    - [x] Adicionadas colunas `result_data`, `completed_at` e `assigned_at` em `assignments`.
    - [x] Verificado `experimental_uuid` em `students`.
    - [x] Inserida chave real no `.env` (Confirmado pelo usuário).
- [x] **Integração com Perfil do Aluno 🎓:**
    - [x] **MissionList.tsx:** Listagem dinâmica de missões (assignments) no dashboard do aluno.
    - [x] **EscutaApp, MrpApp, FlashcardsApp:** Refatorados para aceitar `assignmentId` e carregar dados pré-gerados.
    - [x] **Astro Pages:** `escuta.astro`, `mrp.astro`, `flashcards.astro` agora suportam carregamento SSR de missões atribuídas.
    - [x] **Persistência:** `save-result.ts` atualizado para tratar atualizações de missões existentes.
- [x] **Gestão de Central de Atividades (CRUD Pro) 🛠️:**
    - [x] **API Unificada de Salvamento:** `/api/activities/save` centraliza a criação de flashcards, escuta e mrp.
    - [x] **API de Deleção:** `/api/activities/delete` remove atividade e limpa assignments vinculados.
    - [x] **API de Duplicação:** `/api/activities/duplicate` clona atividades com sufixo "(Cópia)".
    - [x] **API de Edição:** `/api/activities/update` permite renomear títulos e configurações de missões.
    - [x] **ActivitiesPanel UX:**
        - [x] Ícones de ação (Duplicar, Lápis, Renomear, Lixeira) com feedback tátil e visual.
        - [x] **Editar Conteúdo**: Botão que reabre o Estúdio/Review original da atividade com dados carregados.
        - [x] Confirmação nativa para exclusão.
        - [x] Mensagens Toast para cada operação.
        - [x] Correção de tipagem (Students `name` vs `full_name`).
- [x] **Correções de IA 🤖:**
    - [x] Corrigido erro de nomenclatura do modelo TTS (`gemini-2.5` -> `gemini-1.5-flash`).
    - [x] Auditoria de modelos concluída (Uso híbrido de Flash 2.0 e Flash Lite 2.0).
- [x] **Segurança & Controle de Acesso (Escudo do Professor) 🛡️:**
    - [x] **Fix Logout:** Resolvido o problema de encerramento de sessão no DashboardLayout.
    - [x] **RoleGuard component:** Criado componente de proteção de rotas para React.
    - [x] **Bloqueio de Alunos:** Geradores de conteúdos (Draw, Escuta, MRP, Cards) agora redirecionam alunos se acessados sem um `assignmentId`.
    - [x] **Redirecionamento Inteligente:** Alunos navegando em geradores são instruídos a retornar ao dashboard principal.
- [x] **Hotfix Gemini & Auth (23/03):** 
    - [x] Atualizado modelo de `gemini-2.0-flash` para `gemini-2.5-flash` (estável em 2026) corrigindo erro 500 na geração.
    - [x] Refatorado `RoleGuard.tsx` para usar `.maybeSingle()` evitando erro 406 (Not Acceptable) em perfis recém-criados.
- [x] **Otimização de Custos (Cache de Áudio) ⚖️:**
    - [x] **Cache no Supabase:** Áudios gerados via Gemini agora são armazenados na coluna `config` da atividade.
    - [x] **Economia de Tokens:** Cada frase de escuta só consome tokens uma única vez por lição, independente do número de alunos ou repetições.
- [x] **Gestão Pedagógica (Resultados & Acompanhamento) 🎓:**
    - [x] **Primeira Tentativa Oficial:** O sistema agora preserva o score da primeira conclusão como a nota "Oficial".
    - [x] **Histórico de Prática:** Alunos podem refazer lições para estudo; novas tentativas são salvas em um array de `replays` sem sobrescrever a original.
    - [x] **Painel de Atividades Recentes (Professor):** Feed em tempo real no dashboard do professor mostrando quem terminou lições, notas e horários.
    - [x] **Upgrade de IA (MRP):** Modelo de validação atualizado para `gemini-2.5-flash` para maior precisão em respostas discursivas.
- [x] **Estabilização do MRP:** Correção de bug no carregamento de `assignmentId` e logs de depuração aprimorados.


---

- [ ] **Ajustes Finos de Layout & Prompts (PRIORIDADE MÁXIMA):** Refinamento da UI para experiência Premium e otimização dos prompts do Gemini Sensei para maior precisão pedagógica.
- [x] **Dashboard Principal (Estatísticas):** Adicionado painel de Atividades Recentes de alunos em tempo real.
- [x] **Relatórios de Desempenho:** Implementada a distinção entre Primeira Tentativa e Prática no banco de dados.


---

- **Astro Server Mode:** O sistema foi configurado com `output: 'server'` no `astro.config.mjs` para permitir que os endpoints de API (como o cadastro de alunos) processem requisições POST dinâmicas no servidor.
- **Admin Auth Client:** A criação de alunos utiliza um cliente administrativo (`supabaseAdmin`) que opera via `SERVICE_ROLE_KEY` no lado do servidor, permitindo que o professor crie contas de autenticação oficiais sem deslogar da própria sessão.
- **Tipagem Centralizada:** Todos os modelos de dados residem em `src/types/supabase.ts` para banco de dados e tipos específicos de componentes em seus respectivos diretórios.
