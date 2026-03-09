# 🏯 Destrave Hub - Project Charter & Documentation


## 📝 Visão Geral
O **Destrave Hub** é um ecossistema educacional "SaaS" (Software as a Service) focado em professores de idiomas (com especialização inicial em Japonês). A plataforma funciona como um marketplace de ferramentas de autoria e mini-apps gamificados, permitindo que professores gerenciem seus alunos particulares, atribuam exercícios personalizados e acompanhem o progresso através de inteligência artificial de ponta.

---


## 🛠️ Stack Tecnológica Global (The Engine)
Toda a suíte compartilha uma arquitetura moderna para garantir portabilidade e performance:
- **Frontend Core:** Astro 5.0 + React 19 (Islands Architecture).
- **Estilização:** Tailwind CSS (Estética Cyber-Dark / Minimalist Premium).
- **Inteligência Artificial:** Google Gemini SDK (Flash 2.5/3, Pro, Vision, Native Audio/TTS).
- **Backend & Auth:** Supabase (PostgreSQL) com RLS (Row Level Security).
- **Performance:** Arquitetura de "Ilhas" (Hydration On-Demand) para carregamento instantâneo.
- **Módulos:** Arquitetura ESM via CDN/esm.sh para carregamento rápido.
- **Arquitetura de Dados:** Resiliência Híbrida (LocalStorage + Sincronização em Tempo Real).


---


## 🧩 Portfólio de Aplicações (11 Ferramentas)


### 🎨 1. Destrave Draw (Flagship)
- **Foco:** Autoria, Apresentação e Escrita.
- **Destaque:** Dual-Canvas Rendering (60 FPS), Efeito Reveal, Reações Visuais (Matsuri, Rocket) e Modo Mestre.


### 🎧 2. Destrave a Escuta
- **Foco:** Treino Auditivo Adaptativo.
- **Destaque:** Ingestão de PDF para criar exercícios e "Vocal Acting" (IA ajusta o tom de voz conforme o cenário: hospital, casual, etc).


### 🎭 3. Destrave MRP (Mini Role Play)
- **Foco:** Prática Situacional (Saída Ativa).
- **Destaque:** Validação de "Intenção e Polidez" em vez de apenas texto; cenários gerados dinamicamente pela IA.


### 📝 4. Destrave Listening
- **Foco:** Análise e Decodificação de Áudio.
- **Destaque:** Sincronização de alta precisão (requestAnimationFrame) e Dicionário de Partículas Gramaticais.


### 🎙️ 5. Destrave Hanashi
- **Foco:** Estúdio de Produção de Áudio.
- **Destaque:** Criação de diálogos multi-personagem, suporte a SSML e exportação de áudio WAV de alta fidelidade.


### 🎞️ 6. Destrave Anime
- **Foco:** Storytelling e Engajamento.
- **Destaque:** Geração de quadrinhos de 6 quadros baseados em materiais de estudo (Shonen, Shojo, Seinen, etc).


### ✒️ 7. KanjiFlow
- **Foco:** Caligrafia e Etimologia Visual.
- **Destaque:** Animação de Stroke Order (Ordem de Traços) via SVG e geração de GIFs animados no browser.


### 📊 8. LingoQuiz Gen
- **Foco:** Avaliação e Materiais Híbridos.
- **Destaque:** Gerador de Quizzes multimodal e exportação de PDF A4 pronto para impressão (Print-Ready).


### 🧱 9. Nihongo Lego Builder
- **Foco:** Sintaxe e Estrutura de Frases.
- **Destaque:** Sistema de blocos "Lego" coloridos por classe gramatical com validação sintática via IA.


### 🔍 10. Caça-Palavras (Planejado)
- **Foco:** Alfabetização e Reconhecimento Visual de Hiragana/Katakana.


### 🃏 11. Flashcards (Planejado)
- **Foco:** Memorização de Longo Prazo via Repetição Espaçada (SRS).


---


## 🗺️ Roteiro de Integração (Roadmap)


### Fase 1: Fundação & Identidade
- Criação da **Landing Page Premium** (Venda e Valor).
- Implementação do **Central Auth** (Login único para todos os apps).
- Definição do design system compartilhado.


### Fase 2: Dashboard LMS (O Hub)
- Painel do Professor: Gestão de listas de alunos.
- Mecanismo de Atribuição: "Enviar app X para aluno Y com o contexto do PDF Z".


### Fase 3: Monitoramento de Performance
- Centralização dos relatórios gerados por cada app no perfil do aluno.
- Dashboards de precisão e engajamento.


### Fase 4: Monetização
- Implementação de planos de assinatura baseados em acessos e volume de alunos.


---


## 🎨 Design System (Aprovado)
O ecossistema utiliza uma estética **"Ice Meta"** (Light Mode), focada em clareza, profissionalismo e alta legibilidade.


### Paleta de Cores
- **Fundo (Ice White):** `#F3F7FA` - Branco gelo sutil para redução de fadiga visual.
- **Primária (Brand Purple):** `#58317E` - Identidade e autoridade.
- **Ação (Bold Orange):** `#FF7F32` - Call to Actions e destaque.
- **Suporte (Soft Lilac):** `#D1C4E9` - **Uso restrito**: Apenas para fundos de badges/etiquetas (baixo contraste para texto).
- **Texto Principal (Slate Dark):** `#1E293B` - Alta legibilidade.


### Estados Interativos & Bordas (Refinamento UX)
- **Borda Neutra:** `#E2E8F0` - Ideal para separação de cards e divisores sutis.
- **Hover Primário:** `#4C2A6D` - Versão mais profunda do Brand Purple para feedback de clique.
- **Hover Ação:** `#E66A1F` - Laranja saturado que, combinado com elevação (shadow), guia o clique.
- **Lógica de Movimento:** Transições suaves (150ms-200ms) e elevação visual via sombras para indicar interatividade.


### Tipografia
- **Títulos e UI:** `Outfit` (Visual moderno e geométrico, combinando com o logo).
- **Corpo de Texto:** `Inter` (Referência em legibilidade de interface).
- **Caracteres Japoneses:** `Noto Sans JP` (Padrão para Kanji/Kana) e `Zen Maru Gothic`.
- **Modo Estudo/Manuscrito:** `Klee One`.


---
*Documento gerado em: 18 de fevereiro de 2026*
