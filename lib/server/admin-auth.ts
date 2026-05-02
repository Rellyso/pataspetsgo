import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

function normalizeNextPath(nextPath?: string) {
  if (!nextPath?.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin";
  }

  return nextPath;
}

function buildLoginPath(nextPath?: string) {
  const safeNextPath = normalizeNextPath(nextPath);
  const params = new URLSearchParams();

  if (safeNextPath !== "/admin") {
    params.set("next", safeNextPath);
  }

  const query = params.toString();
  return query ? `/auth/login?${query}` : "/auth/login";
}

export async function getAdminAccessState() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "anonymous" as const,
      profile: null,
      user: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return {
      status: "forbidden" as const,
      profile: profile ?? null,
      user,
    };
  }

  return {
    status: "admin" as const,
    profile,
    user,
  };
}

export async function requireAdmin(nextPath?: string) {
  const accessState = await getAdminAccessState();

  if (accessState.status === "anonymous") {
    redirect(buildLoginPath(nextPath));
  }

  if (accessState.status === "forbidden") {
    redirect("/auth/access-denied");
  }

  return accessState;
}

export { normalizeNextPath };
