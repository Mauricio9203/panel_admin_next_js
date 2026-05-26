import DashboardClient from "./DashboardClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function Page() {
  /* ── Total de usuarios ──────────────────────────────────────────────── */
  const { count: totalUsers } = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact", head: true });

  /* ── Distribución por rol ───────────────────────────────────────────── */
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("role");

  const roleDistribution = [
    { name: "Admin",   value: profiles?.filter((p) => p.role === "admin").length   ?? 0 },
    { name: "Manager", value: profiles?.filter((p) => p.role === "manager").length ?? 0 },
    { name: "Viewer",  value: profiles?.filter((p) => p.role === "viewer").length  ?? 0 },
  ];

  /* ── Total de logs de auditoría ─────────────────────────────────────── */
  const { count: totalLogs } = await supabaseAdmin
    .from("audit_log")
    .select("*", { count: "exact", head: true });

  /* ── Últimos 8 logs ─────────────────────────────────────────────────── */
  const { data: recentLogs } = await supabaseAdmin
    .from("audit_log")
    .select("id, user_email, action, entity, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <DashboardClient
      totalUsers={totalUsers ?? 0}
      totalLogs={totalLogs ?? 0}
      roleDistribution={roleDistribution}
      recentLogs={recentLogs ?? []}
    />
  );
}
