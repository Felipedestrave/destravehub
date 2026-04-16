# Plano de Implementação: Sistema de Pastas Estilo Google Drive para Atividades

Este plano detalha a implementação de um sistema hierárquico de pastas com funcionalidade de **Drag and Drop** para a Central de Atividades, seguindo a estética premium e funcionalidade do Google Drive.

## 🏗️ Fase 1: Banco de Dados (Supabase)

Precisamos estruturar as pastas e relacioná-las às atividades.

### SQL Sugerido:
```sql
-- 1. Criar tabela de pastas para atividades
CREATE TABLE activity_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES activity_folders(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Adicionar folder_id à tabela de atividades
ALTER TABLE activities ADD COLUMN folder_id UUID REFERENCES activity_folders(id) ON DELETE SET NULL;

-- 3. Habilitar RLS
ALTER TABLE activity_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sensei can manage their own activity folders" 
ON activity_folders FOR ALL 
USING (auth.uid() = teacher_id);
```

## 🛠️ Fase 2: Backend (API Routes)

1.  **`src/pages/api/activities/folders/create.ts`**: Criar nova pasta.
2.  **`src/pages/api/activities/folders/list.ts`**: Listar pastas do professor.
3.  **`src/pages/api/activities/folders/delete.ts`**: Deletar pasta.
4.  **`src/pages/api/activities/move.ts`**: Mover atividade para uma pasta.

## 🎨 Fase 3: Frontend (React)

### Componentes Sugeridos:
- **`FolderCard.tsx`**: Visual premium de pasta com ícones e menu de contexto.
- **`Breadcrumbs.tsx`**: Navegação dinâmica (`Início > Nível Básico > Gramática`).
- **`ActivitiesPanel.tsx` (Update)**:
    - Estado para `currentFolderId`.
    - Lógica de Filtragem.
    - Busca em tempo real.
    - **Native Drag & Drop**.

## 🚀 Próximos Passos:
1.  [ ] Validar estrutura do banco de dados.
2.  [ ] Implementar Endpoints de API.
3.  [ ] Refatorar `ActivitiesPanel.tsx` para o novo layout em grade com suporte a pastas.
4.  [ ] Implementar o sistema de Busca.
5.  [ ] Adicionar animações de transição (Framer Motion).
