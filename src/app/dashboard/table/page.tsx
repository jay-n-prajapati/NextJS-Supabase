import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { ItemsTable } from "@/components/dashboard/items-table";

export default async function DashboardTablePage() {
  await requireAuth();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("id, title, description, created_at, updated_at, created_by")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Table</h1>
        <p className="text-muted-foreground">
          Demo data table with sorting and pagination.
        </p>
      </div>
      <ItemsTable items={items ?? []} pageSize={10} />
    </div>
  );
}
