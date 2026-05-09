"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

interface GlassBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const GlassBreadcrumbs = ({ items, className = "" }: GlassBreadcrumbsProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`
        flex items-center p-1.5 px-3 md:px-4 
        w-full max-w-full /* Cambiado de w-fit a w-full para control */
        bg-white/30 dark:bg-slate-900/30 backdrop-blur-md 
        border border-white/20 dark:border-slate-800/50 rounded-full 
        overflow-x-auto scrollbar-hide /* Permite scroll si algo falla */
        ${className}
      `}
    >
      <div className="flex items-center shrink-0">
        <Link href="/" className="text-slate-400 hover:text-violet-500 transition-colors duration-200 p-1">
          <Home size={14} />
        </Link>
      </div>

      <div className="flex items-center min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center min-w-0">
              <ChevronRight size={12} className="mx-1 text-slate-300 dark:text-slate-600 shrink-0" />

              {isLast ? (
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400 truncate">
                  {item.label}
                </motion.span>
              ) : (
                <Link href={item.href || "#"} className="flex items-center gap-1 text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 min-w-0">
                  {item.icon && <item.icon size={12} className="shrink-0" />}
                  {/* El texto intermedio se oculta en móviles muy pequeños para ahorrar espacio */}
                  <span className="hidden sm:inline truncate max-w-[80px] md:max-w-none">{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
