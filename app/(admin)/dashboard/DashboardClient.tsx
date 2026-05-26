"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Users, ScrollText, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

import ChartCard    from "@/components/ChartCard";
import TituloModulo from "@/components/ui/TituloModulo";
import Grid         from "@/components/ui/Grid";
import StatCard     from "@/components/ui/StatCard";
import PieChartCustom from "@/components/charts/PieChartCustom";

/* ── Colores por rol ───────────────────────────────────────────────────── */
const ROLE_COLORS = ["#a78bfa", "#34d399", "#fbbf24"]; // admin, manager, viewer

/* ── Badges de acción (igual que AuditoriaTable) ──────────────────────── */
const ACTION_STYLES: Record<string, string> = {
  editar:                   "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300",
  eliminar:                 "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_masivo:          "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_usuario:         "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_masivo_usuarios: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  cambiar_rol:              "bg-primary/10 text-primary",
  cambiar_rol_masivo:       "bg-primary/10 text-primary",
  crear:                    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300",
};
const DEFAULT_BADGE = "bg-muted text-muted-foreground";

/* ── Tiempo relativo ───────────────────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

/* ── Tipos ─────────────────────────────────────────────────────────────── */
type RoleEntry = { name: string; value: number };

type RecentLog = {
  id:         string;
  user_email: string;
  action:     string;
  entity:     string;
  detail:     string | null;
  created_at: string;
};

type Props = {
  totalUsers:       number;
  totalLogs:        number;
  roleDistribution: RoleEntry[];
  recentLogs:       RecentLog[];
};

/* ── Componente ─────────────────────────────────────────────────────────── */
export default function DashboardClient({
  totalUsers,
  totalLogs,
  roleDistribution,
  recentLogs,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  const adminCount = roleDistribution.find((r) => r.name === "Admin")?.value ?? 0;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-transparent">
      <TituloModulo titulo="Dashboard" variant="violet" icon={LayoutDashboard} />

      {/* ── MÉTRICAS ─────────────────────────────────────────────────────── */}
      <Grid cols={12} gap={4}>
        {/* Link ocupa el col-span; StatCard sin sm/md para no duplicar la clase */}
        <Link href="/usuarios" className="col-span-12 sm:col-span-6 md:col-span-4 block">
          <StatCard
            title="Usuarios registrados"
            value={totalUsers.toLocaleString("es-CL")}
            icon={Users}
            color="emerald"
            className="h-full hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
          />
        </Link>
        <Link href="/auditoria" className="col-span-12 sm:col-span-6 md:col-span-4 block">
          <StatCard
            title="Logs de auditoría"
            value={totalLogs.toLocaleString("es-CL")}
            icon={ScrollText}
            color="amber"
            description="Acciones registradas"
            className="h-full hover:border-amber-400/40 hover:shadow-lg transition-all cursor-pointer"
          />
        </Link>
        <StatCard
          title="Administradores"
          value={adminCount}
          icon={ShieldCheck}
          color="violet"
          sm={12} md={4}
          description={`de ${totalUsers} usuarios totales`}
        />
      </Grid>

      {/* ── GRÁFICO + LOGS RECIENTES ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">

        {/* Distribución por rol */}
        <ChartCard title="Usuarios por rol" className="h-auto sm:h-72">
          <div className="flex flex-col items-center gap-3">
            <PieChartCustom
              data={roleDistribution}
              colors={ROLE_COLORS}
              height={200}
            />
            <div className="flex flex-wrap justify-center gap-4 pb-1">
              {roleDistribution.map((r, i) => (
                <div key={r.name} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: ROLE_COLORS[i] }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {r.name}{" "}
                    <span className="font-semibold text-foreground">{r.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Actividad reciente */}
        <ChartCard title="Actividad reciente" className="h-auto sm:h-72">
          {/* sm:h-full + sm:overflow-hidden para respetar el h-72 en desktop */}
          <div className="flex flex-col sm:h-full sm:overflow-hidden">

            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sin actividad registrada aún.
              </p>
            ) : (
              /* flex-1 + overflow-y-auto: la lista scrollea dentro del espacio disponible */
              <ul className="sm:flex-1 sm:overflow-y-auto sm:min-h-0 flex flex-col divide-y divide-border">
                {recentLogs.map((log) => (
                  <li key={log.id} className="flex items-start gap-3 py-2 first:pt-0 shrink-0">
                    <span
                      className={`shrink-0 mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${ACTION_STYLES[log.action] ?? DEFAULT_BADGE}`}
                    >
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground truncate">
                        {log.detail ?? log.entity}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {log.user_email}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground/70 whitespace-nowrap">
                      {timeAgo(log.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Footer fijo — no scrollea */}
            <div className="shrink-0 pt-2.5 mt-2 border-t border-border">
              <Link
                href="/auditoria"
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                Ver todos los logs
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}
