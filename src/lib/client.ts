import { createBrowserClient } from "@supabase/ssr";
import { getBrowserSupabaseConfig } from "@/lib/supabase-env";

export function createClient() {
  const { url, key } = getBrowserSupabaseConfig();

  return createBrowserClient(url, key);
}
