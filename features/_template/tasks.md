# Tasks: [Feature Name]

> Step-by-step implementation checklist.
> Agents: execute these in order. Check off each step as you complete it.

---

## Pre-Implementation

- [ ] Read `features/<n>/spec.md`
- [ ] Read `features/<n>/design.md`
- [ ] Read `docs/workflows.md`
- [ ] Confirm no blockers — if any, surface them before writing code

---

## 1. Database

- [ ] Write migration SQL in `lib/supabase/migrations/<timestamp>_<description>.sql`
- [ ] Add RLS policies to the migration
- [ ] Run migration via Supabase MCP
- [ ] Regenerate TypeScript types: `npx supabase gen types typescript ...`
- [ ] Update `docs/database.md` with new table definition

---

## 2. Schemas

- [ ] Create `schemas/<feature>.ts`
- [ ] Define create schema with Zod
- [ ] Define update schema (`.partial()` of create)
- [ ] Export inferred TypeScript types

---

## 3. API Routes

- [ ] Create `app/api/<resource>/route.ts` (GET list + POST)
- [ ] Create `app/api/<resource>/[id]/route.ts` (GET single + PATCH + DELETE)
- [ ] Add auth check to each handler
- [ ] Add Zod validation to POST and PATCH handlers
- [ ] Test each route manually (or with a test client)
- [ ] Update `docs/api-contracts.md`

---

## 4. Hooks

- [ ] Create `hooks/use-<resource>.ts`
- [ ] Implement `use<Resource>()` — GET list query
- [ ] Implement `use<Resource>ById(id)` — GET single query
- [ ] Implement `useCreate<Resource>()` — POST mutation with cache invalidation
- [ ] Implement `useUpdate<Resource>()` — PATCH mutation with cache invalidation
- [ ] Implement `useDelete<Resource>()` — DELETE mutation with cache invalidation

---

## 5. UI Components

- [ ] Create feature components folder: `features/<n>/components/`
- [ ] Build list/table component
- [ ] Build create/edit dialog with React Hook Form
- [ ] Wire form submission to mutation hook
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty state

---

## 6. Page

- [ ] Create `app/dashboard/<resource>/page.tsx`
- [ ] Compose page from components
- [ ] Add page to sidebar navigation

---

## 7. Verification

- [ ] Happy path works end to end (create → view → edit → delete)
- [ ] Validation errors show correctly on the form
- [ ] Unauthenticated request returns 401
- [ ] Invalid ID returns 404
- [ ] Docs updated: `docs/database.md`, `docs/api-contracts.md`
- [ ] Changes committed: `feat: implement <feature-name>`
