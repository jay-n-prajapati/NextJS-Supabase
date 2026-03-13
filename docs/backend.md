# Backend

## API Routes

All API logic lives in `app/api/`. Each resource gets its own folder with a `route.ts` file.

```
app/api/
  items/
    route.ts          # GET /api/items, POST /api/items
    seed/
      route.ts        # POST /api/items/seed
    [id]/
      route.ts        # GET /api/items/:id, PATCH /api/items/:id, DELETE /api/items/:id
  profile/
    current/
      route.ts        # GET /api/profile/current
```

---

## Route Handler Structure

Use `requireAuth()` from `src/lib/auth.ts` for session, then `createClient()` from `src/lib/supabase/server.ts` for Supabase. Return responses with `sendSuccess()` or `sendError()` from `src/lib/utils/api.ts`.

```ts
// app/api/items/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { sendSuccess, sendError } from "@/lib/utils/api";
import { createItemSchema } from "@/types/schemas";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return sendError("Unauthorized", 401);

  const supabase = await createClient();
  const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
  if (error) return sendError(error.message, 500);
  return sendSuccess(data ?? []);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return sendError("Unauthorized", 401);

  const parsed = createItemSchema.safeParse(await request.json());
  if (!parsed.success) return sendError("Validation failed", 400, parsed.error.flatten());

  const supabase = await createClient();
  const { data, error } = await supabase.from("items").insert({ ...parsed.data, created_by: auth.user.id }).select().single();
  if (error) return sendError(error.message, 500);
  return sendSuccess(data, 201, { message: "Item created." });
}
```

---

## Response Helpers

Use `sendSuccess` and `sendError` from `src/lib/utils/api.ts`. Success shape: `{ success: true, data: T, message?, metadata? }`. Error shape: `{ success: false, error: { code?, message }, message?, details? }`. See `src/types/api.ts`.

---

## Authentication Pattern

Use `requireAuth()` from `src/lib/auth.ts`. It returns `null` when unauthenticated; otherwise `{ user, profile }`.

```ts
const auth = await requireAuth();
if (!auth) return sendError("Unauthorized", 401);
// auth.user.id, auth.profile.role are safe
```

---

## Role-Based Access (requireRole)

For routes restricted to certain roles, use `requireRole(allowedRoles)` from `src/lib/auth.ts`. Returns `null` when unauthenticated or when the user's role is not in the list (treat as 403).

```ts
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/constants/roles";

const data = await requireRole([ROLES.ADMIN]);
if (!data) return sendError("Forbidden", 403);
// only admin reaches here
```

---

## Input Validation

Validate all request bodies using the Zod schema for the resource.

```ts
const parsed = mySchema.safeParse(await req.json());
if (!parsed.success) {
  return NextResponse.json(
    { error: "Validation failed", details: parsed.error.flatten() },
    { status: 400 },
  );
}
// parsed.data is now type-safe
```

---

## Middleware

`middleware.ts` at the root handles:

- Refreshing Supabase sessions on every request (using `@supabase/ssr`)
- Redirecting unauthenticated users away from protected routes
- Optional: redirecting insufficient roles from `/dashboard/admin/*` and `/dashboard/manage/*` (see `docs/auth.md`)

```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Supabase Client Setup

```ts
// lib/supabase/client.ts — browser
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// lib/supabase/server.ts — server / API routes
import { createServerClient as _createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createServerClient() {
  const cookieStore = cookies();
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}
```
