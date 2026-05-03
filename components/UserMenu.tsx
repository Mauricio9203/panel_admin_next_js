"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import Modal from "./ui/Modal";
const iconBtn = "w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-[1.05] active:scale-[0.96] text-violet-900 dark:text-violet-200 hover:bg-white/40 dark:hover:bg-white/10";

function DropdownItem({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button
      className={`w-full text-left px-3 py-2 text-sm transition-colors
      hover:bg-black/5 dark:hover:bg-white/10
      ${danger ? "text-red-500" : "text-violet-900 dark:text-violet-200"}`}
    >
      {label}
    </button>
  );
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    alert("Sesión cerrada");
    setLogoutOpen(false);
  };

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* BUTTON */}
      <button onClick={() => setOpen((v) => !v)} className={iconBtn}>
        <MoreVertical size={18} />
      </button>

      {/* DROPDOWN */}
      <div
        className={`
          absolute right-0 mt-2 w-40
          rounded-xl
          bg-white dark:bg-slate-900
          border border-black/5 dark:border-white/10
          shadow-lg shadow-black/5 dark:shadow-black/40
          overflow-hidden
          origin-top-right
          transition-all duration-500 ease-out
          ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}
        `}
      >
        <DropdownItem label="Perfil" />
        <DropdownItem label="Configuración" />

        <div className="h-px bg-black/5 dark:bg-white/10 my-1" />

        <button onClick={() => setLogoutOpen(true)} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/10">
          Cerrar sesión
        </button>
      </div>

      {/* MODAL */}
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
    </div>
  );
}
