"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Eraser, X, ArrowLeft } from "lucide-react";

interface FilterProps {
  value: string;
  columnName: string;
  onChange: (value: string) => void;
  onClose: () => void;
  align?: "left" | "right";
}

export default function DataTableFilter({ value, columnName, onChange, onClose, align = "left" }: FilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEvents = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent && containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
      if (e instanceof KeyboardEvent && e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleEvents as any);
    window.addEventListener("keydown", handleEvents as any);
    return () => {
      document.removeEventListener("mousedown", handleEvents as any);
      window.removeEventListener("keydown", handleEvents as any);
    };
  }, [onClose]);

  // Función para cerrar al presionar Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onClose();
    }
  };

  if (!mounted) return null;

  // --- VERSION MÓVIL (PORTAL) ---
  const mobileFilter = createPortal(
    <div className="fixed inset-0 z-[10000] md:hidden">
      {/* Overlay adaptativo */}
      <div className="absolute inset-0 bg-neutral-500/20 dark:bg-neutral-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Barra superior adaptativa */}
      <div className="absolute inset-x-0 top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 p-3 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 text-neutral-500 dark:text-neutral-400 active:bg-neutral-100 dark:active:bg-neutral-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <Search size={18} className="text-violet-600 dark:text-violet-500 mr-2 shrink-0" />
            <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Filtrar ${columnName.toLowerCase()}...`} className="flex-1 bg-transparent outline-none text-[16px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500" />
            {value && (
              <button onClick={() => onChange("")} className="p-1 text-neutral-400 hover:text-red-500 transition-colors">
                <Eraser size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {mobileFilter}

      {/* --- VERSION ESCRITORIO --- */}
      <div
        ref={containerRef}
        className={`
          hidden md:block absolute z-[100] top-[calc(100%+6px)] w-64
          animate-in fade-in zoom-in-95 duration-200
          ${align === "left" ? "left-0" : "right-0"}
        `}
      >
        <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-xl px-2.5 py-1.5 ring-1 ring-black/5 dark:ring-white/5">
          <Search size={14} className="text-violet-600 dark:text-violet-400 mr-2 shrink-0" />
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Filtrar ${columnName.toLowerCase()}...`}
            className="flex-1 bg-transparent outline-none text-[12px] text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400/60 dark:placeholder:text-neutral-500"
          />
          <div className="flex items-center gap-0.5 ml-1 border-l border-neutral-200 dark:border-neutral-800 pl-1">
            {value && (
              <button onClick={() => onChange("")} className="p-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Limpiar">
                <Eraser size={13} />
              </button>
            )}
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" title="Cerrar">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
