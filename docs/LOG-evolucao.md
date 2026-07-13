# 📊 Log de Evolução — Destrave Hub

Este documento registra o progresso da implementação, decisões técnicas e o estado atual do projeto. **Sempre consulte e atualize este arquivo ao retomar ou finalizar uma sessão de trabalho.**

---

- [x] **Instruções Customizadas de IA:** Adicionado campo de texto opcional em todos os 5 geradores para o professor guiar a geração com diretrizes específicas.
- [x] **Segurança e Acesso:** Logout de professor corrigido e `RoleGuard` implementado (Geradores restritos).
- [x] **Perfil do Sensei 2.0:** Cadastro completo (Bio, Especialidade, Nome de Exibição) e Upload de Foto com Cropper.
- [x] **Conexão Imersiva:** Aluno agora vê foto e nome do professor no topo do dashboard.
- [x] **Correção RLS:** Permissões de banco ajustadas para compartilhamento de perfil seguro.
- [x] **Infraestrutura SSR:** Adaptador Vercel configurado e deploy em produção realizado com sucesso.
- **Status:** Deploy Vercel (OK) | Sistema de Temas Dinâmicos (OK) | Gestão Financeira (OK) | Gestão Destrave Draw (OK) | Vozes do Buddy (90/90 - OK) | Laser Real-time (OK) | Edição de Revisão MRP/Escuta (OK) | Correção TypeScript Geral (OK) | Destrave 2.0 (OK) | Instruções Opcionais de IA (OK) | Compartilhamento de Materiais e Busca Semântica (OK).
- **Última Atualização:** 13/07/2026 (17:05h)
- **GitHub:** `https://github.com/Felipedestrave/destravehub.git` (Branch `main`)

---

## 📅 Sessão: 13/07/2026 - Compartilhamento de Materiais & Busca Semântica por IA

### 🎯 Proposta & Escopo:
*   **Compartilhamento de Materiais:** Permitir que o professor compartilhe materiais em PDF/Imagem de sua biblioteca de forma direta com alunos específicos a partir do gerenciador.
*   **Segurança na Deleção:** Impedir que a deleção de uma referência de material por parte de um aluno ou professor remova o arquivo físico no Supabase Storage se ele ainda estiver sendo referenciado por outros usuários.
*   **Busca Semântica por IA:** Permitir que o aluno pesquise materiais na aba "Materiais de Apoio" por proximidade conceitual e contextual utilizando a IA do Google Gemini.
*   **Ordenação por Data:** Implementar a ordenação de arquivos por nome e por data de compartilhamento (data de vinculação).

