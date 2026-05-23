import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_THEME, type PanelTheme } from "@/config/theme";

/**
 * Carga el tema desde la base de datos sin caché.
 * El tema es un JSON pequeño (~1 KB) que cambia raramente,
 * por lo que fetchear en cada request es aceptable y garantiza
 * que siempre se sirve el tema correcto tras un guardado.
 */
export async function loadTheme(): Promise<PanelTheme> {
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
