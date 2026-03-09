# 🎧 Task: Refatoração do Destrave Escuta

**Tipo:** COMPLEX CODE — Integração de módulo externo ao Destrave Hub
**Agentes:** `@backend-specialist` (API), `@frontend-specialist` (UI)
**Data:** 08/03/2026

---

## 📋 Contexto

Protótipo do *Destrave a Escuta* já existe e foi revisado. Os seguintes arquivos foram analisados:
- `gemini.ts` → Lógica de geração de questões (Gemini Flash) e áudio (TTS 2.5)
- `Game.tsx` → Interface de jogo com áudio, opções e feedback
- `types.ts` → Enums e interfaces de dados (`Question`, `GeneratedData`, `GameState`)

O sistema-alvo (Destrave Hub) usa **Astro 5 (output: server) + React 19 + Supabase + Tailwind CSS v4**.

---

## 🎯 Decisões Arquiteturais

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Parser de PDF | Gemini `inlineData` (base64) | Preserva suporte a kanji/kana sem bibliotecas externas |
| Lógica de IA | Servidor (API Route) | Oculta `GEMINI_API_KEY` do cliente – segurança |
| Acesso ao jogo | Híbrido (logado + link UUID) | Alunos cadastrados e experimentais |
| Cores/Design | Ice Meta (mapear `brand-*` → variáveis CSS do Hub) | Consistência visual |
| Estado do jogo | React local (`useState`) | Protege performance, sem necessidade de BD em tempo real |
| Persistência de resultado | API Route → Supabase `assignments` | Salvar score ao finalizar |

---

## 📁 Arquivos a Criar / Modificar

### CRIAR
```
src/
├── types/
│   └── escuta.ts                          ← Tipos migrados do protótipo (Question, GeneratedData, etc.)
├── pages/
│   ├── api/
│   │   └── missions/
│   │       ├── generate-questions.ts      ← POST: PDF base64 → array de Questions (Gemini)
│   │       ├── generate-audio.ts          ← POST: text + context → audioBase64 (TTS)
│   │       └── save-result.ts             ← POST: salva resultado na tabela `assignments`
│   └── dashboard/
│       └── missions/
│           └── escuta.astro               ← Página principal do módulo (professor)
└── components/
    └── escuta/
        ├── EscutaApp.tsx                  ← Orquestrador principal (substitui App.tsx do protótipo)
        ├── UploadScreen.tsx               ← Tela de upload do PDF + config de dificuldade
        ├── GameScreen.tsx                 ← Game.tsx refatorado com cores Ice Meta
        └── ResultScreen.tsx               ← Tela de resultado com botão "Enviar Missão"
```

### MODIFICAR
```
src/types/supabase.ts   → Sem alteração (activities/assignments já suportam o fluxo)
src/layouts/DashboardLayout.astro → Adicionar link "Escuta" no sidebar (se necessário)
```

---

## ✅ Task Breakdown

### TASK 1: Tipos e Contratos
- **Arquivo:** `src/types/escuta.ts`
- **INPUT:** `types.ts` do protótipo
- **OUTPUT:** Tipos migrados com adaptações para o Hub (ex: substituir `process.env.API_KEY` por `import.meta.env.GEMINI_API_KEY`)
- **VERIFY:** TypeScript não reporta erros ao importar em outros arquivos

---

### TASK 2: API — Geração de Questões
- **Arquivo:** `src/pages/api/missions/generate-questions.ts`
- **INPUT:** `{ pdfBase64, difficulty, count, focus }` via POST
- **OUTPUT:** `Question[]` em JSON
- **Lógica:** `generateQuestionsBatch` do protótipo, adaptada para Astro APIRoute
- **VERIFY:** `curl -X POST /api/missions/generate-questions` retorna array com questões válidas

---

### TASK 3: API — Geração de Áudio
- **Arquivo:** `src/pages/api/missions/generate-audio.ts`
- **INPUT:** `{ text, contextName, difficulty }` via POST
- **OUTPUT:** `{ audioBase64: string }` em JSON
- **Lógica:** `generateAudioOnly` do protótipo, adaptada para APIRoute
- **VERIFY:** Frontend recebe string base64 decodificável em PCM 24kHz

---

### TASK 4: API — Salvar Resultado
- **Arquivo:** `src/pages/api/missions/save-result.ts`
- **INPUT:** `{ assignmentId?, studentId, activityId, score, history }` via POST (autenticado)
- **OUTPUT:** `{ success: true, assignmentId }` 
- **Lógica:** Upsert na tabela `assignments` com `result_data: { score, history }` e `status: 'completed'`
- **VERIFY:** Registro aparece no Supabase após uma partida completa

