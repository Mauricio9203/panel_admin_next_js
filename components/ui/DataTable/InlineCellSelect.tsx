"use client";

/**
 * InlineCellSelect
 * ─────────────────────────────────────────────────────────
 * Select con búsqueda diseñado exclusivamente para celdas
 * editables de DataTable. Usa un portal para evitar el
 * clipping de overflow:hidden en la tabla.
 *
 * Cuándo usarlo:
 *   searchable: true  → este componente  (FK con muchas opciones)
 *   searchable: false → <select> nativo  (pocas opciones fijas)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import * as Portal from "@radix-ui/react-portal";
import { motion, AnimatePresence } from "framer-motion";

export interface InlineCellOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: InlineCellOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DROPDOWN_MAX_H = 244; // 44px buscador + 200px lista

export default function InlineCellSelect({
  value,
  options,
  onChange,
  disabled = false,
}: Props) {
  const [open,      setOpen]      = useState(false);
  const [search,    setSearch]    = useState("");
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [rect,      setRect]      = useState({ top: 0, bottom: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef  = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  /* ── Posición del dropdown ── */
  const updateRect = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDirection(
      window.innerHeight - r.bottom < DROPDOWN_MAX_H && r.top > DROPDOWN_MAX_H
        ? "up"
        : "down"
    );
    setRect({ top: r.top, bottom: r.bottom, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateRect();
    window.addEventListener("scroll",  updateRect, true);
    window.addEventListener("resize",  updateRect);
    return () => {
      window.removeEventListener("scroll",  updateRect, true);
      window.removeEventListener("resize",  updateRect);
    };
  }, [open, updateRect]);

  /* ── Cierre al hacer clic fuera ── */
  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        portalRef.current?.contains(e.target as Node)
      ) return;
      handleClose();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, handleClose]);

  /* ── Selección ── */
  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  /* ── Teclado (Escape / Tab) ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { handleClose(); triggerRef.current?.focus(); }
    if (e.key === "Tab")    { handleClose(); }
  };

  /* ── Ancho mínimo para legibilidad ── */
  const dropWidth = Math.max(rect.width, 180);

  return (
    <>
      {/* TRIGGER — idéntico al <select> nativo en apariencia */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between gap-1 px-1 py-0.5 rounded-sm
          hover:bg-black/5 dark:hover:bg-white/5
          focus:bg-white dark:focus:bg-neutral-800
          focus:ring-1 focus:ring-violet-500/40
          transition-all outline-none text-[12px]
          text-neutral-600 dark:text-neutral-400 cursor-pointer"
      >
        <span className="truncate min-w-0">
          {selected?.label ?? <span className="text-neutral-400 italic">—</span>}
        </span>
        <ChevronDown
          size={11}
          className={`shrink-0 text-neutral-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN (portal) */}
      <AnimatePresence>
        {open && (
          <Portal.Root>
            <motion.div
              ref={portalRef}
              initial={{ opacity: 0, y: direction === "down" ? -6 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onKeyDown={handleKeyDown}
              style={{
                position : "fixed",
                left     : rect.left,
                width    : dropWidth,
                zIndex   : 9999,
                ...(direction === "down"
                  ? { top    : rect.bottom + 2 }
                  : { bottom : window.innerHeight - rect.top + 2 }),
              }}
              className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
            >
              {/* Buscador */}
              <div className="flex items-center gap-2 px-2.5 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
                <Search size={11} className="text-neutral-400 shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="flex-1 min-w-0 text-[12px] bg-transparent outline-none
                    text-neutral-700 dark:text-neutral-300
                    placeholder:text-neutral-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-neutral-400 hover:text-neutral-600 text-[10px] leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Lista */}
              <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                {filtered.length > 0 ? (
                  filtered.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-md text-left transition-colors ${
                        opt.value === value
                          ? "bg-violet-600 text-white"
                          : "text-neutral-600 dark:text-neutral-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {opt.value === value && <Check size={11} className="shrink-0 ml-1.5" />}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-[11px] text-neutral-400">
                    Sin resultados
                  </p>
                )}
              </div>

              {/* Contador cuando hay búsqueda activa */}
              {search && filtered.length > 0 && (
                <div className="px-3 py-1.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 text-right">
                  {filtered.length} de {options.length}
                </div>
              )}
            </motion.div>
          </Portal.Root>
        )}
      </AnimatePresence>
    </>
  );
}
