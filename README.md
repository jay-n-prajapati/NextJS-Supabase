# Next.js + Supabase Starter

Production-ready Next.js application with **App Router**, **Supabase** (auth + database), **shadcn/ui**, and **role-based access** (admin / user). Ready for Vercel deployment.

## Stack

- **Next.js 16** (App Router, React 19)
- **Supabase** — Auth (email/password) and PostgreSQL
- **shadcn/ui** — Components and styling
- **TypeScript**

## Quick start (local)

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL and public API key (see below)
npm run dev
```

---

## Supabase setup (step-by-step)

Follow these steps to get the required environment keys and configure the project.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose your **organization** and set:
   - **Name**: e.g. `nextjs-starter`
   - **Database password**: save it somewhere safe.
   - **Region**: pick the one closest to your users.
4. Click **Create new project** and wait for the project to be ready.

### 2. Get the API keys

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** (gear icon in the left sidebar) → **API**.
3. Copy these two values:

   | What you need      | Where to find it                                                             |
   | ------------------ | ---------------------------------------------------------------------------- |
   | **Project URL**    | **API** → **Project URL** (use as `NEXT_PUBLIC_SUPABASE_URL`)                |
   | **Public API key** | **API Keys** tab (see below) → use as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

   **Public API key:**
   - **Recommended:** **Publishable key** — format `sb_publishable_...`. In **API Keys**, copy the **Publishable key**; if you don’t see one, click **Create new API Keys** and copy the Publishable key. Set it as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - **Legacy:** **anon key** — JWT format (`eyJ...`). In **API Keys** → **Legacy API Keys**, copy the **anon** key and set it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

   Both are safe for client-side use. The app checks for Publishable key first, then anon key.

4. Create a file `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx
```

Replace with your actual **Project URL** and **Publishable key**. Do not use the secret / `service_role` key here — that must never be exposed in the browser.

### 3. Run the database migration

1. In the Supabase dashboard, go to **SQL Editor**.
2. Click **New query**.
3. Open this file in your repo: `supabase/migrations/20250308000001_init_schema.sql`.
4. Copy its full contents and paste into the SQL Editor.
5. Click **Run** (or press Ctrl+Enter).
6. Confirm there are no errors. This creates:
   - `profiles` (id, email, full_name, avatar_url, role, timestamps)
   - `items` (id, title, description, created_by, timestamps)
   - RLS policies and triggers (e.g. profile created on sign-up).

### 4. Configure Auth (Site URL and redirect URLs)

1. Go to **Authentication** → **URL Configuration**.
2. Set **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-vercel-domain.vercel.app` (or your custom domain).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - Your production URL, e.g. `https://your-vercel-domain.vercel.app/auth/callback`
4. Click **Save**.

**Email verification:** After sign-up, users receive a confirmation email. Clicking the link goes to `/auth/callback` (which completes verification), then to `/auth/email-verified`. From there they use **Sign in to proceed** to sign in. Use the default **Confirm signup** email template in Supabase, or see `docs/supabase-email-templates.md` for customization.

### 5. (Optional) OAuth (Google / GitHub)

The app currently uses **email/password only**. OAuth is not implemented in the UI. To add it later, enable the provider in **Authentication** → **Providers** in Supabase and implement the sign-in flow in the app.

### 6. (Optional) Seed demo data

- **From the app**: Sign up a user, go to **Dashboard**, then click **Add demo items** to insert sample items for that user.
- **From SQL**: After at least one user exists, run the contents of `supabase/seed.sql` in the SQL Editor. To promote a user to admin, run:
  ```sql
  update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'your@email.com' limit 1);
  ```

---

## Environment variables summary

| Variable                               | Where to get it                                             | Required                                                          |
| -------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project Settings → API → **Project URL**                    | Yes                                                               |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → **API Keys** → **Publishable key** | Yes (or use `NEXT_PUBLIC_SUPABASE_ANON_KEY` with legacy anon key) |

- **Publishable key** (`sb_publishable_...`) — recommended; set as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **anon key** (JWT) — legacy; set as `NEXT_PUBLIC_SUPABASE_ANON_KEY` if you prefer.
- Never put a **secret** or **service_role** key in client-side env vars.

Use `.env.local` locally. On Vercel, set these in **Project → Settings → Environment Variables**.

---

## Project structure

- `src/app` — App Router routes (auth, dashboard, admin).
- `src/components` — UI (shadcn + custom: nav, items list, forms).
- `src/lib` — Supabase clients (browser, server, middleware), auth helpers, utils.
- `src/types` — Shared TypeScript types (e.g. `Profile`, `Item`).
- `supabase/migrations` — SQL migration for `profiles` and `items` with RLS.
- `supabase/seed.sql` — Optional seed and admin-promotion snippet.

## Roles and routes

- **Unauthenticated**: `/`, `/auth/sign-in`, `/auth/sign-up`, `/auth/email-verified` (success page after clicking the sign-up confirmation link).
- **Authenticated (user)**: `/dashboard` — view all items, create and edit/delete own.
- **Admin**: `/admin` — full CRUD on all items; link shown in nav when `profile.role === 'admin'`.

Flow: sign up → confirm email (link in email) → redirected to `/auth/email-verified` → **Sign in to proceed** → dashboard. Protected routes are enforced in middleware (redirect to sign-in) and in layout/server code (role checks for `/admin`).

---

## Deploy on Vercel

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In Vercel: **New Project** → import this repo.
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (use your Publishable key from Supabase API settings).
4. In Supabase **URL Configuration**, set **Site URL** and **Redirect URLs** to your Vercel URL (e.g. `https://your-app.vercel.app` and `https://your-app.vercel.app/auth/callback`).
5. Deploy. No extra build settings needed for a standard Next.js app.

---

## Scripts

- `npm run dev` — Development server.
- `npm run build` — Production build.
- `npm run start` — Run production server locally.
- `npm run lint` — Run ESLint.
