"use client";

import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DataTablePortal from "./DataTablePortal";
import { closeAllRowMenus, subscribeCloseAllRowMenus } from "./dataTableEvents";

type Action<TData> = {
  label: string;
  onClick: (row: TData) => void;
  variant?: "default" | "danger";
};

type Props<TData> = {
  actions: Action<TData>[];
  row: TData;
};

export default function DataTableRowActions<TData>({ actions, row }: Props<TData>) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const btnRef = useRef<HTMLButtonElement>(null);

  /* =========================
     CERRAR DESDE OTROS MENÚS
  ========================= */
  useEffect(() => {
    const unsubscribe = subscribeCloseAllRowMenus(() => {
      setOpen(false);
    });

    return unsubscribe;
  }, []);

  /* =========================
     CLICK OUTSIDE GLOBAL
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isMenu = target.closest("[data-row-menu]");
      const isButton = btnRef.current?.contains(target);

      if (!isMenu && !isButton) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     CLOSE ON SCROLL/RESIZE
  ========================= */
  useEffect(() => {
    const close = () => setOpen(false);

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  /* =========================
     TOGGLE
  ========================= */
  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!open) {
      closeAllRowMenus();
    }

    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();

      setPos({
        top: rect.bottom + 6,
        left: rect.right - 144,
      });
    }

    setOpen((v) => !v);
  };

  return (
    <>
      {/* BOTÓN */}
      <button ref={btnRef} onClick={toggle} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-violet-500/10 transition">
        <MoreVertical size={14} />
      </button>

      {/* MENÚ */}
      {open && pos && (
        <DataTablePortal>
          <div
            data-row-menu
            className="
              fixed w-36
              bg-white dark:bg-neutral-900
              border border-violet-500/10
              rounded-md shadow-lg
              overflow-hidden
              z-[9999]
            "
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick(row);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 text-[11px]
                  hover:bg-violet-500/10 transition
                  ${action.variant === "danger" ? "text-red-500" : "text-neutral-700 dark:text-neutral-200"}
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        </DataTablePortal>
      )}
    </>
  );
}
