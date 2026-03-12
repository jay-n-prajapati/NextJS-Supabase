"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { QUERY_KEYS } from "@/constants/query-keys";
import { updateItemSchema, type ItemFormValues } from "@/types/schemas";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

type ItemRowProps = {
  item: Item & { created_by?: string };
  showActions: "own" | "all";
};

export function ItemRow({ item }: ItemRowProps) {
  const [open, setOpen] = React.useState(false);
  const supabase = getBrowserSupabaseClient();
  const queryClient = useQueryClient();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      title: item.title,
      description: item.description ?? "",
    },
  });

  const { mutateAsync: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("items")
        .update({
          title: values.title.trim(),
          description: values.description?.trim() || null,
        })
        .eq("id", item.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.all });
      toast.success("Item updated.");
      setOpen(false);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update item.";
      toast.error(message);
    },
  });

  const { mutateAsync: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("items").delete().eq("id", item.id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.all });
      toast.success("Item deleted.");
      setOpen(false);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete item.";
      toast.error(message);
    },
  });

  const canEdit = true;

  const onSubmit = async (values: ItemFormValues) => {
    await updateItem(values);
  };

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.title}</p>
        {item.description && (
          <p className="truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit item</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`title-${item.id}`}>Title</Label>
                  <Input
                    id={`title-${item.id}`}
                    {...form.register("title")}
                    disabled={isUpdating}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${item.id}`}>Description (optional)</Label>
                  <Input
                    id={`desc-${item.id}`}
                    {...form.register("description")}
                    disabled={isUpdating}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    loading={isUpdating}
                    loadingText="Saving..."
                  >
                    Save
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        type="button"
                        variant="destructive"
                        loading={isDeleting}
                      >
                        Delete
                      </Button>
                    }
                    title="Delete this item?"
                    description="This action cannot be undone."
                    onConfirm={async () => {
                      await deleteItem();
                    }}
                    isPending={isDeleting}
                  />
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </li>
  );
}
