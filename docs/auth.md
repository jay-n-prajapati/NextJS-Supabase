# Auth & RBAC

## Overview

- **Authentication:** Supabase Auth (session via cookie). Session is available server-side via `src/lib/supabase/server.ts` and in middleware via `@supabase/ssr`.
- **Authorization:** Role-based. Two roles stored on `profiles.role`: **admin**, **user**.

---

## Roles

| Role    | Use                                          |
| ------- | -------------------------------------------- |
| `admin` | Full access; admin-only routes and all items |
| `user`  | Default; own dashboard, own items            |

Roles are defined in `src/constants/roles.ts`. Profile (including role) is created on sign-up via trigger; role is read from `profiles` in API and layout.

---

## Storage

Roles live on the **profiles** table (see `docs/database.md`):

- `role text not null default 'user' check (role in ('admin', 'user'))`
- Profile row is created on sign-up via `handle_new_user` trigger.

---

## Server-Side Helpers

### requireAuth

Use in API route handlers and server layouts to ensure the user is authenticated.

```ts
// src/lib/auth.ts
import { requireAuth } from "@/lib/auth";

const data = await requireAuth();
if (!data) {
  return sendError("Unauthorized", 401);
}
const { user, profile } = data;
```

### requireRole

Use when a route or action is restricted to certain roles. Returns `null` if unauthenticated or if the user's role is not in the allowed list.

```ts
// src/lib/auth.ts
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/constants/roles";

const data = await requireRole([ROLES.ADMIN]);
if (!data) {
  return sendError("Forbidden", 403);
}
```

---

## Route Protection

| Path pattern     | Allowed roles   |
| ---------------- | --------------- |
| `/dashboard/*`   | admin, user     |
| `/admin/*`       | admin           |
| `/profile/*`     | admin, user     |

- **Middleware** (`middleware.ts`): Redirects unauthenticated users from `/dashboard`, `/admin`, `/profile` to `/auth/sign-in`.
- **Layouts:** Dashboard and admin layouts use `requireAuth()` / `requireRole()` server-side and redirect if missing.

---

## Frontend

### useCurrentUser

Hook in `hooks/use-current-user.ts` calls `GET /api/profile/current` and returns user + profile (including role). Uses TanStack Query with `QUERY_KEYS.profile.current`.

### useRole

Hook in `hooks/use-role.ts` derives `role` from `useCurrentUser()` so role and profile share the same cache.

### RoleGuard component

Conditionally render children only for allowed roles. See `src/components/common/role-guard.tsx`.

```tsx
<RoleGuard allowedRoles={[ROLES.ADMIN]}>
  <AdminOnlyButton />
</RoleGuard>
```

### Sidebar / nav

Nav items in `src/config/nav.ts` have a `roles` array; only links whose `roles` include the current user's role are shown.

---

## Summary

- **Auth:** Supabase session; protect `/dashboard`, `/admin`, `/profile` in middleware.
- **Roles:** admin, user on `profiles.role`; constants in `src/constants/roles.ts`.
- **API:** Use `requireAuth()` and `requireRole(allowedRoles)` from `src/lib/auth.ts`; return 401/403 when unauthorized.
- **UI:** `useCurrentUser()`, `useRole()`, `RoleGuard`, and role-filtered nav.
