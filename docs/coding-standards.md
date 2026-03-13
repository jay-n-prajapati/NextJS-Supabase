# Coding Standards

## TypeScript

- **Strict mode** enabled. No `any`. No `as unknown as X` unless absolutely necessary.
- Prefer `interface` for object shapes, `type` for unions and computed types.
- Export types alongside the code that produces them.
- Use `satisfies` over `as` for type assertions.

```ts
// ✅
interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
}

// ✅
type TaskStatus = Task['status']

// ❌
const task = { id: '1', title: 'foo' } as any
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `use-tasks.ts` |
| Components | PascalCase | `TaskDialog` |
| Hooks | camelCase with `use` prefix | `useTasks` |
| Functions | camelCase | `createTask` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_TASK_TITLE_LENGTH` |
| Types/Interfaces | PascalCase | `TaskCreateInput` |
| Zod schemas | camelCase with `Schema` suffix | `taskCreateSchema` |
| Query keys | camelCase with `Keys` suffix | `taskKeys` |
| API route folders | kebab-case | `app/api/task-items/` |

---

## File Organization

One concept per file. Keep files small.

- A hook file exports one primary hook and its related mutations.
- A schema file contains schemas for one domain entity.
- A component file contains one component (plus its sub-components if tightly coupled).

---

## Imports

Use path aliases. Never use relative `../../` imports beyond one level.

```ts
// ✅
import { useTasks } from '@/hooks/use-tasks'
import { Button } from '@/components/ui/button'

// ❌
import { useTasks } from '../../../hooks/use-tasks'
```

Import order (enforced by ESLint):
1. React
2. Next.js
3. Third-party libraries
4. Internal (`@/`)
5. Relative (`./ ../`)
6. Types

**HTTP client:** Use the centralized axios instance only. Import from `@/lib/api/client`; never use raw `fetch()` or `new axios.create()` in hooks or components.

---

## Error Handling

Never swallow errors silently.

```ts
// ✅
try {
  const result = await riskyOperation()
} catch (error) {
  console.error('[context]', error)
  throw error  // or return errorResponse(error)
}

// ❌
try {
  await riskyOperation()
} catch {}
```

On the client, always surface errors to the user via `toast.error()` or an error state.

---

## Comments

Write comments for *why*, not *what*. The code explains what — comments explain the reasoning.

```ts
// ✅
// Supabase RLS prevents cross-user access, but we re-check here
// to provide a better error message than a generic 403.
if (task.owner_id !== session.user.id) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

// ❌
// Check if owner matches
if (task.owner_id !== session.user.id) {
```

---

## Git Commit Messages

Use Conventional Commits:

```
feat: add task creation form
fix: resolve duplicate key error on task insert
docs: update api-contracts with tasks routes
refactor: extract task validation to shared schema
chore: upgrade tanstack-query to v5
```

Format: `<type>: <short description>`

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

---

## What Agents Must Not Do

- Do not install new npm packages without instruction.
- Do not modify files in `components/ui/` except to add props to existing components (e.g. loading, icon, iconPosition on Button). Do not change base styling or variants of shadcn primitives.
- Do not use `console.log` in production code (use `console.error` for real errors).
- Do not hardcode user IDs, secrets, or environment values.
- Do not write raw SQL inside components or hooks — only in migrations or server-side Supabase calls.
- Do not skip Zod validation on API routes.
- Do not bypass RLS using the service role key in user-facing routes.
