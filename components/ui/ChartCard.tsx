"use client";

import { ReactNode } from "react";

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ChartCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  // Props para el sistema de 12 columnas
  colSpan?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
};

export default function ChartCard({ title, children, className = "", colSpan = 12, md, lg }: ChartCardProps) {
  // Mapeo de seguridad para Tailwind
  const spanStyles: Record<ColSpan, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };

  const mdStyles: Record<ColSpan, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  };

  const lgStyles: Record<ColSpan, string> = {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
    10: "lg:col-span-10",
    11: "lg:col-span-11",
    12: "lg:col-span-12",
  };

  return (
    <div
      className={`
        h-72
        w-full
        flex
        flex-col
        rounded-sm
        p-5
        bg-white/80 dark:bg-zinc-800/70
        border border-violet-200 dark:border-zinc-700
        shadow-sm dark:shadow-none
        backdrop-blur
        transition-all duration-300
        /* Sistema de Grid */
        ${spanStyles[colSpan]}
        ${md ? mdStyles[md] : ""}
        ${lg ? lgStyles[lg] : ""}
        ${className}
      `}
    >
      {/* Header */}
      <p className="text-[10px] uppercase font-bold tracking-widest mb-3 text-gray-500 dark:text-zinc-400">{title}</p>

      {/* Chart container (CLAVE) */}
      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
}
