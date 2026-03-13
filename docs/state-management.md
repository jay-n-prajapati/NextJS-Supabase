# State Management

## Philosophy

| State Type | Tool |
|---|---|
| Server state (API data) | TanStack Query |
| Form state | React Hook Form |
| Global UI state | React Context (sparingly) |
| Local component state | `useState` / `useReducer` |

No Redux. No Zustand unless justified for complex cross-cutting UI state.

---

## TanStack Query Setup

```tsx
// app/layout.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,  // 5 minutes
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## Query Key Conventions

Query keys must be consistent and predictable. Define them as constants.

```ts
// hooks/use-tasks.ts

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
}
```

---

## Hook Pattern

One file per resource in `hooks/`. Each file exports query hooks and mutation hooks.

```ts
// hooks/use-tasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types'

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
}

// --- Queries ---

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async (): Promise<Task[]> => {
      const { data } = await api.get<{ data: Task[] }>('/tasks')
      return data.data
    },
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async (): Promise<Task> => {
      const { data } = await api.get<{ data: Task }>(`/tasks/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

// --- Mutations ---

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TaskCreateInput): Promise<Task> => {
      const { data } = await api.post<{ data: Task }>('/tasks', input)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: TaskUpdateInput & { id: string }): Promise<Task> => {
      const { data } = await api.patch<{ data: Task }>(`/tasks/${id}`, input)
      return data.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
```

---

## Optimistic Updates

Use optimistic updates when the UX requires immediate feedback (e.g., toggling a status).

```ts
useMutation({
  mutationFn: updateTask,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
    const previousTasks = queryClient.getQueryData(taskKeys.lists())

    queryClient.setQueryData(taskKeys.lists(), (old: Task[]) =>
      old.map(t => t.id === newData.id ? { ...t, ...newData } : t)
    )

    return { previousTasks }
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(taskKeys.lists(), context?.previousTasks)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
  },
})
```

---

## Form + Mutation Integration

```tsx
const form = useForm<TaskCreateInput>({ resolver: zodResolver(taskCreateSchema) })
const { mutate, isPending } = useCreateTask()

const onSubmit = (data: TaskCreateInput) => {
  mutate(data, {
    onSuccess: () => {
      form.reset()
      toast.success('Task created')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
```
