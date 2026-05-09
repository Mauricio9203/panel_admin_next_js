"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // Basado en índice 0
}

export const GlassStepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center w-full justify-between p-3 md:p-4 bg-white/20 dark:bg-black/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Contenedor del Paso */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`
                relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500
                ${index <= currentStep ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-100" : "bg-slate-200 dark:bg-slate-800 text-slate-500 scale-90"}
                ${index === currentStep ? "ring-4 ring-violet-500/20" : ""}
              `}
            >
              {index < currentStep ? <Check size={16} strokeWidth={3} /> : <span>{index + 1}</span>}
            </div>

            {/* Texto del paso: Oculto en móviles (< 640px), visible en tablets/PC */}
            <span
              className={`
                text-[9px] font-black uppercase tracking-tighter transition-colors duration-500
                hidden sm:block /* <--- Esto evita que se descuadre en móvil */
                ${index <= currentStep ? "text-violet-500" : "text-slate-400"}
              `}
            >
              {step}
            </span>
          </div>

          {/* Línea conectora: Se ajusta dinámicamente */}
          {index < steps.length - 1 && (
            <div className="flex-1 px-1 md:px-2 self-center -translate-y-2 sm:-translate-y-3">
              <div
                className={`
                  h-[2px] w-full rounded-full transition-all duration-700
                  ${index < currentStep ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]" : "bg-slate-200 dark:bg-slate-800"}
                `}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
