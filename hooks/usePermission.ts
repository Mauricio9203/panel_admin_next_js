import { useAuth } from "@/components/AuthProvider";
import { PERMISSIONS, type Action } from "@/config/permissions";

/**
 * Retorna `true` si el usuario actual tiene permiso para ejecutar la acción.
 * Retorna `false` mientras el rol está cargando o no está asignado.
 *
 * @example
 *   const canEditar   = usePermission("editar");
 *   const canEliminar = usePermission("eliminar");
 */
export function usePermission(action: Action): boolean {
  const { role } = useAuth();
  if (!role) return false;
  return PERMISSIONS[role].includes(action);
}
