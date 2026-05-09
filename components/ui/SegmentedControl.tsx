"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Asegúrate de tener tu función cn

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl = ({ options, selectedValue, onChange, className }: SegmentedControlProps) => {
  return (
    <div className={cn("relative flex p-1.5 bg-slate-200/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn("relative flex-1 py-2 text-sm font-medium transition-colors z-10 focus:outline-none", selectedValue === option.value ? "text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400")}
        >
          {selectedValue === option.value && <motion.div layoutId="segment-indicator" className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
          <span className="relative z-20">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
