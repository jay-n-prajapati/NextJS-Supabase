"use client";

import { useState, useActionState } from "react";
import { updateItemAction, deleteItem } from "@/app/actions/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Item } from "@/types/database";

type ItemRowProps = {
  item: Item & { created_by?: string };
  showActions: "own" | "all";
};

export function ItemRow({ item }: ItemRowProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(updateItemAction, { error: null as string | null });

  async function handleDelete() {
    const result = await deleteItem(item.id);
    if (!result.error) setOpen(false);
  }

  const canEdit = true;

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{item.title}</p>
        {item.description && (
          <p className="text-muted-foreground text-sm truncate">{item.description}</p>
        )}
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit item</DialogTitle>
              </DialogHeader>
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                {state?.error && (
                  <p className="text-destructive text-sm">{state.error}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor={`title-${item.id}`}>Title</Label>
                  <Input
                    id={`title-${item.id}`}
                    name="title"
                    defaultValue={item.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${item.id}`}>Description (optional)</Label>
                  <Input
                    id={`desc-${item.id}`}
                    name="description"
                    defaultValue={item.description ?? ""}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </li>
  );
}
