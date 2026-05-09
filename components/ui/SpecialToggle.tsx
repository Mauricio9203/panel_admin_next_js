"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToggleProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const SpecialToggle = ({ label, description, checked, onChange, disabled = false, className }: ToggleProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl", className)}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-slate-800 dark:text-white">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          checked ? "bg-blue-500" : "bg-slate-300/30",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} animate={{ x: checked ? 24 : 4 }} className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0" />
      </button>
    </div>
  );
};
