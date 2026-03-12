"use client";

import { useQuery } from "@tanstack/react-query";
import { ContentContainer } from "@/components/shared/content-container";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { QUERY_KEYS } from "@/constants/query-keys";

type ProfileData = {
  user: { email: string | null } | null;
  profile: { full_name: string | null } | null;
};

async function fetchCurrentUserWithProfile(): Promise<ProfileData> {
  const supabase = getBrowserSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return {
    user: { email: user.email ?? null },
    profile: profile
      ? { full_name: (profile as { full_name: string | null }).full_name }
      : { full_name: null },
  };
}

export default function ProfilePage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.profile.current,
    queryFn: fetchCurrentUserWithProfile,
  });

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading profile...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {(error as Error)?.message ?? "Failed to load profile."}
      </p>
    );
  }

  if (!data || !data.user) {
    return null;
  }

  const { user, profile } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Your account details.
        </p>
      </div>

      <ContentContainer as="section" className="space-y-6">
        <div className="rounded-lg border border-border p-4 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Email</h2>
          <p className="text-foreground">{user.email ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Display name</h2>
          <p className="text-foreground">{profile?.full_name ?? "—"}</p>
        </div>
      </ContentContainer>
    </div>
  );
}
