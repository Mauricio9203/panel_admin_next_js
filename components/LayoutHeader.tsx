"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import ThemeButton from "@/components/ThemeButton";
import UserMenu from "@/components/UserMenu";

const STORAGE_COLLAPSED = "sidebarCollapsed";

const iconBtn = "group w-10 h-10 flex items-center justify-center rounded-xl transition-all transform hover:scale-[1.05] active:scale-[0.96] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10";

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((v: boolean) => boolean)) => void;
  setMobileOpen: (v: boolean) => void;
}

export default function LayoutHeader({ collapsed, setCollapsed, setMobileOpen }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState<boolean>(false);

  /* ---------------- HYDRATION LOAD ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_COLLAPSED);

    const value = saved === "true";
    setLocalCollapsed(value);
    setCollapsed(value);

    setHydrated(true);
  }, [setCollapsed]);

  /* ---------------- SYNC + SAVE ---------------- */
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_COLLAPSED, String(localCollapsed));
    setCollapsed(localCollapsed);
  }, [localCollapsed, hydrated, setCollapsed]);

  /* ---------------- PREVENT FLICKER ---------------- */
  if (!hydrated) {
    return <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black" />;
  }

  return (
    <header
      className="
        h-14 flex items-center justify-between
        px-4 md:pl-4 md:pr-4
        bg-white dark:bg-black
        border-b border-gray-200 dark:border-gray-800
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-2">
        {/* SIDEBAR TOGGLE (DESKTOP) */}
        <button onClick={() => setLocalCollapsed((v) => !v)} className={`hidden md:flex ${iconBtn}`}>
          <Menu size={18} className={`transition-transform ${localCollapsed ? "rotate-180" : ""}`} />
        </button>

        {/* MOBILE MENU */}
        <button onClick={() => setMobileOpen(true)} className={`md:hidden ${iconBtn}`}>
          <Menu size={18} />
        </button>

        <h1 className="font-medium text-gray-900 dark:text-gray-100 tracking-wide">Dashboard</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <ThemeButton />
        <UserMenu />
      </div>
    </header>
  );
}
