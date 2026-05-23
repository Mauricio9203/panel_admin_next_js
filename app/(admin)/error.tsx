"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Error boundary del área admin.
 * Se activa cuando un Server o Client Component dentro del layout admin
 * lanza un error durante el render o en un useEffect.
 * Renderiza dentro del layout admin (con sidebar y header).
 */
export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    // Opcional: enviar a un servicio de monitoreo (Sentry, etc.)
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle size={32} className="text-red-400" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Algo salió mal
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Ocurrió un error inesperado en este módulo.
        </p>
        {error.digest && (
          <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-2 font-mono">
            ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95"
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => { window.location.href = "/dashboard"; }}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
}
