import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";

type SupabaseAdminQueryClient = {
  from: (table: string) => any;
};

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient(): SupabaseAdminQueryClient {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  adminClient ??= createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  return adminClient as unknown as SupabaseAdminQueryClient;
}
