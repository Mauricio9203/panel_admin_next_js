"use client";

import { LucideIcon } from "lucide-react";

type SubtituloModuloProps = {
  titulo: string;
  descripcion?: string;
  variant?: "default" | "violet";
  icon?: LucideIcon;
};

export default function SubtituloModulo({ titulo, descripcion, variant = "default", icon: Icon }: SubtituloModuloProps) {
  const isViolet = variant === "violet";

  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-center gap-2">
        {/* PEQUEÑO ACCENTO O ICONO */}
        {Icon ? <Icon size={18} className={isViolet ? "text-violet-500" : "text-neutral-500"} /> : <div className={`w-1 h-4 rounded-full ${isViolet ? "bg-violet-500" : "bg-neutral-400"}`} />}

        <h3
          className={`
          text-sm font-bold tracking-tight uppercase
          ${isViolet ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-600 dark:text-neutral-400"}
        `}
        >
          {titulo}
        </h3>
      </div>

      {descripcion && <p className="text-xs text-neutral-500 dark:text-neutral-500 ml-3">{descripcion}</p>}
    </div>
  );
}
