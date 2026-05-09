"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // Basado en índice 0
}

export const GlassStepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center w-full justify-between p-4 bg-white/20 dark:bg-black/10 backdrop-blur-md rounded-2xl border border-white/10">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${index <= currentStep ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}
            `}
            >
              {index < currentStep ? <Check size={14} /> : index + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${index <= currentStep ? "text-violet-500" : "text-slate-400"}`}>{step}</span>
          </div>
          {index < steps.length - 1 && <div className={`h-[2px] flex-1 mx-2 rounded-full ${index < currentStep ? "bg-violet-500" : "bg-slate-200 dark:bg-slate-800"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};
