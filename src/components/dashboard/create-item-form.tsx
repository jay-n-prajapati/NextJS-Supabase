"use client";

import { useActionState } from "react";
import { createItem } from "@/app/actions/items";
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

export function CreateItemForm() {
  const [state, formAction] = useActionState(createItem, {
    error: null as string | null,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create item</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="new-title">Title</Label>
            <Input id="new-title" name="title" required placeholder="Item title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-description">Description (optional)</Label>
            <Input
              id="new-description"
              name="description"
              placeholder="Brief description"
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
