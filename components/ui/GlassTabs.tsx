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
    violet: "bg-violet-500 shadow-violet-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    slate: "bg-slate-600 shadow-slate-600/20",
  };

  return (
    <div className="flex p-1 gap-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-xl w-fit">
      {options.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300
              ${isActive ? "text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}
            `}
          >
            {/* El "fondo" animado que se mueve entre pestañas */}
            {isActive && <motion.div layoutId="activeTabBackground" className={`absolute inset-0 z-0 rounded-lg shadow-lg ${colorMap[variant]}`} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}

            {/* Contenido de la pestaña */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
