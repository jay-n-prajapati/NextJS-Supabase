"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Role } from "@/constants/roles";

type UseRoleResult = {
  role: Role | null;
  isLoading: boolean;
};

export function useRole(): UseRoleResult {
  const supabase = getBrowserSupabaseClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.profile.current,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return profile as { role: Role } | null;
    },
  });

  return { role: data?.role ?? null, isLoading };
}

