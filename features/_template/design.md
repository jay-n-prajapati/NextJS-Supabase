# Feature Design: [Feature Name]

> Technical implementation plan.
> Agents: read spec.md first, then this file, then tasks.md.

---

## Database

### New Tables

```sql
-- table_name
create table if not exists public.table_name (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  -- add columns
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Modified Tables

_None / describe changes_

---

## Schemas (Zod)

```ts
// schemas/<feature>.ts

export const featureCreateSchema = z.object({
  field: z.string().min(1).max(255),
})

export const featureUpdateSchema = featureCreateSchema.partial()

export type FeatureCreateInput = z.infer<typeof featureCreateSchema>
export type FeatureUpdateInput = z.infer<typeof featureUpdateSchema>
```

---

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/<resource>` | List all |
| POST | `/api/<resource>` | Create |
| GET | `/api/<resource>/:id` | Get one |
| PATCH | `/api/<resource>/:id` | Update |
| DELETE | `/api/<resource>/:id` | Delete |

---

## Hooks

```ts
// hooks/use-<resource>.ts

useFoo()           // GET list
useFooById(id)     // GET single
useCreateFoo()     // POST mutation
useUpdateFoo()     // PATCH mutation
useDeleteFoo()     // DELETE mutation
```

---

## Components

| Component | Location | Purpose |
|---|---|---|
| `FooList` | `features/<n>/components/foo-list.tsx` | Renders list of items |
| `FooDialog` | `features/<n>/components/foo-dialog.tsx` | Create/edit dialog |
| `FooTable` | `features/<n>/components/foo-table.tsx` | Data table view |

---

## Types

```ts
// types/index.ts additions
export interface Foo {
  id: string
  ownerId: string
  // ...
  createdAt: string
  updatedAt: string
}
```

---

## Role Access

| Who can access this feature? | Roles |
| ----------------------------- | ----- |
| _e.g. All authenticated_      | admin, subadmin, user |
| _e.g. Admin only_             | admin |
| _e.g. Admin + subadmin_       | admin, subadmin |

- List which roles can use this feature (see `docs/auth.md`).
- If any route or API is role-restricted, document it in API Routes and use `requireRole()` in the handler.
