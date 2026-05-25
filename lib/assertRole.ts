import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type Role = "admin" | "manager" | "viewer";

/**
 * Verifica que el access token JWT pertenece a un usuario autenticado
 * con uno de los roles requeridos. Úsalo al inicio de cada Server Action
 * que requiera permisos específicos.
 *
 * El token lo provee el cliente desde `supabase.auth.getSession()`.
 * La firma JWT se valida con la service_role key (no se confía en el cliente).
 * El rol se lee siempre desde la DB, nunca desde el token.
 *
 * @throws Error si el token es inválido, expiró, o el rol no está permitido.
 */
export async function assertRole(
  accessToken: string,
  allowedRoles: Role[]
): Promise<void> {
  if (!accessToken) throw new Error("No autenticado");

  // Valida la firma del JWT usando la service_role key
  const { data: { user }, error: authError } =
    await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !user) throw new Error("Sesión inválida o expirada");

  // Lee el rol desde la DB — no confiar en datos del cliente
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) throw new Error("Perfil de usuario no encontrado");

  if (!allowedRoles.includes(profile.role as Role)) {
    throw new Error(
      `Permiso denegado — se requiere: ${allowedRoles.join(" o ")}`
    );
  }
}
