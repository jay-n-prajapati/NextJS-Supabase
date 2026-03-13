# AGENTS.md

> Entry point for all AI agents and coding assistants working in this repository.
> Read this file first. Then read the referenced docs before writing any code.

---

## Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16 (App Router)              |
| Language      | TypeScript (strict mode)             |
| Database      | Supabase (Postgres + Auth + Storage) |
| UI Components | shadcn/ui                            |
| Server State  | TanStack Query v5                    |
| HTTP Client   | Axios (centralized in lib/api/)      |
| Forms         | React Hook Form + Zod                |
| Styling       | Tailwind CSS                         |
| Deployment    | Vercel                               |

---

## Core Rules

These rules are non-negotiable. Follow them in every task.

1. **Plan before coding.** Read the relevant spec and design files first. Output a plan. Wait for confirmation before implementing unless the task is trivially small.
2. **Prefer client-side rendering** for dashboard and authenticated pages.
3. **TanStack Query** manages all server state — use the API helpers (`apiGet`, `apiPost`, etc.) from `@/lib/api/client` in query/mutation hooks; no raw `fetch` in components.
4. **Every form** must use React Hook Form + a Zod schema defined in `src/types/schemas/`.
5. **All UI components** must come from `components/ui/` (shadcn). Do not install new component libraries without explicit instruction.
6. **Supabase client** must be initialized from `lib/supabase/` — never inline.
7. **Validate inputs** at the API route level using the same Zod schemas used on the client.
8. **Types** live in `src/types/` (database, api, schemas); extend from Supabase where possible.
9. **Keep features small.** If a task feels large, break it into smaller subtasks.
10. **Update docs** after implementing a feature (database.md, api-contracts.md).

---

## Architecture Docs (read before coding)

| Doc                        | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| `docs/architecture.md`     | System overview, folder structure, key decisions  |
| `docs/auth.md`             | RBAC (roles, guards, route protection, RoleGuard) |
| `docs/frontend.md`         | Component patterns, routing, rendering strategy   |
| `docs/backend.md`          | API route patterns, middleware, error handling    |
| `docs/database.md`         | Schema conventions, RLS policies, migrations      |
| `docs/state-management.md` | TanStack Query patterns, cache keys, mutations    |
| `docs/ui-system.md`        | shadcn usage, Tailwind conventions, theming       |
| `docs/api-contracts.md`    | All API routes, request/response shapes           |
| `docs/coding-standards.md` | Naming, file structure, TypeScript rules          |

---

## Feature Workflow

1. Read `features/<feature-name>/spec.md`
2. Read `features/<feature-name>/design.md`
3. Execute `features/<feature-name>/tasks.md` step by step
4. Follow `docs/workflows.md` for the agent loop
5. Update `docs/database.md` and `docs/api-contracts.md` after completion

---

## MCP Tools Available

| Tool       | Use For                                                        |
| ---------- | -------------------------------------------------------------- |
| `supabase` | Create/modify tables, run migrations, inspect schema           |
| `shadcn`   | Browse component registry, get implementations, add components |
| `context7` | Retrieve up-to-date library docs (version-specific)            |
| `git`      | Stage and commit changes                                       |
| `github`   | Open PRs, create issues                                        |
| `browser`  | Test UI, verify changes visually                               |

---

## Agent Commands

See `COMMANDS.md` for all available agent commands and their execution steps.

---

## Planning Docs

Product context, roadmap, and backlog live in `planning/`. Read `planning/product.md` before starting any new feature.
