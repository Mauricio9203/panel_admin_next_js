import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_THEME, type PanelTheme } from "@/config/theme";

/**
 * Carga el tema desde la base de datos con caché de Next.js.
 * Se invalida automáticamente cuando se guarda un nuevo tema
 * (via revalidateTag("panel-theme") en la Server Action).
 */
export const loadTheme = unstable_cache(
  async (): Promise<PanelTheme> => {
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
  },
  ["panel-theme"],
  { revalidate: false, tags: ["panel-theme"] }
);
