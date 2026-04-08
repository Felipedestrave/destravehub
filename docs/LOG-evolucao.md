# 📊 Log de Evolução — Destrave Hub

Este documento registra o progresso da implementação, decisões técnicas e o estado atual do projeto. **Sempre consulte e atualize este arquivo ao retomar ou finalizar uma sessão de trabalho.**

---

- [x] **Segurança e Acesso:** Logout de professor corrigido e `RoleGuard` implementado (Geradores restritos).
- [x] CRUD Completo na Central (Deletar, Duplicar, Renomear, Editar Conteúdo)
- [x] **Padronização de PDF IA:** MRP e Flashcards agora leem PDFs diretamente através do Gemini Sensei API.
- **Status:** Ecossistema de Aluno (Agenda + Inventário), Buddy Reativo e Loja Completa.
- **Última Atualização:** 29/03/2026 (10:00h)
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
- [x] **Upgrade Destrave Cards (Modo Desafio) 🃏:**
    - [x] **Setup de Missão:** Tela inicial para definir Alvo de Acertos e Tempo Alvo antes de iniciar.
    - [x] **Feedback Binário:** Substituído o sistema SRS complexo por botões simplificados "Certo" e "Errado".
    - [x] **Cronômetro Central:** Monitoramento de tempo real integrado ao cabeçalho da atividade.
    - [x] **Atalhos de Aula:** Implementado controle total via teclado (`Espaço/Enter` para virar, `1/2` ou `Setas` para feedback).
    - [x] **Visual Premium (Cards):** Ampliação do tamanho dos cards e verso com identidade visual da marca (Roxo/Branco).
    - [x] **Animações Cinematográficas:** Chuva de confetes, brilho (glow) e efeitos de escala para vitórias e encorajamento.


---

- [x] **Gamificação Fase 1 (Motor) 🪙:**
    - [x] **RPC `increment_gamification`:** Função atômica no banco para atualizar XP, Coins e Inventário em uma única transação.
    - [x] **Integração de Recompensas:** Flashcards e Escuta agora geram 20 DC base + bônus de assertividade e tempo.
- [x] **Gamificação Fase 2 (Loja - Mercado Destrave) 🛒:**
    - [x] **Store Engine:** Catálogo unificado em `store.ts` com categorias (Avatar, Tema, Título) e raridades.
    - [x] **Infraestrutura:** Endpoints `/api/store/purchase` (validação de saldo e estoque) e `/api/store/equip` (persistência de estado visual).
    - [x] **Design Temático (Guerreiros Pixar):** Reformulação total para 21 itens exclusivos com temática japonesa urbana e 3D Pixar.
    - [x] **UX da Loja:** Cards com prévia em 1:1, suporte a imagens de corpo inteiro (`contain`) e banners de cenário (`cover`).
    - [x] **Economia Balanceada:** Projeção de ganhos para perfis Hardcore (6 meses) e Médio (2 anos) para retenção de longo prazo.

### Fase 3: O Companheiro (Buddy) & Gamificação Refinada (28/03/2026) ✅
- **Criação do Buddy Motor**: Implementação do `BuddyView.tsx` com Framer Motion (animações Pixar de idle, sucesso e erro).
- **Avatar Inicial**: Criação do **Tanuki Novato** como o companheiro padrão de todos os alunos.
- **Integração Total**: 
  - **Flashcards**: Buddy reage aos cliques de Certo/Errado.
  - **Escuta**: Buddy reage à validação da transcrição de áudio.
  - **MRP**: Buddy reage ao feedback da IA sobre o desempenho do aluno.
- **Economia Blindada**: Alterado `REPLAY_MULTIPLIER` para 0. Alunos podem praticar infinitamente, mas só ganham moedas/XP na primeira tentativa.
- **Loja Finalizada**: Catálogo de Títulos, Temas e Avatars com metadados e preços definitivos.

### Fase 5: Experiência do Aluno & Buddy Imersivo (29/03/2026) ✅
- **Agenda do Aluno**: Criado `AgendaView.tsx` consolidando Aulas Agendadas e Missões Pendentes em uma linha do tempo dinâmica no dashboard.
- **Speech Bubbles (Buddy)**: Implementado sistema de balões de fala contextuais com animação `AnimatePresence`.
- **Alma dos Avatares (Personalidades)**: Criada a biblioteca `buddy-phrases.ts`. Cada avatar lendário agora possui frases características de acerto e erro (Ex: `Tenka ippin da!` para o Shogun).
- **Integração Total de Gamificação**: O sistema de feedback interativo do Buddy foi propagado para **Flashcards**, **Escuta** e **MRP**.
- **Sistema de Inventário**: Criado `InventoryManager.tsx` e página `/dashboard/inventory`. Alunos podem gerenciar e equipar Avatares, Temas e Títulos.
- **Títulos 3D Integrados**: Todas as artes dos 7 títulos (Turista, Senpai, etc.) já estão configuradas no `store.ts` e prontas para uso.
- **Correções Linguísticas**: Revisão do vocabulário do Buddy para japonês natural (**Seikou** vs Seika).
- **Fix de Áudio (Buddy)**: Refatorado `BuddyView.tsx` para sincronia à prova de cliques rápidos e adição de telemetria no console (`console.warn`).
- **⚠️ Bloqueador de Áudio (Para Próxima Sessão)**: Descoberto que os arquivos de áudio em `/assets/buddy-voices/...` foram gerados como PCM bruto sem cabeçalho (causando `NotSupportedError`). **Ação pendente:** Re-gerar as vozes garantindo um encoder para MP3 verdadeiro, para que o navegador consiga tocar.

---

## ⏭️ Próximos Passos (Próxima Sessão)

1. ✅ **[PRIORIDADE MÁXIMA] Portal de Captura (Lead Magnet)**: Criado e finalizado!
   - Link de convite na Central de Atividades para Landing Page `convite/[id]`.
   - Landing Page de captura `CaptureForm` com validação.
   - Rotina API `api/leads/capture` para salvar leads via JSONB na tabela de `students` (campo `metadata: { is_lead: true, whatsapp, email }`).
   - Propagação de botão "Chamar o Sensei no Zap" (usando prop `senseiWhatsapp`) no sumário das 3 atividades experimentais concluídas.
   - Aba "Leads Capturados" adicionada ao Dashboard do professor para listar e contactar vendas.
2. **Mecânica de Streaks (Fogo)**: Implementar visual de sequência de dias para bônus de XP e incentivar prática diária.
3. **Notificações In-App**: Sistema de alertas visuais para novas missões atribuídas ou avisos do professor.
4. **SFX de Buddy**: Adicionar efeitos sonoros leves para as reações do mascote (comemoração e erro).

---

- **Astro Server Mode:** O sistema foi configurado com `output: 'server'` no `astro.config.mjs` para permitir que os endpoints de API (como o cadastro de alunos) processem requisições POST dinâmicas no servidor.
- **Admin Auth Client:** A criação de alunos utiliza um cliente administrativo (`supabaseAdmin`) que opera via `SERVICE_ROLE_KEY` no lado do servidor, permitindo que o professor crie contas de autenticação oficiais sem deslogar da própria sessão.
- **Tipagem Centralizada:** Todos os modelos de dados residem em `src/types/supabase.ts` para banco de dados e tipos específicos de componentes em seus respectivos diretórios.
