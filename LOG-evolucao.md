# 📝 Log de Evolução - Destrave Hub

## 📅 Data: 06/08/2026

### 🚧 Ponto de Parada Atual (RETOMAR AQUI):
1. **Realizar Downgrade no Painel:**
   * Fazer o downgrade do projeto no painel do Supabase para o plano gratuito (Free Tier). O bucket `materials` foi totalmente esvaziado, eliminando qualquer risco de cobrança extra ou estouro de cota de armazenamento/egress.

### ✅ Implementado nesta sessão:
1. **Limpeza Completa do Bucket `materials` no Supabase Storage:**
   * Criado e executado o script [empty-supabase-storage.js](file:///c:/Users/Felipe%20Kawakami/Aplicativos/scripts/empty-supabase-storage.js) com suporte a paginação de múltiplos lotes via API.
   * Removidos com sucesso todos os **421 arquivos residuais** (~745 MB), deixando o bucket totalmente com **0 bytes**.
   * Validado que apenas o bucket `avatars` (1.8 MB) permanece em uso de storage no Supabase, o que está muito abaixo da cota gratuita de 1 GB.
2. **Ajuste de Fontes e Peças de Lego no Destrave 2.0:**
   * Atualizado o componente [Destrave2Player.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/destrave2/Destrave2Player.tsx) para aumentar o tamanho das fontes (de `text-sm` para `text-2xl`), romaji e paddings das peças de Lego, igualando a visualização de monte-a-frase ao aplicativo de Lego original.
3. **Consolidação de Toasts de Revisão (SRS):**
   * Ajustado o componente [SRSManager.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/student/SRSManager.tsx) para consolidar alertas de repetição acumulados. O aluno agora recebe apenas 1 toast contendo a soma das revisões disponíveis no login, eliminando o cascateamento visual de pop-ups.

---

## 📅 Data: 22/07/2026

### 🚧 Histórico da Limpeza e Downgrade:
1. **Esvaziar o bucket `materials`:** [x] Concluído em 06/08/2026.
2. **Downgrade no painel do Supabase:** [ ] Aguardando ação do usuário (fim do faturamento já pago próximo ao dia **18 de Agosto de 2026**).

### ✅ Implementado nesta sessão:
1. **Correção e Resiliência no Upload do R2 (Vercel):**
   * Configuração das variáveis de ambiente do Cloudflare R2 no painel da Vercel (`CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_BUCKET_NAME` e `PUBLIC_CLOUDFLARE_R2_PUBLIC_URL`).
   * Refatorado o arquivo [r2.ts](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/lib/r2.ts) para ler as variáveis dinamicamente via `process.env` como fallback (evitando falhas caso as variáveis do Astro `import.meta.env` não fossem embutidas no build).
   * Validado o deploy e resolvido o erro `No value provided for input HTTP label: Bucket` ao fazer upload de arquivos na plataforma.

---

## 📅 Data: 21/07/2026

### ✅ Implementado nesta sessão:
1. **Migração do Armazenamento para Cloudflare R2:**
   * Instalado SDK do AWS S3 e configurado o cliente R2 em [r2.ts](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/lib/r2.ts).
   * Criadas as APIs de backend `/api/materials/upload-r2` e `/api/materials/delete-r2`.
   * Refatorados os componentes [MaterialsManager.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/materials/MaterialsManager.tsx), [MaterialsDrawer.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/materials/MaterialsDrawer.tsx), [MaterialLinkModal.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/materials/MaterialLinkModal.tsx) e [DrawApp.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/draw/DrawApp.tsx) para usar o Cloudflare R2 para uploads/visualizações.
   * Criado e executado o script de migração [migrate-to-r2.js](file:///c:/Users/Felipe%20Kawakami/Aplicativos/scripts/migrate-to-r2.js) que enviou **80 arquivos locais** com sucesso para o R2 (0 falhas).
   * Criado e executado o script [migrate-activities-urls.js](file:///c:/Users/Felipe%20Kawakami/Aplicativos/scripts/migrate-activities-urls.js) que migrou com sucesso todas as **35 atividades** do banco de dados contendo referências antigas do Supabase Storage para apontar para as novas URLs do Cloudflare R2.
   * Criado e executado o script [migrate-lesson-images-to-r2.js](file:///c:/Users/Felipe%20Kawakami/Aplicativos/scripts/migrate-lesson-images-to-r2.js) que transferiu com sucesso **346 imagens de slides (pasta `lesson-images`)** do Supabase Storage diretamente para o Cloudflare R2 (0 falhas).
   * Validado build de produção com sucesso (`npm run build`).

---

## 📅 Data: 19/07/2026

### 🚧 Histórico do Bloqueio de Cota de Tráfego do Supabase:
* **Problema:** O projeto atingiu o limite gratuito de 2 GB de egress e foi bloqueado.
* **Plano de Resolução Aprovado:** Desbloqueio temporário (Pro) -> Migração de mídias para R2 -> Atualização no Banco de Dados -> Limpeza e Downgrade (concluído nesta sessão de 21/07/2026).

---

## 📅 Data: 29/04/2026

### ✅ Implementado nesta sessão:
1.  **Unificação do Fluxo de Alunos (Cadastro/Edição):**
    *   **Página Híbrida:** A página `/dashboard/students/new` agora detecta automaticamente o modo "Edição" via parâmetros de URL.
    *   **Refatoração do Formulário:** O componente `AddStudentForm.tsx` foi reconstruído para suportar operações de **CREATE** e **UPDATE**, buscando dados automaticamente para edição.
2.  **Suporte a WhatsApp Internacional:**
    *   **Campo Inteligente:** Adicionado seletor de país (Brasil 🇧🇷 / Japão 🇯🇵) no formulário de aluno.
    *   **Máscara Dinâmica:** Implementação de máscaras de telefone customizadas para os dois países (`(99) 99999-9999` e `99 9999-9999`).
    *   **Padronização E.164:** Números são salvos com o DDI correspondente para facilitar futuras integrações de notificação.
3.  **Infraestrutura de API:**
    *   **Novo Endpoint:** Criado `/api/admin/update-student.ts` para lidar com atualizações de perfil e credenciais via Supabase Admin.
    *   **Sincronização de Perfil:** Atualização automática do campo `whatsapp` na tabela `profiles` ao editar ou criar um aluno.

---

### 🚧 Ponto de Parada Atual (RETOMAR AQUI):
1.  **Teste de Notificações via WhatsApp:**
    *   **Próxima Ação:** Validar se os números salvos no formato internacional estão prontos para integração com serviços de mensagem (Evolution API ou similar).
2.  **Resolução do erro 500/503 na geração de exercícios:**
    *   **Status:** Monitorar estabilidade do Gemini-2.5-flash com a nova lógica de retry.
    *   **Contexto:** Chave da Gemini antiga foi comprometida e trocada na Vercel (resolvido erro 500 inicial).
    *   **Status Atual:** O modelo `gemini-2.5-flash` estava apresentando instabilidade (503 UNAVAILABLE - High Demand).
    *   **Solução em deploy:** Foi implementado `withRetry` com *Exponential Backoff* nas rotas `validate-answer`, `generate-questions`, `generate-deck`, etc., para retentar automaticamente quando a API do Gemini der 503.
    *   **Próxima Ação Imediata:** Assim que o usuário voltar, confirmar se o sistema está gerando os flashcards e exercícios de Escuta corretamente com a nova estrutura de retry na Vercel.

---

## 📅 Data: 16/04/2026

### ✅ Implementado nesta sessão:
1.  **Sistema de Pastas "Drive-style" para Atividades:**
    *   Implementação de hierarquia de pastas (multi-nível) para organizar missões.
    *   **Navegação Inteligente:** Breadcrumbs dinâmicos e busca omnidirecional.
    *   **Drag & Drop Nativo:** Organização fluida de atividades entre pastas.
2.  **Gestão de Economia (Wallet Control):**
    *   **Interface Sensei Power:** Novo painel "Central de Economia" no perfil do aluno.
    *   **Ajustes Manuais:** Botões diretos para bonificar ou debitar Destrave Coins com formulário avançado.
    *   **Histórico Auditável:** Modal em popup "Ver Tudo" exibindo todo o histórico de empenho e recebimentos/débitos do aluno.
3.  **UX / UI Avançada (Otimização Mobile):**
    *   **Overlay de Feedback (Mascote):** Lógica inteligente implementada (`BuddyView`) onde a área de exercício foca apenas no desafio quando no mobile, e o mascote só salta para o centro da tela em uma comemoração pop-up durante um acerto/erro (Estilo Duolingo).
    *   **Formulário de Captação Internacional:** Adicionado um campo customizado suspenso de Códigos de DDI (Brasil, Japão, EUA, Portugal) para captação robusta e padronizada pelo WhatsApp nos links experimentais.
4.  **Segurança e Infraestrutura:**
    *   Políticas de RLS e endpoints robustos de transação.

---

### 🚀 Próximos Passos (Planejamento Atualizado):
1.  **Algoritmo de Repetição Espaçada (Spaced Repetition System):**
    *   Implementar um sistema de recompensas progressivo voltado aos exercícios, gamificando e estimulando a prática em determinados ciclos/dias para fixar o aprendizado.
2.  **Expansão de Conteúdo:**
    *   Ampliar o número de atividades e exercícios conforme o projeto original.
3.  **Sistema Financeiro:**
    *   Integrar ferramentas financeiras (pagamentos, controle de faturamento).

---

## 📅 Data: 15/04/2026

### ✅ Implementado nesta sessão:
1.  **Redesign Premium do Calendário:**
    *   Novo layout em grade 70/30 (Calendário Mensal à esquerda / Lista de Aulas do Dia à direita) para melhor fluxo de trabalho do professor.
    *   Interface responsiva com cards de aula detalhados e menu de contexto para ações rápidas.
2.  **Gamificação de Presença & Streak:**
    *   Sistema de "Marcar Presença" integrado ao calendário.
    *   **Lógica de Recompensa:** O aluno ganha 10 Destrave Coins base + 1 coin por aula consecutiva (streak), limitado a 20 coins por presença.
    *   Atualização automática de XP e saldo de moedas via RPC seguro.
3.  **Segurança de Materiais (Backstage Mode):**
    *   Transição para o modelo **Privado por Padrão**. Arquivos submetidos pelo professor não são mais públicos por padrão.
    *   **Compartilhamento Automático:** Materiais vinculados a exercícios/missões são compartilhados automaticamente com os alunos que possuem a missão designada.
    *   Sinalização visual (badges) para distinguir materiais Privados de Compartilhados.
4.  **Log de Sessão Pedagógico (Histórico da Aula):**
    *   Modal multi-abas para registro pós-aula:
        *   **Resumo:** Tópicos cobertos, nível de engajamento, duração real e notas internas.
        *   **Materiais:** Seleção rápida da biblioteca privada para compartilhamento instantâneo.
        *   **Plano da Próxima:** Registro da programação futura vinculado ao histórico do aluno.
5.  **Sincronização Aluno/Professor:**
    *   Atualização das políticas de segurança (RLS) no Supabase para garantir que alunos vejam seus agendamentos e históricos de forma privada e segura.
    *   Correção no componente `StudentHistory` para exibir os novos logs estruturados (JSON) de forma visualmente atraente.

---

## 📅 Data: 07/04/2026
*(Histórico mantido para referência)*
1.  **Redirecionamento Seguro via WhatsApp (Sensei Proxy)**
2.  **Integração com Escuta, MRP e Cards**
3.  **Painel de Configurações do Sensei**

---
**Excelente progresso hoje! O sistema agora é uma ferramenta de gestão completa e segura.** 🏯
