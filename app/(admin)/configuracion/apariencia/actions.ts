"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PanelTheme } from "@/config/theme";

/**
 * Persiste el tema en la base de datos.
 * loadTheme no usa caché, así que la próxima carga de página
 * leerá el tema nuevo directamente desde DB.
 */
export async function saveTheme(theme: PanelTheme): Promise<void> {
  const { error } = await supabaseAdmin
    .from("theme_config")
    .upsert({ id: 1, theme }, { onConflict: "id" });

  if (error) {
    console.error("[saveTheme] Supabase error:", JSON.stringify(error));
    throw new Error(`Error al guardar el tema: ${error.message}`);
  }
}
