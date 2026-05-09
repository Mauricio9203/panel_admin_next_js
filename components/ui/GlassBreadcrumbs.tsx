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
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 p-2 px-4 w-fit bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-full ${className}`}>
      {/* Icono de inicio siempre presente opcionalmente */}
      <Link href="/" className="text-slate-400 hover:text-violet-500 transition-colors duration-200">
        <Home size={14} />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            <ChevronRight size={14} className="mx-1 text-slate-300 dark:text-slate-600" />

            {isLast ? (
              <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                {item.label}
              </motion.span>
            ) : (
              <Link href={item.href || "#"} className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                {item.icon && <item.icon size={12} />}
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
