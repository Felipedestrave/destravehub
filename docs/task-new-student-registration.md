# Task Plan: New Student Registration Page

This task implements a full-page student registration flow to allow teachers to create official student accounts with advanced profiles.

## 🎯 Objectives
- Replace the simple registration modal with a comprehensive registration page.
- Allow creation of real accounts (Supabase Auth) by the teacher.
- Support flexible information (name, email, password, language, level).
- Generic proficiency levels: Iniciante, Básico, Intermediário, Avançado.

## 🏗️ Architecture
1. **Frontend:** React form at `/dashboard/students/new`.
2. **Backend:** Astro API endpoint `/api/admin/create-student` uses `SUPABASE_SERVICE_ROLE_KEY` to create Auth users safely.
3. **Database:** Row in `students` linked to the newly created `auth.uid()`.

## 📋 Task List
- [ ] **Phase 1: Database & Types**
    - [ ] Update `src/types/supabase.ts` with `language` and `metadata` (Draft).
    - [ ] Suggest SQL migration for `language` and `metadata` columns.
- [ ] **Phase 2: Backend API**
    - [ ] Setup `src/lib/supabase-admin.ts` with service role key support.
    - [ ] Create `src/pages/api/admin/create-student.ts`.
- [ ] **Phase 3: UI Components**
    - [ ] Create `src/components/dashboard/AddStudentForm.tsx`.
    - [ ] Create `src/pages/dashboard/students/new.astro`.
    - [ ] Create `src/pages/dashboard/students/success.astro`.
- [ ] **Phase 4: Refactor & Verification**
    - [ ] Update `StudentList.tsx` to redirect to the new page.
    - [ ] Manual test of the flow.

## ⚠️ Important Note
**This task requires the `SUPABASE_SERVICE_ROLE_KEY` in `.env` to work.** Without it, the teacher cannot create Auth users for students.
