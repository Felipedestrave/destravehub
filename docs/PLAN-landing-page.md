# Plano de Implementação — Landing Page de Captação & Teste A/B

Este plano detalha a criação da nova Landing Page de captação de leads com suporte a Testes A/B, integrada à base de dados do Destrave Hub, além das evoluções no painel do Sensei para gestão dos leads.

---

## 🎯 Critérios de Sucesso
- [ ] Nova rota `/quero-destravar` (ou `/lp`) carregando perfeitamente, sem barra de navegação global (zero pontos de fuga).
- [ ] Rotação aleatória de Headline/Subheadline (A, B, C) persistida no `localStorage`.
- [ ] Registro assíncrono de visualização da variante escolhida no banco de dados (`landing_page_impressions`).
- [ ] Cadastro do lead via formulário registrando dados na tabela `students` com `metadata: { is_lead: true, status: 'Novo', ab_variant: 'X', ... }`.
- [ ] Redirecionamento automático do usuário após cadastro para o WhatsApp do Felipe Sensei com mensagem personalizada pré-preenchida.
- [ ] Painel do Sensei (`/dashboard/leads`) atualizado para exibir e filtrar leads por origem (Landing Page vs. Outros), nível de japonês, variante A/B de captura, e alteração de status.
- [ ] Correção do link do WhatsApp no painel administrativo para suportar DDIs internacionais (`+55` e `+81`) dinamicamente.
- [ ] Compilação de produção e linting sem erros (`npm run build`).

---

## 🛠️ Stack Tecnológica
- **Astro (SSR):** Roteamento nativo e renderização híbrida rápida para excelente performance e SEO.
- **Tailwind CSS v4:** Estilização utilitária de alto desempenho para a nova página.
- **React (com Hooks):** Lógica interativa do formulário de captura e da listagem de leads no painel administrativo.
- **Framer Motion:** Animações interativas de scroll com os mascotes da plataforma.
- **Supabase (PostgreSQL):** Persistência dos leads na tabela `students` e das métricas na nova tabela `landing_page_impressions`.

---

## 📁 Estrutura de Arquivos

```plaintext
c:\Users\Felipe Kawakami\Aplicativos/
├── docs/
│   └── PLAN-landing-page.md                     # Este arquivo de planejamento
├── src/
│   ├── pages/
│   │   ├── quero-destravar.astro               # [NEW] Página da Landing Page
│   │   ├── api/
│   │   │   └── leads/
│   │   │       ├── landing-capture.ts          # [NEW] API de captura de leads da LP
│   │   │       └── log-view.ts                 # [NEW] API de log de visualizações do Teste A/B
│   ├── components/
│   │   ├── landing/
│   │   │   └── CaptureForm.tsx                 # [NEW] Formulário React com validação de DDI (+55/+81)
│   │   ├── dashboard/
│   │   │   └── LeadsList.tsx                   # [MODIFY] LeadsList evoluído com filtros e status
```

---

## 📋 Cronograma e Divisão de Tarefas

### 🗄️ Fase P0: Infraestrutura e Banco de Dados (Database Architect & Security)

#### **Tarefa P0.1: Criar Tabela de Impressões no Supabase**
- **Responsável:** `database-architect` (Skill: `database-design`)
- **Dependências:** Nenhuma.
- **Descrição:** Criar a tabela `landing_page_impressions` para registrar as visualizações de cada variante da Landing Page, garantindo que não tenhamos poluição de dados e mantendo as políticas de RLS ativas.
- **INPUT:** Acesso ao console do Supabase (SQL Editor).
- **OUTPUT:** Execução do script SQL de criação da tabela.
  ```sql
  create table public.landing_page_impressions (
      id uuid default gen_random_uuid() primary key,
      variant text not null check (variant in ('A', 'B', 'C')),
      visitor_id uuid not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- RLS Policies
  alter table public.landing_page_impressions enable row level security;

  create policy "Permitir inserções públicas na tabela de impressões"
  on public.landing_page_impressions for insert
  with check (true);

  create policy "Permitir leitura apenas para professores autenticados"
  on public.landing_page_impressions for select
  to authenticated
  using (true);
  ```
- **VERIFY:** Consultar se a tabela existe via Supabase e confirmar que políticas de RLS estão habilitadas e configuradas.

---

### 🌐 Fase P1: Infraestrutura de APIs (Backend)

#### **Tarefa P1.1: Criar API de Registro de Visualizações**
- **Responsável:** `backend-specialist` (Skill: `api-patterns`)
- **Dependências:** `Tarefa P0.1`
- **Descrição:** Implementar a rota `/api/leads/log-view.ts` para receber `variant` (A, B ou C) e `visitorId`, gravando as métricas no banco de dados.
- **INPUT:** Nova rota Astro em [src/pages/api/leads/log-view.ts](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/pages/api/leads/log-view.ts).
- **OUTPUT:** Arquivo criado gravando na tabela `landing_page_impressions`.
- **VERIFY:** Fazer uma requisição POST de teste usando um script temporário e verificar se o registro é gravado na tabela do Supabase.

