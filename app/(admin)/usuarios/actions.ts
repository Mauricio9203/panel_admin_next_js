"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { assertRole } from "@/lib/assertRole";
import type { UserRole } from "@/components/AuthProvider";

/**
 * Actualiza (o crea) el rol de un usuario en la tabla profiles.
 * Solo admins pueden ejecutar esta acción.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  accessToken: string
): Promise<void> {
  await assertRole(accessToken, ["admin"]);

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
 * Solo admins pueden ejecutar esta acción.
 */
export async function deleteUser(
  userId: string,
  accessToken: string
): Promise<void> {
  await assertRole(accessToken, ["admin"]);

  await supabaseAdmin.from("profiles").delete().eq("id", userId);

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}

/**
 * Elimina múltiples usuarios en paralelo.
 * Solo admins pueden ejecutar esta acción.
 */
export async function deleteUsers(
  userIds: string[],
  accessToken: string
): Promise<void> {
  await assertRole(accessToken, ["admin"]);

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
 * Solo admins pueden ejecutar esta acción.
 */
export async function updateUsersRole(
  userIds: string[],
  newRole: UserRole,
  accessToken: string
): Promise<void> {
  await assertRole(accessToken, ["admin"]);

  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      userIds.map((id) => ({ id, role: newRole, updated_at: now })),
      { onConflict: "id" }
    );

  if (error) throw new Error(error.message);
}
