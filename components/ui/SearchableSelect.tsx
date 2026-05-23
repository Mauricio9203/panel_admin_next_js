"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback, forwardRef } from "react";
import { Search, Check, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Portal from "@radix-ui/react-portal";

interface Option {
  value: string;
  label: string;
}

type SelectSize = "sm" | "md" | "lg" | "xl";

interface Props {
  options: Option[];
  placeholder?: string;
  onSelect: (value: any) => void;
  value: any;
  label?: string;
  multiple?: boolean;
  size?: SelectSize;
  error?: string;
  name?: string;
  onBlur?: () => void;
  disabled?: boolean;
}

const SearchableSelect = forwardRef<HTMLButtonElement, Props>(({ options, placeholder = "Seleccionar...", onSelect, value, label, multiple = false, size = "md", error, onBlur, disabled, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, bottom: 0 });
  const [direction, setDirection] = useState<"down" | "up">("down");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const currentValues = useMemo(() => {
    if (!multiple) return value ?? "";
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  }, [value, multiple]);

  const filtered = useMemo(() => options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())), [options, search]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  // Lógica para cerrar y limpiar
  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
    if (onBlur) onBlur();
  }, [onBlur]);

  // Manejo de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) {
          toggleOption(filtered[activeIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        triggerRef.current?.focus();
        break;
      case "Tab":
        handleClose();
        break;
    }
  };

  // Auto-scroll al navegar con flechas
  useEffect(() => {
    if (open && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, open]);

  const setRefs = useCallback(
    (node: HTMLButtonElement) => {
      triggerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as any).current = node;
    },
    [ref],
  );

  const sizeConfig = {
    sm: { trigger: "min-h-[28px] py-1 px-2 text-[11px] rounded-md", label: "text-[9px]", icon: "w-3 h-3", tag: "text-[9px] px-1 py-0" },
    md: { trigger: "min-h-[36px] py-1.5 px-3 text-[13px] rounded-lg", label: "text-[10px]", icon: "w-3.5 h-3.5", tag: "text-[11px] px-1.5 py-0.5" },
    lg: { trigger: "min-h-[44px] py-2 px-4 text-sm rounded-xl", label: "text-xs", icon: "w-4 h-4", tag: "text-xs px-2 py-1" },
    xl: { trigger: "min-h-[56px] py-3 px-5 text-base rounded-2xl", label: "text-sm", icon: "w-5 h-5", tag: "text-sm px-3 py-1.5" },
  };

  const updatePosition = useCallback(() => {
    if (triggerRef.current && open) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDirection(window.innerHeight - rect.bottom < 250 && rect.top > 250 ? "up" : "down");
      setCoords({ top: rect.bottom, bottom: rect.top, left: rect.left, width: rect.width });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const toggleOption = (val: string) => {
    if (disabled) return;
    if (multiple) {
      const base = Array.isArray(currentValues) ? currentValues : [];
      onSelect(base.includes(val) ? base.filter((i) => i !== val) : [...base, val]);
    } else {
      onSelect(currentValues === val ? null : val);
      handleClose();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onSelect(multiple ? [] : null);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node) || portalRef.current?.contains(e.target as Node)) return;
      handleClose();
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClose]);

  const hasValue = multiple ? Array.isArray(currentValues) && currentValues.length > 0 : currentValues !== null && currentValues !== undefined && currentValues !== "";

  return (
    <div className={`flex flex-col gap-1 w-full ${disabled ? "opacity-60" : ""}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && <span className={`font-bold text-muted-foreground uppercase tracking-tight ml-1 ${sizeConfig[size].label}`}>{label}</span>}

      <button
        {...props}
        ref={setRefs}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between bg-background/60 backdrop-blur-sm border transition-all ${error ? "border-destructive/50" : "border-border"} focus:ring-2 focus:ring-primary/40 outline-none ${sizeConfig[size].trigger}`}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 items-center min-w-0 text-left">
          {multiple && Array.isArray(currentValues) && currentValues.length > 0 ? (
            currentValues.map((v) => (
              <span key={v} className={`bg-primary text-primary-foreground rounded-md flex items-center gap-1.5 ${sizeConfig[size].tag}`}>
                <span className="truncate max-w-[120px]">{options.find((o) => o.value === v)?.label}</span>
                <X
                  className="w-3 h-3 cursor-pointer p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(v);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="truncate text-foreground">{options.find((opt) => opt.value === currentValues)?.label || <span className="text-muted-foreground/60">{placeholder}</span>}</span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2 shrink-0">
          {hasValue && !disabled && <X onClick={handleClear} className={`${sizeConfig[size].icon} text-muted-foreground/60 hover:text-destructive transition-colors cursor-pointer mr-0.5`} />}
          <ChevronDown className={`${sizeConfig[size].icon} text-muted-foreground/60 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* BLOQUE DE ERROR AÑADIDO */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[10px] text-rose-500 font-medium ml-1">
            {error}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Portal.Root>
            <motion.div
              ref={portalRef}
              initial={{ opacity: 0, y: direction === "down" ? -10 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                left: coords.left,
                width: coords.width,
                top: direction === "down" ? coords.top + 4 : undefined,
                bottom: direction === "up" ? window.innerHeight - coords.bottom + 4 : undefined,
                zIndex: 9999,
              }}
              className="bg-popover border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-3 border-b border-border bg-muted/40">
                <Search className="w-4 h-4 text-muted-foreground/60 mr-2" />
                <input autoFocus className="w-full py-2 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50" placeholder="Filtrar..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <div ref={listRef} className="max-h-52 overflow-y-auto p-1 custom-scrollbar">
                {filtered.length > 0 ? (
                  filtered.map((opt, i) => {
                    const isSelected = multiple ? currentValues.includes(opt.value) : currentValues === opt.value;
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={opt.value}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => toggleOption(opt.value)}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer ${isSelected ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/10 text-primary" : "text-foreground"}`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground/60">No hay resultados</div>
                )}
              </div>
            </motion.div>
          </Portal.Root>
        )}
      </AnimatePresence>
    </div>
  );
});

SearchableSelect.displayName = "SearchableSelect";

export default SearchableSelect;
