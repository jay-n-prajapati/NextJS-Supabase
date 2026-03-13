# Dependencies

> Expected packages for this blueprint. Use these when implementing the project; do not guess versions.

---

## Core

| Package              | Purpose                  |
| -------------------- | ------------------------ |
| `next`               | Next.js 16 (App Router)  |
| `react`, `react-dom` | React 18+                |
| `typescript`         | TypeScript (strict mode) |

---

## Data & API

| Package                 | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `@supabase/ssr`         | Supabase client for Next.js (browser, server, middleware) |
| `@supabase/supabase-js` | Supabase JS client (peer of ssr)                          |
| `axios`                 | HTTP client; single instance in `lib/api/client.ts`       |
| `@tanstack/react-query` | Server state (queries, mutations, cache)                  |

---

## Forms & Validation

| Package               | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `react-hook-form`     | Form state                                  |
| `@hookform/resolvers` | Zod resolver for react-hook-form            |
| `zod`                 | Schemas (shared client + server validation) |

---

## UI

| Package                                              | Purpose                               |
| ---------------------------------------------------- | ------------------------------------- |
| `tailwindcss`                                        | Utility CSS                           |
| `lucide-react`                                       | Icons                                 |
| `sonner`                                             | Toast notifications (or shadcn toast) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Often used by shadcn (cn utility)     |

shadcn/ui components are added via `npx shadcn@latest add <component>` and land in `components/ui/`. No separate “shadcn” package; each component brings its own deps (e.g. Radix primitives).

---

## Dev

| Package                                           | Purpose          |
| ------------------------------------------------- | ---------------- |
| `eslint`, `eslint-config-next`                    | Linting          |
| `@types/node`, `@types/react`, `@types/react-dom` | TypeScript types |

---

## Optional

| Package                 | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `@tanstack/react-table` | Data tables (with shadcn Table)            |
| `date-fns`              | Date formatting (if used by shadcn or app) |

Do not add new dependencies without explicit approval; prefer the stack above.
