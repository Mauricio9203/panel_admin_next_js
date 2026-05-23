import { supabaseAdmin } from "@/lib/supabaseAdmin";
import TituloModulo from "@/components/ui/TituloModulo";
import { History } from "lucide-react";
import AuditoriaTable from "./AuditoriaTable";

export const dynamic = "force-dynamic";

/* ─── Tipo exportado (lo usa AuditoriaTable) ─────────────────────────────── */
export type AuditEntry = {
  id:          string;
  user_email:  string;
  action:      string;
  entity:      string;
  entity_id:   string | null;
  detail:      string | null;
  created_at:  string;
};

/* ─── Página ─────────────────────────────────────────────────────────────── */
export default async function AuditoriaPage() {
  const { data, error } = await supabaseAdmin
    .from("audit_log")
    .select("id, user_email, action, entity, entity_id, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Error cargando el log: {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Log de Auditoría" variant="violet" icon={History} />

      <div className="w-full min-w-0 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <AuditoriaTable data={(data as AuditEntry[]) ?? []} />
      </div>
    </div>
  );
}
