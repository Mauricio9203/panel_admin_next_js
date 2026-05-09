"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabOption {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface GlassTabsProps {
  options: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "violet" | "emerald" | "slate";
}

export const GlassTabs = ({ options, activeTab, onChange, variant = "violet" }: GlassTabsProps) => {
  const colorMap = {
    violet: "bg-violet-600 shadow-violet-500/30",
    emerald: "bg-emerald-600 shadow-emerald-500/30",
    slate: "bg-slate-600 shadow-slate-600/30",
  };

  return (
    /* Contenedor con scroll horizontal oculto para móvil */
    <div className="w-full overflow-x-auto scrollbar-hide -mx-1 px-1">
      <div
        className={`
        flex p-1 gap-1 
        bg-white/40 dark:bg-slate-900/40 backdrop-blur-md 
        border border-white/20 dark:border-slate-800/50 rounded-2xl
        w-max min-w-full sm:w-full /* Importante: w-max permite que crezca y sm:w-full lo ajusta en PC */
      `}
      >
        {options.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-5 py-2.5 flex items-center justify-center gap-2 
                text-[10px] md:text-xs font-black uppercase tracking-[0.15em] 
                transition-colors duration-300 flex-1 min-w-fit
                ${isActive ? "text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}
              `}
            >
              {/* Fondo animado */}
              {isActive && <motion.div layoutId="activeTabBackground" className={`absolute inset-0 z-0 rounded-xl shadow-lg ${colorMap[variant]}`} transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}

              {/* Contenido de la pestaña */}
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                {tab.icon && <tab.icon size={14} className="shrink-0" />}
                {/* Texto: se puede ocultar en pantallas ultra-pequeñas si tienes muchas pestañas */}
                <span className={options.length > 3 ? "hidden xs:inline" : "inline"}>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
