"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Modal from "./ui/Modal";

interface SessionGuardProps {
  children: React.ReactNode;
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const { status } = useSession();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login", redirect: true });
    setShowModal(false);
  }, [isLoggingOut]);

  const handleWarn = () => {
    if (status === "authenticated") {
      setCountdown(60);
      setShowModal(true);
    }
  };

  const { resetTimers } = useIdleTimer(15, handleWarn, handleLogout);

  // 1. SINCRONIZACIÓN DE ACTIVIDAD: Reinicia timers si otra pestaña tuvo actividad
  useEffect(() => {
    const syncActivity = (event: StorageEvent) => {
      if (event.key === "last_activity_timestamp" && status === "authenticated") {
        resetTimers(); // Otra pestaña se movió, reiniciamos esta
        if (showModal) setShowModal(false); // Si esta pestaña tenía el modal abierto, lo cerramos
      }
    };

    window.addEventListener("storage", syncActivity);
    return () => window.removeEventListener("storage", syncActivity);
  }, [status, resetTimers, showModal]);

  // 2. SINCRONIZACIÓN DE LOGOUT: Si una pestaña cierra sesión, las demás redirigen
  useEffect(() => {
    const checkSession = (event: StorageEvent) => {
      // NextAuth usa estas keys para el broadcast de sesión
      if (event.key === "next-auth.session-token" || event.key === "__Secure-next-auth.session-token") {
        if (!event.newValue) {
          window.location.href = "/login";
        }
      }
    };

    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  // 3. REGISTRAR ACTIVIDAD: Notifica a otras pestañas que nos movimos
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("last_activity_timestamp", Date.now().toString());
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    return () => events.forEach((e) => window.removeEventListener(e, updateActivity));
  }, []);

  // Efecto para la cuenta regresiva
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

  if (status !== "authenticated" || pathname === "/login") {
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
            Tu sesión se cerrará automáticamente en <span className="font-bold text-slate-900 dark:text-white">{countdown} segundos</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 w-full">
            <button onClick={stayConnected} disabled={isLoggingOut} className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95">
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
