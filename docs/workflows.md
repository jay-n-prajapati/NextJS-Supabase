# Workflows

## Agent Loop

Every implementation task follows this loop. Do not skip steps.

```
PLAN
  ↓
IMPLEMENT
  ↓
TEST
  ↓
FIX
  ↓
VERIFY
```

### PLAN
- Read all relevant docs and feature files
- Output a numbered implementation plan
- List every file to be created or modified
- Identify blockers before writing code

### IMPLEMENT
- Execute the plan step by step
- Commit to the approach — do not pivot mid-task
- Keep changes focused on the task at hand

### TEST
- Verify the happy path works end to end
- Test error states (invalid input, unauthenticated, not found)
- Check that existing functionality is not broken

### FIX
- Address any failures found in TEST
- Re-run tests after each fix

### VERIFY
- Confirm the feature matches the spec
- Confirm docs are updated
- Confirm no regressions

---

## Feature Implementation Workflow

### Step 1 — Create Feature Folder

```
features/
  <feature-name>/
    spec.md
    design.md
    tasks.md
```

### Step 2 — Write spec.md

Define what the feature does from the user's perspective. See `features/_template/spec.md`.

### Step 3 — Write design.md

Define the technical implementation: schema, API routes, hooks, components. See `features/_template/design.md`.

### Step 4 — Write tasks.md

Break the design into ordered, checkable implementation steps. See `features/_template/tasks.md`.

### Step 5 — Run Agent Loop

```
Read features/<feature-name>/spec.md
Read features/<feature-name>/design.md
Implement features/<feature-name>/tasks.md
Follow docs/workflows.md agent loop
Continue until all tasks are complete and verified
```

### Step 6 — Update Docs

After implementation:
- Add new tables to `docs/database.md`
- Add new routes to `docs/api-contracts.md`
- Commit: `docs: update database and api contracts for <feature-name>`

### Step 7 — Commit

```
feat: implement <feature-name>
```

---

## Documentation Sync Workflow

Run periodically to keep docs accurate.

```
Run sync-docs command (see COMMANDS.md)
```

Steps:
1. Scan `app/api/` for route handlers → compare against `docs/api-contracts.md`
2. Scan `lib/supabase/migrations/` → compare against `docs/database.md`
3. Update outdated sections
4. Commit: `docs: sync documentation`

---

## Bug Fix Workflow

1. Reproduce the bug — understand the exact input and failure
2. Identify root cause layer: API / hook / component / schema / database
3. Write the fix
4. Verify fix doesn't break adjacent behavior
5. Commit: `fix: <short description>`

---

## Adding a New Resource (Quick Reference)

Checklist for adding a new domain entity (e.g., `projects`):

- [ ] Write migration SQL in `lib/supabase/migrations/`
- [ ] Run migration via Supabase MCP
- [ ] Regenerate `types/supabase.ts`
- [ ] Create `schemas/projects.ts` with Zod schemas
- [ ] Create `app/api/projects/route.ts`
- [ ] Create `app/api/projects/[id]/route.ts`
- [ ] Create `hooks/use-projects.ts`
- [ ] Build UI components
- [ ] Add page at `app/dashboard/projects/page.tsx`
- [ ] Update `docs/database.md`
- [ ] Update `docs/api-contracts.md`
