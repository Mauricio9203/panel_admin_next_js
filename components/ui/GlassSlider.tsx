"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  className?: string;
}

export const GlassSlider = ({ label, min, max, step = 1, value, onChange, unit = "", className }: GlassSliderProps) => {
  return (
    <div className={cn("flex flex-col gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg", className)}>
      <div className="flex justify-between items-center">
        {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>}
        <span className="text-xs font-mono bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-slate-300/30 rounded-lg appearance-none cursor-pointer accent-blue-500" />
      <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-tighter">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
