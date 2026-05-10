"use client";

import { LucideAppWindow, Users, CircleDollarSign, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from "recharts";
import TituloModulo from "@/components/ui/TituloModulo";
import Card from "@/components/ui/Card";
import ChartCard from "@/components/ui/ChartCard";

export default function DashboardOperativoPage() {
  const miniChartData = [
    { name: "Lun", value: 400 },
    { name: "Mar", value: 300 },
    { name: "Mie", value: 200 },
    { name: "Jue", value: 278 },
    { name: "Vie", value: 189 },
    { name: "Sab", value: 239 },
    { name: "Dom", value: 349 },
  ];

  return (
    <div className="p-4 md:p-6 min-w-0 w-full space-y-6">
      {/* 1. HEADER */}
      <TituloModulo titulo="Dashboard Operativo" variant="violet" icon={LucideAppWindow} />

      {/* 2. FILA DE MÉTRICAS (Cards Simples) */}
      <div className="grid grid-cols-12 gap-4">
        <Card md={4} className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Usuarios Totales</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">1,240</p>
          </div>
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500">
            <Users size={24} />
          </div>
        </Card>

        <Card md={4} className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Ventas Netas</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">$8,320</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CircleDollarSign size={24} />
          </div>
        </Card>

        <Card md={4} className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Conversión</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">4.2%</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <TrendingUp size={24} />
          </div>
        </Card>
      </div>

      {/* 3. FILA DE GRÁFICOS (ChartCards) */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Gráfico de Crecimiento */}
        <ChartCard title="Tendencia de Crecimiento" md={4} className="group">
          <div className="flex items-end justify-between mb-4">
            <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.5%</span>
            <p className="text-xs text-slate-400">Últimos 7 días</p>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="step" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico de Volumen */}
        <ChartCard title="Volumen Semanal" md={4} className="group">
          <div className="flex items-end justify-between mb-4">
            <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">-2.1%</span>
            <p className="text-xs text-slate-400">Promedio Diario</p>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniChartData}>
                <Bar dataKey="value" fill="#34d399" radius={[4, 4, 4, 4]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico de Proyección */}
        <ChartCard title="Proyección Operativa" md={4}>
          <div className="flex items-end justify-between mb-4">
            <span className="text-xs text-slate-400 font-bold bg-slate-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">Estimado</span>
            <p className="text-xs text-slate-400">Meta: 5%</p>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniChartData}>
                <Area type="monotone" dataKey="value" stroke="#fbbf24" fill="none" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* --- Card de Resumen al final (12 cols) --- */}
        <ChartCard title="Análisis Detallado" colSpan={12} className="h-64">
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-xl">
            <p className="text-slate-400 text-sm">Contenido de tabla o gráfico extendido aquí</p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
