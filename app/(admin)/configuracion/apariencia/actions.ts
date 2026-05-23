"use server";

import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PanelTheme } from "@/config/theme";

/**
 * Persiste el tema en la base de datos e invalida el caché
 * para que el nuevo tema se aplique en todos los layouts.
 */
export async function saveTheme(theme: PanelTheme): Promise<void> {
  const { error } = await supabaseAdmin
    .from("theme_config")
    .upsert({ id: 1, theme }, { onConflict: "id" });

  if (error) throw new Error(`Error al guardar el tema: ${error.message}`);

  // Invalida el caché del loader → el próximo request recarga el tema
  revalidateTag("panel-theme", "default");
}
