"use client";

import { useEffect, useState } from "react";
import { Menu, Maximize, Minimize, Bell } from "lucide-react"; // Importamos Bell
import ThemeButton from "@/components/ThemeButton";
import UserMenu from "@/components/UserMenu";
import NotificationBell from "@/components/notifications/NotificationBell";
import { MOCK_NOTIFICATIONS } from "@/constants/notification";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const notifications = MOCK_NOTIFICATIONS;

  /* ---------------- FULLSCREEN LOGIC ---------------- */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error al intentar activar pantalla completa: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  if (!hydrated) {
    return <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black" />;
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button onClick={() => setLocalCollapsed((v) => !v)} className={`hidden md:flex ${iconBtn}`}>
          <Menu size={18} className={`transition-transform ${localCollapsed ? "rotate-180" : ""}`} />
        </button>

        <button onClick={() => setMobileOpen(true)} className={`md:hidden ${iconBtn}`}>
          <Menu size={18} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* BOTÓN FULLSCREEN */}
        {/* BOTÓN NOTIFICACIONES */}
        <NotificationBell initialData={MOCK_NOTIFICATIONS} /> {/* <-- Componente limpio y aislado */}
        <ThemeButton />
        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />
        <button onClick={toggleFullscreen} className={iconBtn} title="Pantalla Completa">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
