"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DEMO_ITEMS = [
  { title: "Welcome item", description: "First item in the app." },
  { title: "Getting started", description: "Edit or delete this from the dashboard." },
  { title: "Demo item", description: "Seed data for a populated first visit." },
];

export async function seedDemoItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { count } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true });

  if (count && count > 0) {
    return { error: null, message: "You already have items. No seed needed." };
  }

  const { error } = await supabase.from("items").insert(
    DEMO_ITEMS.map((item) => ({
      ...item,
      created_by: user.id,
    }))
  );
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { error: null, message: "Demo items added." };
}
