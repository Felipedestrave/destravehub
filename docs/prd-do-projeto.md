# PRD - Destrave Hub

## 1. Visão Geral do Produto (Product Vision)
O **Destrave Hub** é uma plataforma SaaS (Software as a Service) de gestão pedagógica e ferramentas de autoria. Ele permite que professores de idiomas transformem materiais estáticos em experiências interativas de alto impacto, utilizando Inteligência Artificial Generativa (Google Gemini) para automatizar a criação de exercícios e o acompanhamento de alunos.


### 🎯 Proposta de Valor
Eliminar a barreira entre a preparação exaustiva de aulas e o engajamento real do aluno, fornecendo ferramentas que "desbloqueiam" as habilidades de produção e compreensão linguística de forma instantânea.


---


## 2. Público-Alvo (Target Audience)
1.  **Professores de Idiomas:** Foco inicial em língua japonesa, que buscam modernizar suas aulas particulares e gerenciar múltiplos alunos de forma organizada.
2.  **Alunos Particulares:** Estudantes de nível N5 a N3 (JLPT) que precisam de prática ativa além do horário de aula.


---


## 3. Escopo do MVP (Core Features)


### 3.1. Sistema de Gestão (Hub Shell em Astro)
- **Framework Mestre:** Astro 5.0 (Orquestrador de rotas e SEO).
- **Autenticação Unificada:** Login central via Supabase para professores e alunos.
- **Portal do Professor (LMS Lite):**
    - Dashboard para visualizar todos os alunos.
    - Área de "Marketplace Interno" para acessar os 4 mini apps do MVP.
    - Sistema de Atribuição: Enviar um exercício/app específico para um aluno com parâmetros customizados.
- **Portal do Aluno:**
    - Interface limpa onde o aluno vê suas "Missões" (exercícios enviados pelo professor).


### 3.2. As 4 Aplicações do MVP (Core 4)
Para o MVP, integramos os seguintes módulos:
1.  **Destrave Draw:** Ferramenta de quadro branco para aulas síncronas com AI Audio/Visual.
2.  **Destrave MRP:** Prática de conversação situacional com validação de polidez.
3.  **Destrave a Escuta:** Treino auditivo automatizado a partir de uploads de arquivos PDF.
4.  **LingoQuiz Gen:** Gerador de avaliações com suporte a exportação de PDF A4.


---


## 4. Requisitos Funcionais (Functional Requirements)
- **RF01:** O sistema deve permitir que o professor crie uma conta e registre seus alunos.
- **RF02:** O professor deve ser capaz de fazer upload de um PDF no *Destrave a Escuta* e atribuir o resultado ao aluno X.
- **RF03:** O aluno deve receber feedback imediato da IA após completar um Roleplay no *MRP*.
- **RF04:** O sistema deve persistir o progresso e as notas dos alunos em um banco de dados centralizado.
- **RF05:** O professor deve ser capaz de exportar um gabarito em PDF através do *LingoQuiz Gen*.


---


## 5. Requisitos Não Funcionais (Non-Functional Requirements)
- **RNF01 (Performance):** A renderização de áudio e desenho deve manter 60 FPS (Dual-Canvas).
- **RNF02 (Latência):** O tempo de resposta da IA Gemini deve ser otimizado via modelos Flash para respostas em menos de 3 segundos.
- **RNF03 (Escalabilidade):** O banco de dados Supabase deve suportar o crescimento progressivo da base de usuários e o armazenamento de metadados de mídia.
- **RNF04 (UI/UX):** A interface deve seguir rigorosamente o Design System **"Ice Meta"** conforme definido no Project Charter (Fundos Ice White, Brand Purple #58317E, Bold Orange #FF7F32 e Bordas Neutras #E2E8F0).
- **RNF05 (Speed):** A Landing Page e Dashboard devem carregar em menos de 1.5s (Zero JS por padrão via Astro).


---


## 6. Stack Tecnológica
- **Orquestrador:** Astro 5.0 (SSG/SSR).
- **Componentes:** React 19 (Islands Architecture).
- **Estilização:** Tailwind CSS.
- **Backend:** Supabase (Auth, DB, Storage).
- **IA:** Google Gemini SDK (Flash 2.5/3).
- **Relatórios:** jsPDF e html2canvas.


---


## 7. Critérios de Sucesso do MVP
- Professor consegue enviar o primeiro exercício para um aluno em menos de 2 minutos.
- Aluno completa um Roleplay completo com feedback gramatical sem erros de sistema.
- A Landing Page converte o interesse do professor através da visualização do valor dos 4 apps.


---
*Status: Em Aprovação | Versão: 1.0 (MVP)*
