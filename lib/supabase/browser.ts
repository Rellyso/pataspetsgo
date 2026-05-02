import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient<Database>>;

let browserClient: BrowserSupabaseClient | undefined;

export function getSupabaseBrowserClient(): BrowserSupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  );

  return browserClient;
}