#### **Tarefa P1.2: Criar API de Captura de Leads**
- **Responsável:** `backend-specialist` (Skill: `api-patterns`)
- **Dependências:** `Tarefa P0.1`
- **Descrição:** Implementar a rota `/api/leads/landing-capture.ts` para receber dados do formulário de captação (nome, whatsapp qualificado, nível de japonês, variante ativa) e cadastrá-lo como estudante com metadados estruturados: `{ is_lead: true, origin: 'landing_page', status: 'Novo', ab_variant: '...' }`.
- **INPUT:** Nova rota Astro em [src/pages/api/leads/landing-capture.ts](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/pages/api/leads/landing-capture.ts).
- **OUTPUT:** Arquivo criado gravando o estudante e retornando sucesso.
- **VERIFY:** Chamar a API e verificar se o lead é devidamente cadastrado no banco com os metadados corretos.

---

### 🎨 Fase P2: Interface da Landing Page (Frontend)

#### **Tarefa P2.1: Desenvolver Componente React do Formulário de Captura**
- **Responsável:** `frontend-specialist` (Skill: `frontend-design`)
- **Dependências:** Nenhuma.
- **Descrição:** Criar o componente `CaptureForm.tsx` com input de nome, seletor de DDI (+55 Brasil / +81 Japão) com máscaras de validação específicas de telefone, e dropdown de nível de japonês.
- **INPUT:** Novo componente [CaptureForm.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/landing/CaptureForm.tsx).
- **OUTPUT:** Componente interativo com feedback de erro e envio dos dados para a API `landing-capture.ts`.
- **VERIFY:** Renderizar e interagir com o componente, validando a digitação de números de celular do Brasil e Japão.

#### **Tarefa P2.2: Implementar a Rota Astro `/quero-destravar`**
- **Responsável:** `frontend-specialist` (Skill: `frontend-design` & `react-best-practices`)
- **Dependências:** `Tarefa P1.1`, `Tarefa P1.2`, `Tarefa P2.1`
- **Descrição:** Criar a página de captura em [quero-destravar.astro](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/pages/quero-destravar.astro) utilizando Tailwind CSS v4 para estilização dark-mode premium.
  - Implementar lógica do Teste A/B no cliente (`localStorage` para persistência).
  - Integrar os mascotes animados na margem com Framer Motion (`tanuki-novato.png` na seção de dor, `ashigaru.png` no método ativo, `sensei.png` na gamificação).
  - Incluir o player do YouTube em destaque.
  - Ocultar navbar geral.
  - Integrar o `CaptureForm.tsx` no final.
- **INPUT:** Novo arquivo [quero-destravar.astro](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/pages/quero-destravar.astro).
- **OUTPUT:** Landing page visualmente impecável e responsiva.
- **VERIFY:** Acessar `/quero-destravar` e testar interações de scroll, carregamento A/B aleatório e fluxo de cadastro.

---

### 📊 Fase P3: Evolução do Painel Administrativo de Leads

#### **Tarefa P3.1: Atualizar Listagem e Filtros em LeadsList.tsx**
- **Responsável:** `frontend-specialist` (Skill: `frontend-design`)
- **Dependências:** `Tarefa P1.2`
- **Descrição:** Atualizar o componente [LeadsList.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/dashboard/LeadsList.tsx):
  - **Filtro de Origem:** Permitir separar Leads de "Landing Page" (`metadata->>origin = 'landing_page'`) de "Atividade Compartilhada".
  - **Coluna de Nível:** Exibir o nível (`student.level`).
  - **Tag do Teste A/B:** Mostrar uma badge visual com o valor do teste (`metadata->>ab_variant`).
  - **Status do Lead:** Permitir alterar o status do lead (Novo, Contatado, Fechado, Arquivado) salvando o valor em `metadata.status` do banco através de uma atualização no Supabase.
  - **WhatsApp Internacional:** Ajustar formatação do link do WhatsApp para remover o prefixo rígido `55` se o lead contiver o DDI `+81` ou outro no número.
- **INPUT:** Edição de [LeadsList.tsx](file:///c:/Users/Felipe%20Kawakami/Aplicativos/src/components/dashboard/LeadsList.tsx).
- **OUTPUT:** Painel administrativo com controle total sobre os novos leads.
- **VERIFY:** Acessar o painel administrativa de leads no sistema e validar os filtros e o link de chat do WhatsApp.

---

## 🏁 PHASE X: Plano de Verificação Final

Após a implementação de todas as tarefas, as seguintes ações e scripts automatizados deverão ser executados:

1. **Compilação e Tipo:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. **Segurança:**
   ```bash
   python .agent/scripts/checklist.py .
   ```
3. **Estilos e Acessibilidade (UX/UI):**
   - Verificar ausência de cores fora da paleta aceita (sem violação de regras).
   - Testar o comportamento responsivo em telas menores (Mobile).
   - Validar que o DDI +81 gera redirecionamento para o WhatsApp sem erro de prefixo `55`.
