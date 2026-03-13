# Architecture

## Overview

This is an AI-native full-stack SaaS application built on Next.js (App Router), Supabase, and shadcn/ui. The repository is structured so that AI agents can navigate, understand, and extend it with minimal ambiguity.

---

## Folder Structure

```
.
├── app/                        # Next.js App Router
│   ├── api/                    # API route handlers (items, profile, etc.)
│   │   └── [resource]/
│   │       └── route.ts
│   ├── auth/                   # Auth pages (sign-in, sign-up, callback)
│   ├── dashboard/              # Protected dashboard pages
│   └── layout.tsx              # Root layout
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── shared/                 # Reusable app-level components
│   └── dashboard/              # Dashboard-specific components
│
├── hooks/                      # TanStack Query hooks (one file per resource)
│
├── lib/
│   ├── api/
│   │   └── client.ts           # Axios client (baseURL /api), get/post/put/patch/delete, interceptors
│   ├── supabase/
│   │   ├── server.ts           # Server Supabase client (API routes, auth)
│   │   └── env.ts              # Env validation
│   ├── utils/
│   │   └── api.ts              # sendSuccess, sendError for API route responses
│   └── auth.ts                 # requireAuth, requireRole (uses createClient)
│
├── constants/                  # routes, query-keys, roles
├── types/
│   ├── schemas/                # Zod schemas (auth, items, etc.)
│   ├── api.ts                  # ApiSuccess, ApiError, PaginatedResponse
│   └── database.ts             # Manual DB types (Profile, Item)
│
├── docs/                       # Architecture and reference docs
├── planning/                   # Product planning docs
├── features/                   # Feature specs and designs
│
├── AGENTS.md                   # Agent entry point
├── COMMANDS.md                 # Agent command definitions
└── README.md
```

---

## Key Architectural Decisions

### Rendering Strategy

- **Authenticated pages (dashboard):** Client-side rendering. TanStack Query manages all data fetching.
- **Public/marketing pages:** Server-side rendering or static generation.
- **API routes:** Next.js Route Handlers (`app/api/`). No separate backend server.

### Authentication

- Supabase Auth handles all authentication.
- Session is available server-side via `lib/supabase/server.ts`.
- Protected routes are guarded by middleware (`middleware.ts`).

### Data Flow

```
Component
  → TanStack Query hook (hooks/)
    → api (axios client from lib/api/client) to API route (app/api/)
      → Supabase server client (lib/supabase/server.ts)
        → Postgres (Supabase)
```

All client-to-API requests use the centralized axios instance. Never call `fetch()` or create a new axios instance in components or hooks.

### State Management

- **Server state:** TanStack Query exclusively.
- **Form state:** React Hook Form exclusively.
- **Global UI state:** React Context or Zustand (only when needed).
- No Redux. No prop drilling beyond 2 levels.

### Validation

- Zod schemas defined in `schemas/` are the single source of truth.
- The same schema is used on the client (React Hook Form) and server (API route validation).

### Database

- All schema changes are versioned SQL migrations in `lib/supabase/migrations/`.
- Row Level Security (RLS) is enabled on all tables.
- TypeScript types for app entities live in `src/types/database.ts`; API response types in `src/types/api.ts`.

### Role-Based Access Control (RBAC)

- Two roles: **admin**, **user**. Stored on `profiles.role` (see `src/constants/roles.ts`).
- Route protection: `/dashboard/*`, `/profile/*` (authenticated); `/admin/*` (admin only). Middleware redirects unauthenticated users to sign-in.
- API routes use `requireAuth()` and optionally `requireRole(allowedRoles)` from `src/lib/auth.ts`; return 401/403 when unauthorized.
- Frontend uses `RoleGuard` and role-aware nav (see `docs/auth.md`).

### HTTP Client (Axios)

- Single axios instance in `src/lib/api/client.ts` with `baseURL: '/api'`, `withCredentials: true`, and response interceptors that unwrap `data` from success responses and normalize errors to `ApiRequestError` (with optional 401 redirect to sign-in).
- HTTP helpers: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete` — all use the shared client and return unwrapped `data` or throw. Support `AbortSignal` in config for cancellation.
- Success responses: `{ success: true, data: T, message?, metadata? }` (see `src/types/api.ts`). Error responses: `{ success: false, error: { code?, message }, message? }`.
- Server-side: `sendSuccess(data, status?, options?)` and `sendError(error, status?, details?)` in `src/lib/utils/api.ts`. Hooks use the axios helpers; no raw `fetch` in components.

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server only — never expose to client
```

---

## Dependency Philosophy

- Prefer the already-installed stack. Do not add new dependencies unless explicitly approved.
- UI components: shadcn/ui only.
- Utility libraries: prefer native browser APIs or small, well-maintained packages.
