const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function requireSupabaseEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
) {
  const value = name === "NEXT_PUBLIC_SUPABASE_URL" ? supabaseUrl : supabasePublishableKey;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
