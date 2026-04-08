# 🚀 Manual do Sistema de Gamificação - Destrave Hub

Este documento detalha a arquitetura de engajamento e fidelização (Gamificação) para o Destrave Hub, focada em recompensar o compromisso, a precisão e a assiduidade dos alunos.

---

## 🎖️ 1. Objetivos Estratégicos
*   **Fidelização:** Recompensar a presença contínua em aulas.
*   **Engajamento:** Incentivar a prática de atividades fora e dentro de aula.
*   **Status e Reconhecimento:** Criar uma hierarquia visual (Níveis/Títulos) que gere orgulho no aluno.

---

## 💰 2. Economia Interna (Destrave Coins)

A moeda oficial do sistema será os **Destrave Coins (DC)**. O aluno acumula coins através de comportamentos positivos.

### 📈 Tabela de Ganhos (Geração de Moeda)
| Ação Pedagógica | Recompensa (DC) | Justificativa |
| :--- | :--- | :--- |
| **Completar uma Missão** | 20 DC | Estudo individual concluído. |
| **Bônus: Assertividade (100%)** | +15 DC | Foco e precisão no conteúdo. |
| **Bônus: Velocidade (Tempo Alvo)** | +20 DC | Fluidez e domínio do assunto. |
| **Presença em Aula** | **50 DC** | **Principal fator de engajamento.** |
| **Combo: 3 Aulas Seguinte** | **+100 DC** | Recompensa pela consistência. |
| **Recorde: 10 Aulas Seguidas** | **+500 DC** | Milestone de fidelidade extrema. |

> [!IMPORTANT]
> A "Presença em Aula" deve ser marcada pelo Professor através do dashboard de gestão de turma.

---

## 🛒 3. Loja Destrave (Mercado Virtual)

Os alunos gastam seus coins em itens cosméticos que personalizam seu perfil e dashboard.

### 🏛️ Tabela de Preços e Raridade
| Categoria | Comum (Trivial) | Raro (Avançado) | Épico (Exclusivo) | Lendário (Status) |
| :--- | :--- | :--- | :--- | :--- |
| **Avatares** (Perfil) | 100 DC | 400 DC | 1.200 DC | 3.000 DC |
| **Temas Visuais** (APP) | 200 DC | 600 DC | 1.500 DC | 5.000 DC |
| **Títulos Especiais** | 50 DC | 250 DC | 800 DC | 2.500 DC |

### 🎭 Exemplos de Coleções
*   **Coleção Japão Antigo:** Avatares de Samurai, Temas de Pergaminho.
*   **Coleção Cyberpunk:** Temas Neon, Avatares de Androides.
*   **Coleção Mentor:** Títulos como *"Ghost Mentor"*, *"Lacre Destravado"*.

---

## 📊 4. Progressão e Níveis (XP)

Diferente das Coins, o **XP (Experiência)** nunca diminui. Ele define o **Nível** do aluno.

*   **Cálculo de XP:** O XP é igual ao total de Coins ganhos na vida do aluno.
*   **Ranks de Título (Padrão):**
    *   Nível 1-5: **Aprendiz de Gelo**
    *   Nível 10-20: **Guerreiro de Elite**
    *   Nível 25+: **Mestre Destravado**

---

## 🏅 5. Conquistas (Badges)

Medalhas fixas que aparecem no perfil após atingir marcos históricos.

| Badge | Requisito | Visual |
| :--- | :--- | :--- |
| **Primeiro Lacre** | Completar a primeira missão. | 🥉 Bronze |
| **Flash-Speed** | Completar 10 decks no tempo alvo. | ⚡ Raio |
| **Determinação** | 10 presenças em aulas consecutivas. | 🔥 Fogo |
| **O Especialista** | Nota 100 em 5 missões seguidas. | 🎯 Alvo |

---

## 🖥️ 6. Dashboards (Visualização)

### 👨‍🎓 Área do Aluno:
*   Barra de XP no cabeçalho.
*   Ícone de Carteira (Coins).
*   Seção "Meus Inventários" (Itens comprados).
*   **Classificação Semanal (Leaderboard):** Ver posição entre os colegas de turma.

### 👨‍🏫 Área do Professor (Dashboard de Gestão):
*   Botão de **"Marcar Presença"** rápida na lista de alunos.
*   Botão **"Dar Bônus Maratona"** (Para prêmios manuais em aula).
*   Visualização de quem é o **"MVP da Semana"** (Top XP).

---

## 🛠️ 7. Notas de Implementação Técnica
*   **Banco de Dados:** Utilizar Supabase (`profiles` table) para armazenar `xp`, `coins` e `attendance_streak`.
*   **API:** Criar endpoints para `buy-item`, `check-presence` e `update-gamification-state`.
*   **UI:** Seguir fielmente o padrão **Ice Meta** com animações de vitória no final das atividades.

---
*Ultima atualização: 27 de Março de 2026*
