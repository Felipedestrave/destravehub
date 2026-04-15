# 📊 Log de Evolução — Destrave Hub

Este documento registra o progresso da implementação, decisões técnicas e o estado atual do projeto. **Sempre consulte e atualize este arquivo ao retomar ou finalizar uma sessão de trabalho.**

---

- [x] **Segurança e Acesso:** Logout de professor corrigido e `RoleGuard` implementado (Geradores restritos).
- [x] **Perfil do Sensei 2.0:** Cadastro completo (Bio, Especialidade, Nome de Exibição) e Upload de Foto com Cropper.
- [x] **Conexão Imersiva:** Aluno agora vê foto e nome do professor no topo do dashboard.
- [x] **Correção RLS:** Permissões de banco ajustadas para compartilhamento de perfil seguro.
- [x] **Infraestrutura SSR:** Adaptador Vercel configurado e deploy em produção realizado com sucesso.
- **Status:** Deploy Vercel (OK) | Perfil do Sensei concluído | Vozes do Buddy (87/90) | Fix Navegação Global.
- **Última Atualização:** 15/04/2026 (11:35h)
- **GitHub:** `https://github.com/Felipedestrave/destravehub.git` (Branch `main`)

---

### Fase 7: Infraestrutura & Produção (Vercel SSR) (14/04/2026) ✅
- **Adaptação para Vercel**: Instalação e configuração do `@astrojs/vercel` (v10) para suporte total a SSR.
- **Astro 6 Compatibility**: Atualização de dependências críticas para garantir compatibilidade entre Astro 6, React 19 e Vite 7.
- **Pipeline de Deploy**: Sincronização via GitHub Action (Vercel Integration) com build e deploy automáticos.
- **Configuração de Ambiente**: Validadas variáveis de ambiente (Supabase) no painel da Vercel para operação em produção.
- **Build Server-Side**: O sistema agora opera 100% em modo `server`, permitindo rotas dinâmicas e maior segurança em operações de API.


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

- [x] **Inversão de Lógica de Materiais (Contextualização) 🔄:**
    - [x] **Infraestrutura N:N:** Criada tabela `activity_materials` para permitir que um material pertença a várias missões.
    - [x] **Vínculo pela Missão:** Adicionado botão "Vincular Materiais" na Central de Atividades.
    - [x] **Link Modal:** Popup de busca e seleção múltipla para vinculação rápida.
    - [x] **Contador Visual:** Cards de missão agora exibem o ícone `📎` com a quantidade de arquivos vinculados.
    - [x] **Refatoração Drawer:** O componente de exibição do aluno agora lê os vínculos da tabela de junção.
- [x] **Explorador de Arquivos "Destrave Drive" (Organização) 📁:**
    - [x] **Pastas & Subpastas:** Suporte completo a hierarquia de pastas (Recursive Folders).
    - [x] **Navegação por Breadcrumbs:** Trilha de navegação no topo para movimentação rápida entre níveis.
    - [x] **Drag & Drop (Arraste e Solte):** Movimentação de arquivos para pastas (no grid ou na trilha) via arrasto nativo.
    - [x] **Upload Contextual:** Arquivos subidos dentro de uma pasta herdam o vínculo automaticamente.
    - [x] **Design Premium:** Pasta com ícones pixel-perfect, animações de entrada e gerenciamento simplificado.
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
- [x] **Fix de Áudio (Buddy)**: O problema de áudio mudo (`NotSupportedError`) foi resolvido. 
  - **Causa**: O Gemini TTS envia PCM bruto (L16) sem cabeçalho.
  - **Solução**: Implementada função `createWavHeader` no script de geração que injeta o cabeçalho WAV de 44 bytes.
  - **Status**: 65 de 90 arquivos gerados. 25 pendentes devido ao limite de cota diária (100 requisições/dia).
  - **Ação futura**: Rodar `npx tsx scripts/generate-buddy-voices.ts` após o reset da cota (aprox. 6h) para completar a biblioteca.

### Fase 6: Central do Sensei & Identidade Sincronizada (10/04/2026) ✅
- **Perfil Profissional do Professor**: Reconstrução da página de configurações (`SettingsPanel.tsx`) com suporte a Biografia, Especialidade e Nome de Exibição.
- **Upload de Avatar com Magic Cropper**:
  - Integração com **Supabase Storage** (bucket `avatars`).
  - Implementação de um **Editor de Recorte (Cropper)** nativo de alto desempenho.
  - Processamento via **Canvas API** para garantir imagens leves e perfeitamente circulares.
  - Suporte a arraste, zoom e prévia em tempo real.
