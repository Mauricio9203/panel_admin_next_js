"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Modal from "./ui/Modal";

/* =========================
    STYLES
========================= */
const iconBtn = "w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-[1.05] active:scale-[0.96] text-violet-900 dark:text-violet-200 hover:bg-white/40 dark:hover:bg-white/10";

/* =========================
    ITEM COMPONENT
========================= */
function DropdownItem({ label, danger, onClick, disabled }: { label: string; danger?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-2 text-sm transition-colors
      hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50
      ${danger ? "text-red-500" : "text-violet-900 dark:text-violet-200"}`}
    >
      {label}
    </button>
  );
}

/* =========================
    MAIN COMPONENT
========================= */
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  /* =========================
      POSITIONING LOGIC
  ========================= */
  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 160;
    const spaceBelow = window.innerHeight - rect.bottom;

    const shouldFlip = spaceBelow < dropdownHeight;

    setPosition({
      top: shouldFlip ? rect.top + window.scrollY - dropdownHeight - 8 : rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - 160,
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  /* =========================
      CLICK OUTSIDE & ESC
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLogoutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =========================
      AUTH ACTIONS
  ========================= */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button ref={buttonRef} onClick={() => setOpen((v) => !v)} className={iconBtn}>
        <MoreVertical size={18} />
      </button>

      {/* DROPDOWN MENU */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: 160,
              zIndex: 9999,
            }}
            className="
              rounded-sm
              bg-white dark:bg-slate-900
              border border-black/5 dark:border-white/10
              shadow-lg shadow-black/5 dark:shadow-black/40
              overflow-hidden
              origin-top-right
              animate-in fade-in zoom-in-95
            "
          >
            <DropdownItem label="Perfil" onClick={() => setOpen(false)} />
            <DropdownItem label="Configuración" onClick={() => setOpen(false)} />

            <div className="h-px bg-black/5 dark:bg-white/10 my-1" />

            <DropdownItem
              label="Cerrar sesión"
              danger
              onClick={() => {
                setOpen(false);
                setLogoutOpen(true);
              }}
            />
          </div>,
          document.body,
        )}

      {/* CONFIRMATION MODAL */}
      <Modal open={logoutOpen} onClose={() => !isLoggingOut && setLogoutOpen(false)} title="Confirmación">
        <div className="p-1">
          <p className="text-sm text-slate-600 dark:text-slate-400">¿Estás seguro de que deseas finalizar tu sesión actual?</p>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setLogoutOpen(false)} disabled={isLoggingOut} className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cancelar
            </button>

            <button onClick={handleLogout} disabled={isLoggingOut} className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-600/20 disabled:opacity-50">
              {isLoggingOut ? "Cerrando..." : "Confirmar Salida"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
