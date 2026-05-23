import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la service_role key.
 * Bypasa RLS — usar SOLO en Server Components y Server Actions.
 * NUNCA importar desde código "use client".
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  }
);
