# 🗺️ Plano de Implementação: Destrave Hub

Este plano detalha a construção do ecossistema Destrave Hub, priorizando a qualidade da geração de exercícios por IA e a arquitetura híbrida de acesso para alunos (Dashboard + Link Único).

## 🎯 Objetivos de Curto Prazo
1. Estabelecer a base **Astro 5.0** com o Design System **Ice Meta**.
2. Configurar o **Supabase** (Auth e Banco de Dados) para gestão de professores e alunos.
3. Desenvolver o motor de IA (**Gemini Flash**) focado na qualidade pedagógica.
4. Implementar o fluxo de "Destrave a Escuta" (Processamento de áudio/PDF).

---

## 🏗️ Fase 1: Fundação & Infraestrutura (The Hub Shell)
**Foco:** Estabelecer a identidade visual e o núcleo de autenticação.

- [ ] **Setup do Projeto:** Inicializar Astro 5.0 com Tailwind CSS e React 19.
- [ ] **Design System Ice Meta:** Criar tokens de cores (`#F3F7FA`, `#58317E`, `#FF7F32`, `#E2E8F0`) e estados interactivos (hovers/sombras). Configurar tipografia (Outfit, Inter, Noto Sans JP).
- [ ] **Supabase Core:**
    - Esquema de tabelas: `profiles`, `students`, `activities`, `assignments`.
    - Políticas de RLS para garantir que um professor só veja seus alunos.
- [ ] **Landing Page Premium:** Implementar a página de conversão com estilo "Cyber-Minimalist".

---

## 🧠 Fase 2: Motor de IA & Destrave a Escuta
**Foco:** Garantir que a IA gere exercícios de alta qualidade pedagógica.

- [ ] **Integração Gemini Flash 2.5:** Criar camadas de "Prompt Engineering" para estruturar a saída da IA (JSON estável).
- [ ] **Processamento de Contexto:** 
    - Implementar parser de PDF para extração de vocabulário e gramática.
    - Sistema de "Memory Context": A IA deve saber o nível do aluno (N5-N3) ao gerar o exercício.
- [ ] **Pipeline de Áudio:** Sincronização de texto e fala utilizando tempo real (requestAnimationFrame) no módulo de escuta.
- [ ] **Geração de Exercícios:** Criar validadores de qualidade para os exercícios gerados antes de apresentá-los ao professor.

---

## 🎓 Fase 3: Portal do Professor & Atribuição Híbrida
**Foco:** Gestão de alunos e o fluxo de envio de atividades.

- [ ] **Dashboard do Professor:** Listagem de alunos e status das atividades enviadas.
- [ ] **Módulo de Atribuição:**
    - Fluxos para **Alunos Cadastrados:** Persistência no BD e notificação no Dashboard do aluno.
    - Fluxos para **Alunos Experimentais:** Geração de UUID/Link único que armazena progresso temporário via LocalStorage e metadados no Supabase.
- [ ] **Interface de Revisão:** Ferramenta para o professor editar o que a IA gerou antes de "enviar o desbloqueio".

---

## 🎭 Fase 4: Portal do Aluno & Mini-Apps
**Foco:** Experiência do usuário final e conclusão do MVP.

- [ ] **Portal do Aluno (Dashboard):** Lista de "Missões" recebidas.
- [ ] **Módulo de Mini-Apps (Islands):**
    - Implementação base do **Destrave a Escuta** (Audio/Text sync).
    - Implementação base do **MRP** (Roleplay com feedback imediato).
- [ ] **Sistema de Feedback:** Captura de respostas e retorno pedagógico automático via IA.

---

## ✅ Critérios de Verificação (Checklist)

| Fase | Critério de Sucesso |
|------|-------------------|
| **Fundação** | Login único funcionando e UI seguindo o "Ice Meta". |
| **IA** | Geração de um exercício coerente a partir de um PDF de japonês N4 em < 5s. |
| **Atribuição** | Link único abre exercício sem logar; Aluno logado vê no painel. |
| **Performance** | Carregamento da página inicial com score > 90 no Lighthouse. |

---

## 🛠️ Atribuição de Agentes
- **@frontend-specialist:** UI/UX, Design System, Astro Islands e Landing Page.
- **@backend-specialist:** Supabase Schema, RLS, Edge Functions e Integração Gemini.
- **@orchestrator:** Coordenação de fluxos e integração entre mini-apps.