- **Imersão Aluno-Professor**:
  - **Selo do Mestre**: Adicionado o componente "Meu Sensei" no cabeçalho do aluno, mostrando foto e nome do professor responsável.
  - **Saudação Inteligente**: Lógica para evitar prefixos duplicados (Ex: Não exibe "Sensei Sensei [Nome]").
  - **Refatoração do DashboardLayout**: Centralização da lógica de carregamento de perfil baseada no papel (Role).
- **Ajustes de Infraestrutura e Segurança**:
  - **Fix de RLS**: Implementadas políticas de segurança no SQL para permitir que alunos visualizem os perfis dos professores.
  - **Sincronização de Tipos**: Atualizado `src/types/supabase.ts` para incluir as novas colunas de perfil, garantindo 0 erros de TypeScript.
  - **Ajuste Flashcards**: Escondido o cabeçalho administrativo da página Astro quando acessada como missão de aluno.


  - **Fix Tipográfico**: Corrigido erro de pluralização "questãoões" para "questões" na Central de Atividades.
  - **Navegação Inteligente**: Adicionado botão "Início/Dashboard" na TopBar global (DashboardLayout) para facilitar o retorno à página principal.
  - **Audit de Vozes**: Verificados 87/90 áudios do Buddy gerados.
  - **Upgrade Flashcards (UX & Metas)** (15/04/2026):
    - **Fix de Layout**: Implementado `font-size` dinâmico (`clamp`) para evitar estouro de texto em cards com significados longos.
    - **Confetes Epic**: Aumentada a intensidade da celebração (120 partículas) para cumprimento de alvos.
    - **Metas do Professor**: Adicionada interface no "Review Studio" para o professor estabelecer Alvos de Acertos e Tempo antes de compartilhar.
  - **Refinamento Central de Atividades** (15/04/2026):
    - **Fix Z-Index**: Corrigido problema onde o menu de opções do card ficava atrás de outros cards.
    - **Upload Direto**: Integrado botão de Upload no modal "Vincular Materiais", permitindo subir arquivos e vinculá-los instantaneamente à atividade sem trocar de página (Fix: Mapeamento de coluna `file_path`).

---

## ⏭️ Próximos Passos (Próxima Sessão)

1. ✅ **[PRIORIDADE MÁXIMA] Portal de Captura (Lead Magnet)**: Criado e finalizado!
   - Link de convite na Central de Atividades para Landing Page `convite/[id]`.
   - Landing Page de captura `CaptureForm` com validação.
   - Rotina API `api/leads/capture` para salvar leads via JSONB na tabela de `students` (campo `metadata: { is_lead: true, whatsapp, email }`).
   - Propagação de botão "Chamar o Sensei no Zap" (usando prop `senseiWhatsapp`) no sumário das 3 atividades experimentais concluídas.
   - Aba "Leads Capturados" adicionada ao Dashboard do professor para listar e contactar vendas.
4. **Finalizar Vozes do Buddy**: Rodar o script de geração para os 25 arquivos restantes assim que a cota da API Gemini resetar.
5. **Mecânica de Streaks (Fogo)**: Implementar visual de sequência de dias para bônus de XP e incentivar prática diária.
6. **Notificações In-App**: Sistema de alertas visuais para novas missões atribuídas ou avisos do professor.
7. **SFX de Buddy**: Adicionar efeitos sonoros leves para as reações do mascote (comemoração e erro).
8. **Mecânica de Streaks (Backlog)**: Planejada a lógica de "Fogo" por dias consecutivos, multiplicador de recompensas e item "Freeze" na loja. (Arquivado para implementação futura).

---

- **Astro Server Mode:** O sistema foi configurado com `output: 'server'` no `astro.config.mjs` para permitir que os endpoints de API (como o cadastro de alunos) processem requisições POST dinâmicas no servidor.
- **Admin Auth Client:** A criação de alunos utiliza um cliente administrativo (`supabaseAdmin`) que opera via `SERVICE_ROLE_KEY` no lado do servidor, permitindo que o professor crie contas de autenticação oficiais sem deslogar da própria sessão.
- **Tipagem Centralizada:** Todos os modelos de dados residem em `src/types/supabase.ts` para banco de dados e tipos específicos de componentes em seus respectivos diretórios.