### ✅ Implementação Concluída:
*   **API de Busca Semântica:** Rota `/api/materials/semantic-search` criada usando o modelo `gemini-2.5-flash-lite` para ranquear arquivos de apoio de forma conceitual baseado na busca do aluno.
*   **Modal de Compartilhamento:** Criado o componente de modal `ShareMaterialModal` no [MaterialsManager.tsx](file:///c:/Users/Felipe Kawakami/Aplicativos/src/components/materials/MaterialsManager.tsx) que permite ao professor selecionar alunos de teste de forma null-safe e duplicar a referência no banco (referenciando o mesmo `file_path`).
*   **Eventos e UI (Correção de Arraste):** Adicionado `onMouseDown={(e) => e.stopPropagation()}` nos botões de ação do card ("Ver", "Compartilhar", "Excluir") para evitar que o evento de arraste (`draggable`) nativo do card intercepte e cancele o clique.
*   **Exclusão Segura:** Ajustado o método `handleDelete` para só excluir fisicamente o arquivo do bucket do Supabase Storage se a contagem de registros com o mesmo `file_path` for menor ou igual a 1.
*   **Interface do Aluno:** Habilitada a exclusão e adicionada a ordenação (Nome vs Data) e o input de busca semântica por IA.
*   **Tipagem e Build:** Validação de compilação efetuada com sucesso com `npx tsc --noEmit` (0 erros) e push realizado para o GitHub.

---

## 📅 Sessão: 25/06/2026 - Implementação das Instruções Opcionais da IA

### 🎯 Proposta & Escopo:
*   **Instruções Customizadas:** Inclusão de um campo de texto opcional (`textarea`) para permitir que o professor envie diretrizes adicionais ao Gemini ao gerar exercícios.
*   **Modos Cobertos:** Destrave 2.0 (Híbrido), Destrave Escuta, Destrave Lego, Destrave MRP e Destrave Cards (Flashcards).
*   **Flexibilidade:** Campo 100% opcional. Se deixado vazio, a IA segue as regras padrão de cada jogo.

### ✅ Implementação Concluída:
*   **Tipagem Atualizada:** Adicionado `customInstructions` opcional nos tipos `GameConfig`, `LegoConfig`, `MrpConfig`, `DeckConfig` e `FlashDeck`.
*   **UI do Professor Modificada:** Integrada a textarea nas telas de autoria dos 5 geradores, com o design system Ice Meta.
*   **Integração com Gemini:** Atualizados os endpoints das APIs de geração para ler as instruções e injetá-las de forma dinâmica nos prompts enviados ao Gemini 2.5 Flash.
*   **Sincronização de Rotas Astro:** As páginas `.astro` de missões foram configuradas para carregar o histórico de instruções do banco de dados quando necessário.
*   **Validação Completa:** TypeScript compilado sem erros (`npx tsc --noEmit`).

---

## 📅 Sessão: 19/06/2026 - Implementação do "Destrave 2.0" (Playlist Híbrida)

### 🎯 Proposta & Escopo:
*   **O Conceito:** Criação de um novo player/aplicativo unificado chamado **Destrave 2.0**.
*   **O Fluxo:** O professor faz o upload de uma matéria (PDF/Texto) e escolhe a quantidade de exercícios da missão (opções de **10, 15 ou 20**).
*   **Geração Inteligente:** A IA (`gemini-2.5-flash`) gera um mix estruturado de exercícios contendo **Destrave Escuta** (compreensão auditiva), **Destrave Lego** (construção gramatical de frases) e **Destrave MRP** (diálogos de múltipla escolha), dividindo as proporções de forma dinâmica.
*   **Níveis de Dificuldade:** Opções de escolha de nível divididos em 4 opções: **N5, N4, N3 e Misturado**.
*   **Estúdio de Curadoria:** O professor analisa, edita, exclui e aprova o resultado da IA na tela de revisão antes de salvar.
*   **Áudio TTS:** O backend gera os arquivos de áudio automaticamente para as frases de escuta usando as vozes contextuais dos avatares e os embutirá na atividade.

### ⚠️ Regra Crítica de Segurança (Prevenção de Regressão & Reversibilidade):
*   > [!IMPORTANT]
    > **Isolamento de Código (Fallback Garantido):** O sistema vigente funciona perfeitamente e foi mantido 100% intacto.
    > Nenhuma alteração destrutiva ou substituição de arquivos foi feita nas páginas, rotas ou banco de dados atuais.
*   Toda a implementação do Destrave 2.0 foi feita de maneira **aditiva e modular** (novas rotas e componentes isolados).

### ✅ Implementação Concluída:
*   **Isolamento Garantido:** Nenhuma alteração destrutiva ou regressão no sistema atual.
*   **Geração Híbrida Inteligente:** Rota `/api/missions/generate-hybrid` implementada com Gemini 2.5 Flash, separando o mix de Escuta, Lego e MRP de acordo com os níveis de dificuldade (N5, N4, N3, Misturado) e quantidade de questões (10, 15, 20).
*   **Áudio TTS:** Processamento paralelo de áudio nativo integrado na geração inicial da playlist de escuta.
*   **Estúdio de Revisão do Professor:** Componente `Destrave2App.tsx` concluído, fornecendo painel completo para curadoria e edição pré-salvamento das questões geradas.
*   **Player Unificado do Aluno:** Componente `Destrave2Player.tsx` concluído, oferecendo trilha sequencial dos sub-jogos com barra de progresso única, feedback imediato e buddy ativo.
*   **Compilação Limpa:** Testes TypeScript (`npx tsc --noEmit`) e Astro (`npx astro check`) validados com 0 erros.

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
- [x] **Gestão de Lições (CRUD Pro):**
    - [x] Salvamento persistente (POST/PUT) no Supabase.
    - [x] Suporte a Duplicar, Renomear e Excluir lições.
    - [x] Organização por pastas integrada ao Destrave Drive.
- [x] **Modo Player (Student Edition):**
    - [x] Interface `isReadOnly` que oculta ferramentas de edição.
    - [x] Card de "Intervenção do Sensei" com foto e link WhatsApp do professor.
    - [x] Rota dinâmica de player `/play/draw/[id]` integrada ao sistema de missões.
    - [x] Botão "Testar Agora" para preview imediato do professor.
- [x] **UX & Interatividade (Handwritten Edition):**
    - [x] **Handwritten Font:** Implementada fonte "Architects Daughter" (estilo Excalidraw) em todo o canvas e interface da aula.
    - [x] **Ajuste de Layout:** Reposicionamento da toolbar para evitar conflito com a sidebar lateral do dashboard (offset de 280px).
    - [x] **Reações Rápidas:** Inclusão do efeito de "Suor/Esforço" (💦) completando o set de 5 animações.
    - [x] **Atalhos de Teclado:** Teclas `1` a `5` agora disparam reações instantâneas para maior dinamismo na aula.
    - [x] **Escala de Aula Dinâmica:** Implementado controle de fonte/imagens (`A+` / `A-`) e atalhos (`Shift + + / -`).
    - [x] **Modo Aula Inteligente:** O dashboard lateral agora recolhe automaticamente ao iniciar a aula para ganhar espaço.
- [x] **Qualidade de Áudio:** Implementação de `createWavHeader` para compatibilidade total de TTS nos navegadores.
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
- [x] **Eficácia Pedagógica & Navegação (01/05/2026) 🧠:**
    - [x] **Randomização de Alternativas**: Implementada lógica de *Shuffling* (Fisher-Yates) para opções de múltipla escolha em `Destrave1Player` e `EscutaApp`. O aluno agora precisa focar no conteúdo, não na posição (A/B/C/D).
    - [x] **Feedback de Recompensas**: Tela de resultados (`ResultScreen`) atualizada para exibir moedas (DC) e XP de forma proeminente com animações.
    - [x] **Navegação Sem "Nós Cegos"**:
        - [x] Adicionado botão "Voltar" no cabeçalho de exercícios (`Destrave1Player`).
        - [x] Adicionado botão de retorno na tela final de missões.
        - [x] Implementados botões de "Voltar" na Linha do Tempo de Atividades e no Roadmap de Aventura para garantir fluxo contínuo.
    - [x] **Transparência de Recompensas**: 
        - [x] Unificado bônus de SRS ao total de `rewards` no backend.
        - [x] Implementado "Extrato de Ganhos" (tooltip) na tela de resultados para detalhar bônus de revisão.
    - [x] **Correção de Fluxo SRS**: Removida trava que impedia a conclusão de etapas de revisão quando a recompensa era 0 (atraso). Agora o progresso no Roadmap é garantido após a prática.
    - [x] **Fix de Tipagem**: Resolvido erro de referência `selectedIndex` no orquestrador de missões.


- [x] **Aulas Conectadas (Laser Real-time) (04/05/2026) 🔦:**
    - [x] **Sincronização Laser**: Implementado canal de Broadcast via Supabase Realtime para que o aluno visualize o cursor do professor em tempo real.
    - [x] **Tracking Global**: Refatoração do rastreio do ponteiro para nível global (`window`), garantindo que o laser funcione sem bloquear cliques nos slides ou no dicionário.
    - [x] **UX de Aula**: Inclusão de sincronização de cor e lógica de auto-hide (laser_hide) para uma experiência de apresentação profissional.


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
    - [x] **Sistema de Temas Dinâmicos (22/04/2026) 🎨:**
        - [x] **Fix de Banco**: Adicionada coluna `equipped` (jsonb) na tabela `profiles` via migração SQL.
        - [x] **Arquitetura de Variáveis**: Temas implementados via CSS Variables (`--color-brand`, `--color-ice`, etc.) com escopo global.
        - [x] **Layout Sincronizado**: `DashboardLayout.astro` atualizado para aplicar classes de tema (`theme-konbini-night`, etc.) baseadas no perfil.
        - [x] **Equipamento Inteligente**: Implementada lógica de "Toggle" (Equipar/Desequipar) na Loja e Inventário.
        - [x] **Real-time Engine**: Uso de `CustomEvent` (`theme-changed`) para trocar as cores do dashboard instantaneamente sem recarregar a página.
        - [x] **Paletas Customizadas**: Criadas 7 paletas exclusivas (Midnight, Shinkansen, Ramen, Akihabara Glitch, etc.) com uso de `!important` para garantir consistência sobre o Tailwind v4.

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
  - **Status**: 90 de 90 arquivos gerados. Todas as vozes estão prontas e com cabeçalho WAV correto.
  - **Ação futura**: Rodar `npx tsx scripts/generate-buddy-voices.ts` para finalizar a última voz restante.

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
  - **Audit de Vozes**: Verificados 89/90 áudios do Buddy gerados.
  - **Upgrade Flashcards (UX & Metas)** (15/04/2026):
    - **Fix de Layout**: Implementado `font-size` dinâmico (`clamp`) para evitar estouro de texto em cards com significados longos.
    - **Confetes Epic**: Aumentada a intensidade da celebração (120 partículas) para cumprimento de alvos.
    - **Metas do Professor**: Adicionada interface no "Review Studio" para o professor estabelecer Alvos de Acertos e Tempo antes de compartilhar.
    - **Leitura Guiada (Romaji) (16/04/2026)**: Atualizado o gerador de decks de Flashcards na API (`generate-deck.ts`) para incluir automaticamente a leitura em romaji (sem macrons) entre parênteses ao lado das palavras em Kanji na frente do card e nas frases de exemplo.
  - **Refinamento Central de Atividades** (15/04/2026):
    - **Fix Z-Index**: Corrigido problema onde o menu de opções do card ficava atrás de outros cards.
    - **Upload Direto**: Integrado botão de Upload no modal "Vincular Materiais", permitindo subir arquivos e vinculá-los instantaneamente à atividade sem trocar de página (Fix: Mapeamento de coluna `file_path`).

---

### Fase 8: Gamificação & Agendamento Produtivo (28/04/2026) ✅
- **Gamificação & Recompensas**:
  - **Lógica de Streak (🔥)**: Implementado bônus progressivo de presença (+2 moedas por aula consecutiva, máx 20).
  - **Gestão de Faltas**: Botão "Registrar Falta" que reseta o streak do aluno e adiciona marcador visual no histórico.
  - **Correção de Avatar**: Resolvido bug do "Tanuki" no Destrave 1.0; agora o sistema carrega o avatar equipado do aluno com voz e balões.
- **Agendamento Turbinado (Calendário)**:
  - **Recorrência Inteligente**: Suporte a aulas Semanais, Quinzenais e Mensais com criação em massa.
  - **Convites Complexos (Zoom/Meet)**: Campo de instruções multi-linha que aceita blocos completos (Link + ID + Senha).
  - **Notificações Informais**: Modelos de mensagem WhatsApp configuráveis e amigáveis ("Te espero lá. Tamo junto!").
  - **Aviso de Bom Dia**: Botão de lembrete rápido em cada aula da lista diária para envio instantâneo via WhatsApp com um clique.
- **Segurança & Dados**:
  - **Registro de WhatsApp**: Atalho para cadastrar telefone do aluno diretamente no popup de agendamento e na tela de Detalhes.
  - **Fix de Tipagem**: Resolvido erro de ambiguidade de Join (`profiles!student_id`) e nulidade de IDs no TypeScript.
- **Correção de UI (29/04/2026) 🎨**:
  - **Scroll Interno (Scheduling Modal)**: Implementado comportamento de scroll interno no modal de agendamento, resolvendo o problema de "vazamento" em telas menores.
  - **Rodapé Fixo**: Botões de ação ("Confirmar Agenda" / "Cancelar") agora permanecem fixos na base do modal para melhor acessibilidade.
  - **Responsividade**: O modal agora respeita os limites da viewport (`max-height: 95vh`), garantindo usabilidade em qualquer dispositivo.

---

### Fase 9: A Grande Gamificação & Foco do Aluno (29/04/2026) 🏆
- **O Tabuleiro Mágico ("Meu Caminho")**:
  - Transformação da lista "Meu Caminho" em um autêntico tabuleiro S-Curve (estilo jogo de tabuleiro).
  - O "Buddy" (Avatar equipado do aluno) avança dinamicamente pelas casas, pousando sempre na primeira casa pendente.
  - Alertas visuais e broncas do Sensei se o aluno pular tarefas e deixar "buracos" para trás.
  - Navegação "1-Click": Clicar na casa da missão leva direto ao exercício.
- **Sistema Híbrido de Baús (Moedas)**:
  - A cada 8 etapas, o sistema injeta um Baú de Recompensa.
  - **Baú de Prata**: Ao chegar na casa, o aluno ganha 20 moedas (mesmo se pulou algo).
  - **Baú de Ouro**: Se as 8 casas anteriores estiverem 100% completas, o baú evolui pagando +50 moedas totais.
- **Revisão Espaçada Explícita (SRS)**:
  - Criação da aba "A Magia da Revisão" no manual do caminho, explicando a Curva de Ebbinghaus e os dias (1, 5, 10, 16, 25).
  - Tooltips de ajuda `[?]` nos minicards e penalidade inteligente de moedas (100% no prazo, 50% em atraso, 0 se perder a janela).
  - Mensagem especial do Sensei ativada automaticamente quando a tarefa atual for de revisão.
  - Modal adaptado com responsividade extrema (`max-height: 90vh` e `overflow-y` interno).
- **Linha do Tempo de Foco (Activities Timeline)**:
  - Nova página `/dashboard/minhas-atividades` que substitui o antigo botão "Ver tudo" da agenda.
  - Um algoritmo cronológico inteligente que mostra exatamente o recorte do momento de vida do aluno: **15 tarefas passadas** e **34 futuras**.
  - Auto-scroll automático focando o centro da tela na Atividade Atual (First Pending).
  - Totalmente acoplado ao motor global de **Temas (Mercado Destrave)** via variáveis CSS.

---

### Fase 10: UX Pro Max & Hub de Atividades (06/05/2026) ✅
- **Reorganização de Navegação (Sidebar)**:
  - **Professor**: Consolidado em 4 grupos (Gestão, Pedagógico, Configurações, Mercado).
  - **Aluno**: Consolidado em 3 grupos (Minha Jornada, Recursos, Mercado).
  - **Limpeza Visual**: Removidos links individuais de ferramentas do sidebar, reduzindo a carga cognitiva.
- **Hub de Atividades (Central de Criação)**:
  - Implementado painel de "Acesso Rápido" no topo da Central de Atividades.
  - 5 cards vibrantes com gradientes para: Draw, Escuta, MRP, Cards e 1.0.
  - Botão "Criar Nova" direto para cada gerador de IA.
- **Refinamento de Agenda & Presença**:
  - **Context Menu Fix**: Corrigido clipping (z-index/overflow) nas ações da agenda.
  - **Remarcação Flexível**: Adicionado campo de Data no modal de agendamento, permitindo trocar o dia da aula sem precisar excluir e criar outra.
  - **Confirmação Educativa**: Mensagem de falta agora explica claramente o reset do Streak (🔥) e a perda temporária de bônus, incentivando a presença.
- **Auditoria de Gamificação**:
  - Removido texto obsoleto de penalidade de 20 moedas no Manual da Jornada (`AdventureRoadmap.tsx`).
  - Validado no backend que não há subtração de moedas por inatividade, apenas bloqueio de novos ganhos.

- [x] **Módulo Financeiro (Gestão & Inteligência) (07/05/2026) 💰:**
    - [x] **Contratos Flexíveis**: Implementado suporte a 3 modelos de cobrança (Mensalidade Fixa, Pacotes de Aulas e Aulas Avulsas).
    - [x] **Configuração de Pacotes**: Nova funcionalidade de "Data de Início do Ciclo" para pacotes, permitindo que o sistema conte aulas automaticamente a partir de um marco inicial.
    - [x] **Automação de Cobrança**: 
        - [x] Geração automática de mensalidades no primeiro dia do mês.
        - [x] Geração automática de novo pacote quando o limite de aulas (4, 8, 12) é atingido.
    - [x] **Dashboard Financeiro (Professor)**:
        - [x] Métricas de Faturamento Mensal, Pendente e Atrasado.
        - [x] Navegação por meses independentes.
        - [x] Ações rápidas: Marcar como Pago, Reverter Pagamento (Undo) e Lembrete via WhatsApp.
    - [x] **"Smart Ledger" (Security Guard)**:
        - [x] Middleware global que bloqueia o acesso do aluno se houver pendências com mais de 30 dias de atraso.
        - [x] Tela de bloqueio personalizada com instruções de regularização.
    - [x] **Infraestrutura SQL**: Criada tabela `payments` com RLS e novas colunas financeiras na tabela `students`.
    - [x] **Refinamento & Controle (08/05/2026) 🛠️**:
        - [x] **Fim da Auto-geração Indesejada**: Removida a criação automática de cobranças no simples ato de visualizar o painel.
        - [x] **Botão "Gerar Mensalidades"**: Implementada funcionalidade manual e explícita para gerar as cobranças do mês atual de forma controlada.
        - [x] **Precisão de Datas**: Corrigido o bug de "vazamento" entre meses (bleeding) usando cálculo dinâmico de fim de mês.
        - [x] **Exclusão Individual**: Adicionado botão de exclusão de cobranças com popup de confirmação de segurança.
        - [x] **Fix de Tipagem**: Resolvidos erros de TypeScript na nova API de geração de mensalidades.

---

---

### Fase 11: Refinamento Pedagógico & Visualização (11/05/2026) ✅
- **Interpretador do Registro do Sensei**:
    - [x] Implementado `formatNotes` no `StudentDetail.tsx`.
    - [x] O sistema agora decodifica automaticamente o JSON salvo na marcação de presença.
    - [x] Visualização premium com ícones para Engajamento (🔥), Duração (⏱️) e Próximo Passo (🎯).
    - [x] Compatibilidade garantida para registros de texto simples (Fallback).


### Fase 12: Otimização de Navegação & Agenda Inteligente (12/05/2026) ✅
- [x] **Meu Caminho (Roadmap) 2.0**:
    - [x] **Navegação por Capítulos**: Divisão da trilha em blocos de 9 etapas (8 missões + 1 baú) para eliminar o scroll infinito.
    - [x] **Foco Automático**: O sistema agora abre o capítulo onde o aluno está atualmente (Active Node).
    - [x] **Responsividade Mobile**: Implementada "Linha Reta Vertical" centralizada para celulares, garantindo visibilidade total dos nós.
    - [x] **UI Minimalista**: Remoção de elementos decorativos poluentes para foco total na jornada.
- [x] **Agenda Unificada (SRS + Aulas)**:
    - [x] **Integração de Revisões**: O calendário agora exibe automaticamente as missões de revisão (SRS) programadas.
    - [x] **Badge Científico**: Identificação visual clara ("SRS Científico") e priorização no topo da lista diária.
    - [x] **Filtro Dinâmico**: Botão para mostrar/esconder revisões, permitindo que o aluno alterne entre visão de compromissos e visão de estudos.
    - [x] **Navegação Direta**: Atalho "Ver no Mapa" dentro do evento da agenda para execução imediata da atividade.
- [x] **Correções Técnicas**:
    - [x] **Fix de Tipagem**: Resolvido erro de prop `activePath` no layout financeiro.
- [x] **Refinamento do Módulo MRP (29/05/2026)**:
    - [x] **Geração Dinâmica de IA**: O gerador do MRP agora respeita o modo "Discursiva", instruindo a IA a não criar múltiplas escolhas e focando apenas no gabarito.
    - [x] **Revisão Aprimorada**: A tela de revisão (`ReviewScreen`) exibe claramente o "Gabarito" quando a missão é gerada no formato discursivo.
    - [x] **Jogo (GameScreen)**: Input de texto nativo validado e operante para testes práticos e auto-avaliação do aluno.

---

### Fase 13: Edição de Revisão & Layout Fix (30/05/2026) ✅
- [x] **Fix de Layout — Destrave Draw 🎨:**
    - [x] **Menu Direito (Efeitos):** Aumentada margem direita (`md:right-8 lg:right-10`) para evitar sobreposição com a scrollbar no Windows.
    - [x] **Menu Esquerdo (Ferramentas):** Adicionado `max-height: calc(100vh - 120px)` para evitar que a toolbar ultrapasse os limites verticais da tela.
- [x] **Revisão Editável — Destrave MRP 🎭:**
    - [x] **Estado Editável Local:** `ReviewScreen.tsx` reescrito com `editableQuestions` em vez de props read-only.
    - [x] **Edição Inline:** Botão ✏️ por card ativa campos editáveis para Cenário, Tarefa, Dica, Alternativas e Gabarito.
    - [x] **Seleção de Resposta Correta:** Botão circular verde ao lado de cada alternativa permite trocar a resposta certa.
    - [x] **Deleção de Cenários:** Botão 🗑️ remove a questão inteira da lista.
    - [x] **Propagação de Edições:** `MrpApp.tsx` atualizado para que `onSave` e `onStartGame` recebam as questões editadas.
- [x] **Revisão Editável — Destrave Escuta 🎧:**
    - [x] **Estado Editável Local:** `EscutaReview.tsx` reescrito com namespacing CSS (`esc-rv-*`) para evitar conflitos com estilos globais.
    - [x] **Edição Inline:** Botão ✏️ por card ativa campos editáveis para Frase Japonesa, Dica e Alternativas.
    - [x] **Seleção de Resposta Correta:** Botão circular verde ao lado de cada alternativa permite trocar o `correct_index`.
    - [x] **Deleção de Questões:** Botão 🗑️ remove a questão inteira.
    - [x] **Fix de Roteamento:** Corrigido `useEffect` em `EscutaApp.tsx` que sobrescrevia o status `REVIEW` com `PLAYING` quando `editingId` estava presente.
    - [x] **Propagação de Edições:** `EscutaApp.tsx` atualizado para que `onSave` e `onStartGame` recebam as questões editadas.
- [x] **Melhoria UX — Destrave Lego 🧩:**
    - [x] **Avanço Manual:** Aluno agora tem controle total sobre quando avançar para a próxima etapa (botão "Próximo" explícito).
    - [x] **Sistema de Pular (Show Answer):** Após 2 tentativas erradas, botão "Pular" é exibido. Ele organiza a frase e permite visualizar a resposta correta sem pontuar.
- [x] **Módulo Destrave Kana 🎐:**
    - [x] **Animação Yōon (Sílabas Compostas):** O componente KanaDraw agora suporta processamento e animação SVG de múltiplos caracteres simultaneamente com escala dinâmica (ViewBox adaptável).
    - [x] **Liberação Total de Famílias:** Removida a limitação de Fase 1; todas as 18 lições de Hiragana e Katakana (incluindo Yōon, Dakuten e Handakuten) estão operantes com traçado interativo.
    - [x] **Higienização do Dicionário AI:** Correção e limpeza massiva do `KANA_TO_ROMAJI` e da base do gerador, blindando o prompt do Gemini contra textos misturados.

---

## ⏭️ Próximos Passos (Estratégico & Sugestões)

1. 💰 **Consolidação Financeira & Gestão**:
   - **Painel de Controle de Pacotes**: Interface para acompanhar o consumo de aulas de cada aluno em tempo real.
   - **Emissão de Recibos**: Geração de PDF para pagamentos confirmados.
   - **Smart Ledger**: Ativação total da trava de segurança para inadimplência > 30 dias.

2. 📈 **Retenção & Analytics (Experiência do Aluno)**:
   - **Dashboard de Evolução Visual**: Gráficos de linha mostrando o crescimento de XP e frequência de aulas por mês.
   - **Analytics para o Sensei**: Painel para identificar dificuldades recorrentes da turma (Kanjis/Gramática).

3. 🔔 **Comunicação & Engajamento**:
   - **Automação Pós-Aula (WhatsApp)**: Envio automático de resumo da aula (Engajamento + Tópicos + Próximo Passo) via API após o log de presença.
   - **Alertas In-App**: Notificações para missões críticas e vencimento de revisões SRS.

4. ✍️ **Novos Motores Pedagógicos**:
   - **Escrita (Handwriting)**: Reconhecimento de escrita de Kanjis.
   - **Fala (Speech-to-text)**: Prática de conversação com IA.

---

- **Astro Server Mode:** O sistema foi configurado com `output: 'server'` no `astro.config.mjs`.
- **Admin Auth Client:** A criação de alunos utiliza um cliente administrativo (`supabaseAdmin`).
- **Tipagem Centralizada:** Modelos em `src/types/supabase.ts`.

