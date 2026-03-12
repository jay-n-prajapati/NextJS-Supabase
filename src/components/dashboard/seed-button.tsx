"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { QUERY_KEYS } from "@/constants/query-keys";

const DEMO_ITEMS = [
  { title: "Welcome item", description: "First item in the app." },
  { title: "Getting started", description: "Edit or delete this from the dashboard." },
  { title: "Demo item", description: "Seed data for a populated first visit." },
] as const;

export function SeedButton() {
  const supabase = getBrowserSupabaseClient();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { count } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true });

      if (count && count > 0) {
        return { message: "You already have items. No seed needed." };
      }

      const { error } = await supabase.from("items").insert(
        DEMO_ITEMS.map((item) => ({
          ...item,
          created_by: user.id,
        }))
      );

      if (error) {
        throw new Error(error.message);
      }

      return { message: "Demo items added." };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items.all });
      if (result?.message) {
        toast.success(result.message);
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to seed demo items.";
      toast.error(message);
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => mutate()}
      loading={isPending}
      loadingText="Seeding..."
    >
      Seed demo items
    </Button>
  );
}
