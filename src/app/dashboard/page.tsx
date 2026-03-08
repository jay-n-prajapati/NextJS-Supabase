import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { ItemsList } from "@/components/dashboard/items-list";
import { SeedButton } from "@/components/dashboard/seed-button";

export default async function DashboardPage() {
  await requireAuth();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("id, title, description, created_at, updated_at, created_by")
    .order("created_at", { ascending: false });

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
      <ItemsList items={items ?? []} showActions="own" />
    </div>
  );
}
