"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemsList } from "@/components/dashboard/items-list";
import { SeedButton } from "@/components/dashboard/seed-button";
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

export default function DashboardPage() {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            View and manage your items. Users can add and edit their own; admins can manage all.
          </p>
        </div>
        <SeedButton />
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
        <ItemsList items={items} showActions="own" />
      )}
    </div>
  );
}
