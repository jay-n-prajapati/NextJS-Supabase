# UI System

## Foundation

- **Component library:** shadcn/ui (Radix UI primitives + Tailwind)
- **Styling:** Tailwind CSS utility classes
- **Icons:** Lucide React
- **Theming:** CSS variables defined in `globals.css`

Do not install additional component libraries.

**shadcn MCP:** When using Cursor/Codex, the shadcn MCP tool is available to browse the component registry, get implementations, and add components. Prefer using it for accurate props and up-to-date code.

---

## shadcn Usage

Install components via CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
```

Generated files land in `components/ui/`. **Do not edit these files.** If customization is needed, wrap the primitive in a component in `components/shared/`.

**Common components for a SaaS dashboard:** button, dialog, form, table, input, select, dropdown-menu, sheet, tabs, card, badge, skeleton, sonner (toast).

---

## Theming

CSS variables in `globals.css` control all colors. Use semantic tokens, not raw color values.

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  /* ... */
}
```

**Use semantic tokens in all Tailwind classes:**

```tsx
// ✅ Correct
<p className="text-muted-foreground">

// ❌ Wrong
<p className="text-gray-500">
```

---

## Commonly Used Components

### Button

```tsx
import { Button } from '@/components/ui/button'

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
<Button disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Save
</Button>
```

### Dialog

```tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Data Table

For tabular data, use the shadcn DataTable pattern with TanStack Table.

```tsx
// components/shared/data-table.tsx wraps the TanStack Table + shadcn Table primitives
import { DataTable } from '@/components/shared/data-table'
import { columns } from './columns'

<DataTable columns={columns} data={tasks} />
```

### Toast

```tsx
import { toast } from 'sonner'

toast.success('Task created')
toast.error('Something went wrong')
toast.loading('Saving...')
```

---

## Layout Patterns

### Dashboard Shell

```tsx
// components/shared/dashboard-shell.tsx
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### Page Layout

```tsx
export default function TasksPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Tasks"
        description="Manage your tasks"
        action={<CreateTaskButton />}
      />
      <div className="mt-6">
        <TaskList />
      </div>
    </DashboardShell>
  )
}
```

---

## Spacing Scale

Follow Tailwind's default scale. Consistent spacing between sections:

| Context | Class |
|---|---|
| Section gap | `mt-6` or `space-y-6` |
| Card padding | `p-6` |
| Inline gap | `gap-2` or `gap-4` |
| Form field spacing | `space-y-4` |

---

## Responsive Design

Mobile-first. Use Tailwind breakpoint prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

Minimum supported width: 375px (mobile).
