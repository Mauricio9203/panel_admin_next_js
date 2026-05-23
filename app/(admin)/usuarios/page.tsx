import { supabaseAdmin } from "@/lib/supabaseAdmin";
import TituloModulo from "@/components/ui/TituloModulo";
import { Users } from "lucide-react";
import UsuariosTable from "./UsuariosTable";

export const dynamic = "force-dynamic";

/* ─── Tipo exportado (lo usa UsuariosTable) ──────────────────────────────── */
export type UsuarioConRol = {
  id:               string;
  email:            string;
  full_name:        string | null;
  avatar_url:       string | null;
  role:             string | null;
  created_at:       string;
  last_sign_in_at:  string | null;
};

/* ─── Página ─────────────────────────────────────────────────────────────── */
export default async function UsuariosPage() {
  // Ambas peticiones en paralelo
  const [authResult, profilesResult] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin.from("profiles").select("id, role"),
  ]);

  if (authResult.error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Error cargando usuarios: {authResult.error.message}
      </div>
    );
  }

  // Mapa rápido id → role
  const profileMap = new Map<string, string>(
    (profilesResult.data ?? []).map((p: any) => [p.id, p.role])
  );

  const usuarios: UsuarioConRol[] = authResult.data.users.map((user) => ({
    id:              user.id,
    email:           user.email ?? "",
    full_name:       user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatar_url:      user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    role:            profileMap.get(user.id) ?? null,
    created_at:      user.created_at,
    last_sign_in_at: user.last_sign_in_at ?? null,
  }));

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Gestión de Usuarios" variant="violet" icon={Users} />

      <div className="w-full min-w-0 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <UsuariosTable initialData={usuarios} />
      </div>
    </div>
  );
}
