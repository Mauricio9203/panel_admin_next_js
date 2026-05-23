"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Search, Eraser, X, ArrowLeft } from "lucide-react";

interface FilterProps {
  value: string;
  columnName: string;
  onChange: (value: string) => void;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  align?: "left" | "right";
}

export default function DataTableFilter({ value, columnName, onChange, onClose, anchorEl, align = "left" }: FilterProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const dropdownWidth = 256;
    let left = rect.left + rect.width / 2 - dropdownWidth / 2;
    if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
    if (left < 8) left = 8;
    setPos({ top: rect.bottom + 6, left });
  }, [mounted, anchorEl]);

  useEffect(() => {
    const handleEvents = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent && desktopRef.current && !desktopRef.current.contains(e.target as Node)) onClose();
      if (e instanceof KeyboardEvent && e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleEvents as any);
    window.addEventListener("keydown", handleEvents as any);
    return () => {
      document.removeEventListener("mousedown", handleEvents as any);
      window.removeEventListener("keydown", handleEvents as any);
    };
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onClose();
  };

  if (!mounted) return null;

  // --- VERSION MÓVIL (PORTAL) ---
  const mobileFilter = createPortal(
    <div className="fixed inset-0 z-[10000] md:hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bg-popover border-b border-border p-3 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 text-muted-foreground active:bg-muted rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex items-center bg-muted rounded-xl border border-border px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={18} className="text-primary mr-2 shrink-0" />
            <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Filtrar ${columnName.toLowerCase()}...`} className="flex-1 bg-transparent outline-none text-[16px] text-foreground placeholder:text-muted-foreground/60" />
            {value && (
              <button onClick={() => onChange("")} className="p-1 text-muted-foreground/60 hover:text-destructive transition-colors">
                <Eraser size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );

  // --- VERSION ESCRITORIO (PORTAL) ---
  const desktopFilter = createPortal(
    <motion.div
      ref={desktopRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      style={{ top: pos.top, left: pos.left }}
      className="hidden md:flex fixed z-[10000] w-64 items-center bg-popover border border-border rounded-md shadow-xl px-2.5 py-1.5"
    >
      <Search size={14} className="text-primary mr-2 shrink-0" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Filtrar ${columnName.toLowerCase()}...`}
        className="flex-1 bg-transparent outline-none text-[12px] text-foreground placeholder:text-muted-foreground/50"
      />
      <div className="flex items-center gap-0.5 ml-1 border-l border-border pl-1">
        {value && (
          <button onClick={() => onChange("")} className="p-1 text-muted-foreground/60 hover:text-destructive transition-colors" title="Limpiar">
            <Eraser size={13} />
          </button>
        )}
        <button onClick={onClose} className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors" title="Cerrar">
          <X size={14} />
        </button>
      </div>
    </motion.div>,
    document.body,
  );

  return (
    <>
      {mobileFilter}
      {desktopFilter}
    </>
  );
}
