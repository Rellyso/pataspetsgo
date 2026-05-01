import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function createAnonClient(): SupabaseClient {
  return createClient(
    requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  );
}

export function createServiceRoleClient(): SupabaseClient {
  return createClient(
    requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
  );
}
