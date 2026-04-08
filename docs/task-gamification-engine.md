# 🚀 Task: Gamification Engine (Phase 1 & 2)

## Phase 1: Motor de Recompensas (CONCLUÍDO ✅)
### Objetivo
Implementar o motor de recompensas do Destrave Hub. O sistema deve calcular XP e Destrave Coins (DC) ao finalizar missões, persistindo esses dados na tabela `profiles` para alunos registrados.

### ✅ Status Phase 1
- [x] Planejamento
- [x] Database Migration (Tabela `profiles` com `xp`, `coins`, `inventory`)
- [x] Criar Utility `src/lib/gamification.ts`
- [x] Integrar no `save-result.ts` com RPC `increment_gamification`
- [x] Atualizar UI de Resultados (Feedback Visual em Escuta, MRP e Flashcards)
- [x] Integrar no Header do Aluno (Dashboard / MissionList)

---

## Phase 2: Mercado Destrave (CONCLUÍDO ✅)
### Objetivo
Permitir que os alunos gastem suas Destrave Coins (DC) em itens cosméticos (Avatares, Temas e Títulos) para personalizar sua experiência.

### 🎖️ Itens da Loja (Definidos)
| Categoria | Comum (100-200 DC) | Raro (400-600 DC) | Épico (1200-1500 DC) | Lendário (3000-5000 DC) |
| :--- | :--- | :--- | :--- | :--- |
| **Avatares** | Doutor de Dados | Urso Polar Articulado | Drone Reconhecimento | O Estrategista |
| **Temas** | Minimal Ice | Sakura Breeze | Midnight Tokyo | Metaverso Glacial |
| **Títulos** | Sinal Estável | Analista Fluidez | Sincronia Avanc. | Frequência Mestra |

### 🛠️ Arquitetura Técnica Phase 2
- [x] **Biblioteca de Itens**: `src/lib/store.ts` com catálogo completo.
- [x] **API de Compra**: `/api/store/purchase.ts` (Validar saldo, adicionar ao `inventory`, deduzir coins).
- [x] **Página da Loja**: `/dashboard/store` (Interface Premium Ice Meta).
- [x] **Sistema de Equipar**: Lógica para o aluno escolher qual item do inventário usar.
- [x] **Reflexão na UI**: Dashboard exibe o título equipado no cabeçalho.

---

## ✅ Status Geral
- Phase 1: 100%
- Phase 2: 100%
