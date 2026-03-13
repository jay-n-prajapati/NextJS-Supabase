# COMMANDS.md

> Reusable agent commands. Reference these in prompts to trigger structured workflows.

---

## `create-feature`

Implement a feature end-to-end.

**Steps:**
1. Read `features/<feature-name>/spec.md` — understand requirements
2. Read `features/<feature-name>/design.md` — understand technical approach
3. Execute each step in `features/<feature-name>/tasks.md`
4. Follow the agent loop in `docs/workflows.md`
5. Write tests for the new API routes and hooks
6. Update `docs/database.md` if schema changed
7. Update `docs/api-contracts.md` with new routes
8. Commit changes with a descriptive message

---

## `add-form`

Add a new form to an existing page or dialog.

**Steps:**
1. Create a Zod schema in `src/types/schemas/<name>.ts`
2. Export the inferred TypeScript type from the schema
3. Build the React Hook Form component using shadcn `Form`, `FormField`, `FormItem`, `FormMessage`
4. Connect submission to a TanStack Query `useMutation`
5. Handle loading, error, and success states
6. Add server-side validation in the API route using the same schema

---

## `add-api-route`

Add a new Next.js API route.

**Steps:**
1. Create `app/api/<resource>/route.ts`
2. Validate the request body with the relevant Zod schema from `src/types/schemas/`
3. Authenticate using `requireAuth()` from `@/lib/auth`
4. Perform the database operation via `createClient()` from `@/lib/supabase/server.ts`
5. Return responses with `sendSuccess()` or `sendError()` from `@/lib/utils/api.ts`
6. Document the route in `docs/api-contracts.md`

---

## `add-query-hook`

Add a TanStack Query data-fetching hook.

**Steps:**
1. Create or update `hooks/use-<resource>.ts`
2. Use the API helpers (`apiGet`, `apiPost`, etc.) from `@/lib/api/client` for all API calls (no raw fetch)
3. Define a stable query key (see `docs/state-management.md`)
4. Implement `useQuery` for reads
5. Implement `useMutation` with `onSuccess` cache invalidation for writes
6. Export typed return values
7. Add optimistic updates if UX requires it

---

## `add-db-table`

Add a new Supabase table.

**Steps:**
1. Write the migration SQL in `lib/supabase/migrations/<timestamp>_<name>.sql`
2. Define columns, constraints, and indexes
3. Add Row Level Security (RLS) policies
4. Run the migration via Supabase MCP
5. Regenerate TypeScript types
6. Update `docs/database.md`

---

## `sync-docs`

Keep documentation in sync with the codebase.

**Steps:**
1. Scan `app/api/` — compare routes against `docs/api-contracts.md`
2. Scan `lib/supabase/migrations/` — compare schema against `docs/database.md`
3. Scan `hooks/` — compare exported hooks against `docs/state-management.md`
4. Update any outdated sections
5. Commit documentation updates with message `docs: sync documentation`

---

## `plan-feature`

Generate an implementation plan without writing code.

**Steps:**
1. Read `features/<feature-name>/spec.md`
2. Output a numbered implementation plan
3. List all files that will be created or modified
4. Identify any blockers or open questions
5. **Do not write code.** Wait for confirmation.

---

## `add-page`

Add a new dashboard page with layout.

**Steps:**
1. Create `app/dashboard/<page-name>/page.tsx`
2. Use `DashboardShell` (or existing dashboard layout) and `PageHeader` where applicable
3. Add the page to sidebar navigation in the dashboard layout; respect role-based visibility (see `docs/auth.md`) if the page is role-restricted
4. Create any feature-specific components under `features/<feature>/components/` or `components/shared/` as appropriate

---

## `fix-bug`

Diagnose and fix a reported bug.

**Steps:**
1. Reproduce the bug — understand the exact failure
2. Identify the root cause (API, hook, component, schema, or database)
3. Write a fix
4. Verify the fix doesn't break adjacent functionality
5. Commit with message `fix: <short description>`
