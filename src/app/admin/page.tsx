import { createClient } from "@/lib/supabase/server";
import { ItemsList } from "@/components/dashboard/items-list";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("id, title, description, created_at, updated_at, created_by")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin — All items</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete any item. This area is restricted to admins.
        </p>
      </div>
      <ItemsList items={items ?? []} showActions="all" />
    </div>
  );
}
