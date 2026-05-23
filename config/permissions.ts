import type { UserRole } from "@/components/AuthProvider";

/* ─── Tipo de acción ──────────────────────────────────────────────────────────
   Para agregar nuevas acciones en el futuro, solo amplía este union type.
   Luego actualiza el mapa PERMISSIONS de cada rol según corresponda.
──────────────────────────────────────────────────────────────────────────── */
export type Action = "crear" | "editar" | "eliminar" | "exportar";

/* ─── Mapa de permisos por rol ────────────────────────────────────────────────
   Cada rol lista explícitamente las acciones que puede realizar.
   Un rol sin ninguna acción listada solo puede leer.
──────────────────────────────────────────────────────────────────────────── */
export const PERMISSIONS: Record<UserRole, Action[]> = {
  admin:   ["crear", "editar", "eliminar", "exportar"],
  manager: ["crear", "editar", "exportar"],
  viewer:  [],
};
