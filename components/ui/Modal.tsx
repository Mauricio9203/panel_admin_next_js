"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* 🧠 CENTRADO PERFECTO (GRID) */}
      <div className="relative h-full w-full grid place-items-center p-4">
        {/* MODAL */}
        <div
          className="
            w-full max-w-md
            bg-white/90 dark:bg-slate-900/90
            backdrop-blur-xl
            rounded-2xl
            shadow-2xl
            border border-white/20 dark:border-white/10
            p-5
            animate-in fade-in zoom-in-95
          "
        >
          {title && <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-200 mb-3">{title}</h2>}

          <div className="text-sm text-violet-900 dark:text-violet-200">{children}</div>
        </div>
      </div>
    </div>
  );
}
