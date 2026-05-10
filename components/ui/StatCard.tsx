"use client";

import { LucideIcon } from "lucide-react";
import Card from "./Card"; // Reutilizamos tu componente Card base
import { ReactNode } from "react";

type StatColor = "violet" | "emerald" | "amber" | "rose" | "blue" | "zinc";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    isUp: boolean;
  };
  color?: StatColor;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, color = "zinc", md = 4, description }: StatCardProps) {
  // Mapeo de estilos según el color elegido
  const colorStyles: Record<StatColor, string> = {
    violet: "text-violet-600 bg-violet-500/10 border-violet-200/50 dark:text-violet-400 dark:bg-violet-500/20",
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-500/20",
    amber: "text-amber-600 bg-amber-500/10 border-amber-200/50 dark:text-amber-400 dark:bg-amber-500/20",
    rose: "text-rose-600 bg-rose-500/10 border-rose-200/50 dark:text-rose-400 dark:bg-rose-500/20",
    blue: "text-blue-600 bg-blue-500/10 border-blue-200/50 dark:text-blue-400 dark:bg-blue-500/20",
    zinc: "text-zinc-600 bg-zinc-500/10 border-zinc-200/50 dark:text-zinc-400 dark:bg-zinc-500/20",
  };

  return (
    <Card md={md} className="relative overflow-hidden group transition-all duration-300 hover:shadow-md hover:border-violet-300/50 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* Título: Siempre presente */}
          <p className="text-[10px] uppercase font-black tracking-[0.15em] text-gray-400 dark:text-zinc-500">{title}</p>

          {/* Valor: Siempre presente con tipografía pesada */}
          <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tabular-nums">{value}</h3>

          {/* Tendencia y Descripción: Se adaptan si existen */}
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${trend.isUp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                {trend.isUp ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {description && <span className="text-[10px] text-gray-400 dark:text-zinc-500 italic">{description}</span>}
          </div>
        </div>

        {/* Icono: Solo se renderiza si se pasa por parámetro */}
        {Icon && (
          <div className={`p-2.5 rounded-xl border transition-colors ${colorStyles[color]}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Decoración sutil de fondo (solo visible en hover) */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-transparent to-gray-500/5 rounded-full blur-2xl group-hover:to-violet-500/10 transition-all duration-500" />
    </Card>
  );
}
