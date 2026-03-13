# Frontend

## Routing

This project uses the Next.js App Router.

| Route Group | Purpose |
|---|---|
| `app/auth/` | Unauthenticated pages (sign-in, sign-up, callback) |
| `app/dashboard/` | Authenticated pages (all roles) |
| `app/admin/` | Admin-only pages |
| `app/profile/` | Authenticated profile page |
| `app/api/` | API route handlers |

Role-based route protection is enforced in middleware and optionally in layout; see `docs/auth.md`.

### Page File Conventions

```
app/dashboard/
  page.tsx          # The page component
  layout.tsx        # Layout wrapper (optional)
  loading.tsx       # Suspense fallback (optional)
  error.tsx         # Error boundary (optional)
```

---

## Component Conventions

### Directory Rules

| Location | Contains |
|---|---|
| `components/ui/` | shadcn primitives. Auto-generated. **Never edit manually.** |
| `components/shared/` | App-level reusable components (e.g. `PageHeader`, `DataTable`, `EmptyState`) |
| `components/dashboard/` | Dashboard-specific components (e.g. items list, forms) |

### Component Structure

```tsx
// components/shared/page-header.tsx

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
```

- Named exports, not default exports (exception: Next.js `page.tsx` files).
- Props interface defined above the component.
- No business logic inside components — delegate to hooks.

---

## Data Fetching in Components

Always use TanStack Query hooks. Data fetching happens inside hooks via the axios helpers (`apiGet`, `apiPost`, etc. from `@/lib/api/client`); never call `fetch()` or create ad-hoc axios in components.

```tsx
// ✅ Correct
import { useItems } from '@/hooks/use-items'

export function ItemsList() {
  const { data: items, isLoading, error } = useItems()
  // ...
}

// ❌ Wrong — raw fetch/axios in component
export function ItemsList() {
  const [items, setItems] = useState([])
  useEffect(() => {
    fetch('/api/items').then(...)  // or api.get(...) — both wrong here
  }, [])
}
```

---

## Role-Based UI (RBAC)

Use the current user's role to show or hide features. The profile (including `role`) is loaded via `useCurrentUser()` or `useRole()` (see `hooks/use-current-user.ts`, `hooks/use-role.ts`).

### RoleGuard component

Conditionally render children only for allowed roles:

```tsx
// components/common/role-guard.tsx
import { useRole } from '@/hooks/use-role'
import { ROLES } from '@/constants/roles'

<RoleGuard allowedRoles={[ROLES.ADMIN]}>
  <AdminOnlyButton />
</RoleGuard>
```

### Role-based sidebar navigation

Nav items are defined in `src/config/nav.ts` with a `roles` array; the sidebar filters by current role via `getVisibleNavItems(items, userRole)`.

---

## Forms

Every form must use React Hook Form + Zod. See `docs/state-management.md` for mutation patterns.

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskCreateSchema, TaskCreateInput } from '@/schemas/tasks'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

export function CreateTaskForm() {
  const form = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: { title: '' },
  })

  const { mutate, isPending } = useCreateTask()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## Loading and Error States

Always handle loading and error states explicitly.

```tsx
const { data, isLoading, error } = useTasks()

if (isLoading) return <Skeleton className="h-32 w-full" />
if (error) return <ErrorMessage message={error.message} />
if (!data?.length) return <EmptyState message="No tasks yet." />
```

---

## Styling

- Tailwind CSS utility classes only.
- Use `cn()` from `lib/utils` for conditional class merging.
- Follow shadcn design tokens (`text-muted-foreground`, `bg-background`, etc.).
- No inline `style` props except for truly dynamic values (e.g., chart widths).
- No CSS modules.

```tsx
import { cn } from '@/lib/utils'

<div className={cn('rounded-md border p-4', isActive && 'border-primary')}>
```

---

## File Naming

| Type | Convention | Example |
|---|---|---|
| Components | kebab-case | `task-dialog.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-tasks.ts` |
| Schemas | kebab-case | `tasks.ts` |
| Types | kebab-case | `index.ts` |
| API routes | folder with `route.ts` | `app/api/tasks/route.ts` |
