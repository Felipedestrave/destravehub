# 🃏 Task: Destrave Flashcards

## Objetivo
Implementar o mini app Destrave Flashcards no Destrave Hub. O professor gera decks inteligentes com IA a partir do conteúdo da aula, revisa/edita os cards no "Estúdio de Aprovação" e só então salva o deck no sistema.

---

## Fluxo do Professor

```
[DeckGenerator] → [LOADING] → [ReviewStudio] → [SAVED]
   (Upload/Texto)    (Gemini)   (Editar/Aprovar)  (Persistido)
```

## Fluxo do Aluno (Futuro)
```
[CardViewer] → (Fácil / Médio / Difícil) → [Resultado SRS]
```

---

## Arquitetura

### Types (`src/types/flashcards.ts`)
- `Flashcard` — frente, verso, leitura (furigana), exemplo
- `FlashDeck` — título, nível, lista de cards
- `FlashcardStatus` — `'GENERATE' | 'LOADING' | 'REVIEW' | 'SAVED'`

### API Routes (`src/pages/api/flashcards/`)
- `generate-deck.ts` — POST: Recebe texto/contexto + nível → Gemini retorna array de Flashcard
- `save-deck.ts` — POST: Salva deck aprovado na tabela `activities` (config: JSON)

### Componentes (`src/components/flashcards/`)
- `FlashcardsApp.tsx` — Orquestrador de estados
- `DeckGenerator.tsx` — Form: upload PDF/texto, nível, título, quantidade
- `ReviewStudio.tsx` — Grid de cards para editar/deletar/adicionar + botão Aprovar
- `CardViewer.tsx` — Card com flip 3D (click), botões SRS

### Página
- `src/pages/dashboard/missions/flashcards.astro`

### Sidebar
- `DashboardLayout.astro` — Novo link "Flashcards" com ícone de cartas

---

## Schema Supabase (sem migração)
Usa tabela `activities` já existente:
- `type = 'flashcards'`
- `title = nome do deck`
- `config = { level, cards: [...], createdAt }`

---

## Status
- [x] Planejamento
- [ ] Types
- [ ] API generate-deck
- [ ] API save-deck
- [ ] FlashcardsApp
- [ ] DeckGenerator
- [ ] ReviewStudio
- [ ] CardViewer
- [ ] Página Astro
- [ ] Sidebar
