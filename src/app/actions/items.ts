"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createItem(
  _prev: { error: string | null } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  if (!title?.trim()) return { error: "Title is required" };

  const { error } = await supabase.from("items").insert({
    title: title.trim(),
    description: description?.trim() || null,
    created_by: user.id,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { error: null };
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: item } = await supabase
    .from("items")
    .select("created_by")
    .eq("id", id)
    .single();

  if (!item) return { error: "Item not found" };
  const isAdmin = profile?.role === "admin";
  const isOwner = item.created_by === user.id;
  if (!isAdmin && !isOwner) return { error: "Not allowed to edit this item" };

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  if (!title?.trim()) return { error: "Title is required" };

  const { error } = await supabase
    .from("items")
    .update({
      title: title.trim(),
      description: description?.trim() || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { error: null };
}

export async function updateItemAction(
  _prev: { error: string | null } | null,
  formData: FormData
) {
  const id = formData.get("id") as string;
  if (!id) return { error: "Missing item id" };
  return updateItem(id, formData);
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: item } = await supabase
    .from("items")
    .select("created_by")
    .eq("id", id)
    .single();

  if (!item) return { error: "Item not found" };
  const isAdmin = profile?.role === "admin";
  const isOwner = item.created_by === user.id;
  if (!isAdmin && !isOwner) return { error: "Not allowed to delete this item" };

  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { error: null };
}
