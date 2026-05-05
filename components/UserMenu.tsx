"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import Modal from "./ui/Modal";

/* =========================
   STYLES
========================= */
const iconBtn = "w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-[1.05] active:scale-[0.96] text-violet-900 dark:text-violet-200 hover:bg-white/40 dark:hover:bg-white/10";

/* =========================
   ITEM
========================= */
function DropdownItem({ label, danger, onClick }: { label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-sm transition-colors
      hover:bg-black/5 dark:hover:bg-white/10
      ${danger ? "text-red-500" : "text-violet-900 dark:text-violet-200"}`}
    >
      {label}
    </button>
  );
}

/* =========================
   COMPONENT
========================= */
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  /* =========================
     POSITION (with flip)
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

  /* =========================
     OPEN EFFECT
  ========================= */
  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  /* =========================
     CLICK OUTSIDE (FIXED)
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     ESC KEY
  ========================= */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLogoutOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const handleLogout = () => {
    alert("Sesión cerrada");
    setLogoutOpen(false);
  };

  return (
    <>
      {/* =========================
          BUTTON
      ========================= */}
      <button ref={buttonRef} onClick={() => setOpen((v) => !v)} className={iconBtn}>
        <MoreVertical size={18} />
      </button>

      {/* =========================
          DROPDOWN (PORTAL)
      ========================= */}
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
              rounded-xl
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

      {/* =========================
          MODAL
      ========================= */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Cerrar sesión">
        <p>¿Seguro que quieres cerrar sesión?</p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setLogoutOpen(false)} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800">
            Cancelar
          </button>

          <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-500 text-white">
            Cerrar sesión
          </button>
        </div>
      </Modal>
    </>
  );
}
