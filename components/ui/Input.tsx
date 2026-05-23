"use client";

import React, { forwardRef, useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type InputSize = "sm" | "md" | "lg" | "xl";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: LucideIcon;
  size?: InputSize;
  error?: string;
}

const NormalInput = forwardRef<HTMLInputElement, InputProps>(({ label, icon: Icon, size = "md", error, className = "", type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  // Detectamos si es un tipo cronológico para aplicar estilos extra
  const isDateTime = type === "date" || type === "time" || type === "datetime-local";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const sizeConfig = {
    sm: { container: "h-7 px-2 text-[11px] rounded-md", label: "text-[9px]", icon: "w-3 h-3" },
    md: { container: "h-9 px-3 text-[13px] rounded-lg", label: "text-[10px]", icon: "w-3.5 h-3.5" },
    lg: { container: "h-11 px-4 text-sm rounded-xl", label: "text-xs", icon: "w-4 h-4" },
    xl: { container: "h-14 px-5 text-base rounded-2xl", label: "text-sm", icon: "w-5 h-5" },
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <span className={`font-bold text-muted-foreground uppercase tracking-tight ml-1 ${sizeConfig[size].label}`}>{label}</span>}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none z-10">
            <Icon className={`${sizeConfig[size].icon} text-muted-foreground/60`} />
          </div>
        )}

        <input
          {...props}
          type={inputType}
          ref={ref}
          className={`
                w-full bg-background/60 backdrop-blur-sm
                border transition-all outline-none
                placeholder:text-muted-foreground/50 text-foreground
                focus:ring-2 focus:ring-primary/40
                ${Icon ? "pl-9" : ""}
                ${isPassword ? "pr-10" : ""}
                ${error ? "border-destructive/50 focus:border-destructive" : "border-border focus:border-primary/50"}
                ${sizeConfig[size].container}
                
                /* Estilos para Date e Time */
                ${
                  isDateTime
                    ? `
                  appearance-none 
                  dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert 
                  [&::-webkit-calendar-picker-indicator]:opacity-50 
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  hover:[&::-webkit-calendar-picker-indicator]:opacity-100
                `
                    : ""
                }
              `}
        />

        {isPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-colors z-10" tabIndex={-1}>
            {showPassword ? <EyeOff className={sizeConfig[size].icon} /> : <Eye className={sizeConfig[size].icon} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[10px] text-rose-500 font-medium ml-1">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

NormalInput.displayName = "NormalInput";

export default NormalInput;
