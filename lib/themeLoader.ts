import { unstable_noStore } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_THEME, type PanelTheme } from "@/config/theme";

/**
 * Carga el tema desde la base de datos.
 * unstable_noStore() impide que Next.js cachee este componente
 * en el full-route cache de producción (Vercel CDN).
 */
export async function loadTheme(): Promise<PanelTheme> {
  unstable_noStore(); // fuerza render dinámico en cada request
  try {
    const { data, error } = await supabaseAdmin
      .from("theme_config")
      .select("theme")
      .eq("id", 1)
      .single();

    const theme = data?.theme as Record<string, any> | null;
    if (error || !theme || Object.keys(theme).length === 0) return DEFAULT_THEME;
    return theme as PanelTheme;
  } catch {
    return DEFAULT_THEME;
  }
}
