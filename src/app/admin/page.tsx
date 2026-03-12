"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemsList } from "@/components/dashboard/items-list";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Item } from "@/types/database";

async function fetchItems(): Promise<Item[]> {
  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("items")
    .select("id, title, description, created_at, updated_at, created_by")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Item[];
}

export default function AdminPage() {
  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.items.all,
    queryFn: fetchItems,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin — All items</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete any item. This area is restricted to admins.
        </p>
      </div>
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading items...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load items."}
        </p>
      )}
      {items && !isLoading && !isError && (
        <ItemsList items={items} showActions="all" />
      )}
    </div>
  );
}
