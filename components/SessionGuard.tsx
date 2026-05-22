"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import Modal from "./ui/Modal";

/* ============================
   RUTAS PÚBLICAS
   (no requieren sesión activa)
============================ */
const PUBLIC_PATHS = ["/login", "/auth"];

interface SessionGuardProps {
  children: React.ReactNode;
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const { session, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  /* ──────────────────────────────────────────────────────────────────────
     PROTECCIÓN DE RUTAS
     Redirige al login si no hay sesión y la ruta no es pública.
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (loading) return;
    if (!session && !isPublicPath) {
      router.push("/login");
    }
  }, [loading, session, isPublicPath, router]);

  /* ──────────────────────────────────────────────────────────────────────
     CIERRE DE SESIÓN
  ────────────────────────────────────────────────────────────────────── */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setShowModal(false);
    router.push("/login");
  }, [isLoggingOut, router]);

  /* ──────────────────────────────────────────────────────────────────────
     TIMER DE INACTIVIDAD
  ────────────────────────────────────────────────────────────────────── */
  const handleWarn = () => {
    if (session) {
      setCountdown(60);
      setShowModal(true);
    }
  };

  const { resetTimers } = useIdleTimer(15, handleWarn, handleLogout);

  /* ──────────────────────────────────────────────────────────────────────
     SINCRONIZACIÓN ENTRE PESTAÑAS
     Supabase propaga auth via localStorage; este efecto sincroniza
     la actividad del timer entre pestañas del mismo origen.
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const syncActivity = (event: StorageEvent) => {
      if (event.key === "last_activity_timestamp" && session) {
        resetTimers();
        if (showModal) setShowModal(false);
      }
    };
    window.addEventListener("storage", syncActivity);
    return () => window.removeEventListener("storage", syncActivity);
  }, [session, resetTimers, showModal]);

  /* ──────────────────────────────────────────────────────────────────────
     REGISTRO DE ACTIVIDAD ENTRE PESTAÑAS
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("last_activity_timestamp", Date.now().toString());
    };
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity));
    return () => events.forEach((e) => window.removeEventListener(e, updateActivity));
  }, []);

  /* ──────────────────────────────────────────────────────────────────────
     CUENTA REGRESIVA DEL MODAL
  ────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && showModal) {
      handleLogout();
    }
    return () => clearInterval(timer);
  }, [showModal, countdown, handleLogout]);

  const stayConnected = () => {
    setShowModal(false);
    resetTimers();
    localStorage.setItem("last_activity_timestamp", Date.now().toString());
  };

  /* ──────────────────────────────────────────────────────────────────────
     RENDER
     Mientras carga o en rutas públicas: solo hijos, sin modal de sesión.
  ────────────────────────────────────────────────────────────────────── */
  if (!session || isPublicPath) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Modal open={showModal} onClose={stayConnected} title="Sesión por expirar" size="sm">
        <div className="p-1 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-800" />
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="276" strokeDashoffset={276 - (276 * countdown) / 60} className="text-violet-600 transition-all duration-1000 ease-linear" />
            </svg>
            <span className="text-3xl font-mono font-bold text-violet-600 dark:text-violet-400">{countdown}</span>
          </div>
          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            Tu sesión se cerrará automáticamente en{" "}
            <span className="font-bold text-slate-900 dark:text-white">{countdown} segundos</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 w-full">
            <button
              onClick={stayConnected}
              disabled={isLoggingOut}
              className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95"
            >
              Seguir trabajando
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all active:scale-95"
            >
              {isLoggingOut ? "Saliendo..." : "Salir ahora"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
