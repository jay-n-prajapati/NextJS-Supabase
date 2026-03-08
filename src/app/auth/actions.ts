"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Base URL for auth redirects. Prefer NEXT_PUBLIC_APP_URL; fallback to request host. */
async function getBaseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL;
  if (env) return env.startsWith("http") ? env : `https://${env}`;
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    const proto = h.get("x-forwarded-proto") ?? "https";
    return host ? `${proto}://${host}` : "";
  } catch {
    return "";
  }
}

export async function signInWithPassword(
  _prev: { error: string | null } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  const redirectTo = formData.get("redirectTo") as string | null;
  redirect(redirectTo || "/dashboard");
}

export async function signUpWithPassword(
  _prev: { error: string | null } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string | null;

  const baseUrl = await getBaseUrl();
  const emailRedirectTo = baseUrl
    ? `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent("/auth/email-verified")}`
    : undefined;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
      emailRedirectTo,
    },
  });
  if (error) {
    return { error: error.message };
  }
  redirect("/auth/sign-in?message=Check your email to confirm your account.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

