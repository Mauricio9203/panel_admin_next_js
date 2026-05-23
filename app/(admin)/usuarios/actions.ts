"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { UserRole } from "@/components/AuthProvider";

/**
 * Actualiza (o crea) el rol de un usuario en la tabla profiles.
 * Usa upsert para cubrir el caso en que el usuario aún no tenga fila en profiles.
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      { id: userId, role: newRole, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) throw new Error(error.message);
}

/**
 * Elimina un usuario de auth.users (y en cascada su fila en profiles).
 * Requiere service_role key — solo llamar desde Server Actions.
 */
export async function deleteUser(userId: string): Promise<void> {
  await supabaseAdmin.from("profiles").delete().eq("id", userId);

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}

/**
 * Elimina múltiples usuarios en paralelo.
 * Borra los perfiles en batch y los usuarios de auth uno a uno (la API admin no tiene bulk delete).
 */
export async function deleteUsers(userIds: string[]): Promise<void> {
  await supabaseAdmin.from("profiles").delete().in("id", userIds);

  const results = await Promise.allSettled(
    userIds.map((id) => supabaseAdmin.auth.admin.deleteUser(id))
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    throw new Error(`Error al eliminar ${failed.length} usuario(s)`);
  }
}

/**
 * Asigna un mismo rol a múltiples usuarios en una sola operación.
 */
export async function updateUsersRole(userIds: string[], newRole: UserRole): Promise<void> {
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      userIds.map((id) => ({ id, role: newRole, updated_at: now })),
      { onConflict: "id" }
    );

  if (error) throw new Error(error.message);
}
