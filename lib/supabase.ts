import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase compartido para componentes del lado del cliente.
 * Usado por AuthProvider, SessionGuard, login page y cualquier componente
 * que necesite interactuar con Supabase Auth.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