---

### TASK 5: Componente — Upload Screen
- **Arquivo:** `src/components/escuta/UploadScreen.tsx`
- **INPUT:** `onStart(config: GameConfig)` callback
- **OUTPUT:** Formulário com: upload PDF, select de dificuldade, select de foco, número de questões
- **Design:** Usar variáveis CSS do Hub (`--color-brand-orange`, etc.) em vez de `brand-orange` do Tailwind do protótipo
- **VERIFY:** Arquivo PDF selecionado é convertido para base64 e passado via callback

---

### TASK 6: Componente — Game Screen (refatorar Game.tsx)
- **Arquivo:** `src/components/escuta/GameScreen.tsx`
- **INPUT:** `Game.tsx` do protótipo
- **MUDANÇAS:**
  - Remover imports de `Button` do protótipo → usar padrão do Hub
  - Substituir `bg-brand-gray/brand-purple` → equivalentes Ice Meta
  - Props: adicionar `onGameComplete(result: GameResult)` para salvar resultado
- **VERIFY:** Componente renderiza, áudio toca e opções respondem ao clique

---

### TASK 7: Componente — EscutaApp (Orquestrador)
- **Arquivo:** `src/components/escuta/EscutaApp.tsx`
- **INPUT:** `{ studentId?, assignmentId? }` (props opcionais para modo "Missão enviada")
- **FLUXO:**
  1. `UPLOAD` → `UploadScreen`
  2. `GENERATING` → Chama `/api/missions/generate-questions` e inicia fetchs de áudio sequenciais
  3. `PLAYING` → `GameScreen` (questão por questão)
  4. `RESULT` → `ResultScreen` → chama `/api/missions/save-result`
- **VERIFY:** Ciclo completo (upload → jogar → resultado) sem erros no console

---

### TASK 8: Página Astro do Professor
- **Arquivo:** `src/pages/dashboard/missions/escuta.astro`
- **INPUT:** Sessão do professor (Supabase)
- **OUTPUT:** Página protegida com `EscutaApp` como React Island
- **Padrão:** Seguir o mesmo padrão de `/dashboard/calendar.astro`
- **VERIFY:** Rota `/dashboard/missions/escuta` abre e exibe o app

---

### TASK 9 (FUTURO): Fluxo de Envio de Missão a Aluno
- [ ] Tela de seleção de aluno após `ResultScreen`
- [ ] Criação de `activity` (tipo: `escuta`) + `assignment` no Supabase
- [ ] Geração de link UUID para alunos experimentais
- [ ] Rota pública: `/missao/[uuid]` para acesso sem login

---

## 🔗 Mapeamento de Cores (Ice Meta ↔ Protótipo)

| Protótipo (`brand-*`) | Hub (CSS var / Tailwind) | Hex |
|-----------------------|--------------------------|-----|
| `brand-purple` | `--color-brand` / `text-brand` | `#58317E` |
| `brand-orange` | `--color-accent` / `text-accent` | `#FF7F32` |
| `brand-gray` | `bg-white/5` ou card background | `#E2E8F0` |
| `brand-black` | `bg-background` | `#F3F7FA` (light) |
| `brand-lilac` | `text-muted` | `#94a3b8` |
| `text-white` | `text-foreground` | Depende do tema |

> ⚠️ **Nota:** Verificar se o Hub está em dark ou light mode antes de mapear. O design "Ice Meta" usa fundo claro (`#F3F7FA`), diferente do dark theme do protótipo.

---

## 🚀 Ordem de Implementação Sugerida

```
TASK 1 (tipos) → TASK 2 + TASK 3 (APIs, paralelas) → TASK 5 + TASK 6 (componentes, paralelas) → TASK 7 (orquestrador) → TASK 4 (save result) → TASK 8 (página)
```

---

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Modelo `gemini-3-flash-preview` pode não estar disponível | Fallback para `gemini-2.0-flash` |
| PDF com muitos caracteres pode exceder context window | Limitar a N páginas no upload |
| Áudio PCM diferente de WAV pode ter problemas em Safari | Testar `AudioContext` com `sampleRate: 24000` no Safari |
| `GEMINI_API_KEY` exposta | Usar apenas em API Routes (servidor), nunca no cliente |
