# [Project Name]

> AI-Native SaaS Starter — Next.js · Supabase · shadcn/ui · TanStack Query

---

## Stack

| Layer        | Technology                 |
| ------------ | -------------------------- |
| Framework    | Next.js 16 (App Router)    |
| Language     | TypeScript (strict)        |
| Database     | Supabase (Postgres + Auth) |
| UI           | shadcn/ui + Tailwind CSS   |
| Server State | TanStack Query v5          |
| HTTP Client  | Axios (centralized)        |
| Forms        | React Hook Form + Zod      |
| Deployment   | Vercel                     |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd <project>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts

# Start dev server
npm run dev
```

---

## Repository Structure

```
src/
  app/          Next.js pages and API routes (api/, auth/, dashboard/, profile/)
  components/   UI (ui/), shared, dashboard, layout, common
  hooks/        TanStack Query hooks (use-items, use-current-user, use-role, etc.)
  lib/          API client (axios), Supabase (server, env), utils, auth
  constants/    routes, query-keys, roles
  types/        database, api response types, schemas/ (Zod)
docs/           Architecture and reference documentation
planning/       Product, roadmap, feature backlog
features/       Feature specs and implementation plans
```

---

## For AI Agents

Read `AGENTS.md` first. It contains all rules, patterns, and references you need.

---

## Documentation

| Doc                        | Description                         |
| -------------------------- | ----------------------------------- |
| `AGENTS.md`                | Agent entry point and core rules    |
| `COMMANDS.md`              | Reusable agent commands             |
| `docs/architecture.md`     | System overview and key decisions   |
| `docs/auth.md`             | RBAC, roles, route protection       |
| `docs/frontend.md`         | Component and routing patterns      |
| `docs/backend.md`          | API route patterns and middleware   |
| `docs/database.md`         | Schema, RLS, migrations             |
| `docs/state-management.md` | TanStack Query patterns             |
| `docs/ui-system.md`        | shadcn and Tailwind conventions     |
| `docs/api-contracts.md`    | API route reference                 |
| `docs/coding-standards.md` | Naming, structure, TypeScript rules |
| `docs/dependencies.md`     | Expected packages and purposes      |
| `docs/workflows.md`        | Agent loop and feature workflow     |

---

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```
