"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Verifica el token y devuelve el user id.
 * Cualquier usuario autenticado puede actualizar su propio perfil.
 */
async function getAuthUserId(accessToken: string): Promise<string> {
  if (!accessToken) throw new Error("No autenticado");
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) throw new Error("Sesión inválida o expirada");
  return user.id;
}

/**
 * Actualiza el nombre visible en auth.users.user_metadata.
 * La tabla profiles NO tiene full_name — ese dato vive en user_metadata.
 */
export async function updateProfileName(
  name: string,
  accessToken: string
): Promise<void> {
  const userId = await getAuthUserId(accessToken);

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { full_name: name.trim() },
  });

  if (error) throw new Error(`Error al actualizar el nombre: ${error.message}`);
}

/** Cambia la contraseña del usuario usando la service_role key. */
export async function updatePassword(
  newPassword: string,
  accessToken: string
): Promise<void> {
  const userId = await getAuthUserId(accessToken);

  if (newPassword.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres");

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) throw new Error(`Error al cambiar la contraseña: ${error.message}`);
}
