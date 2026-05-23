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
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle size={32} className="text-destructive/60" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">
          Algo salió mal
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Ocurrió un error inesperado en este módulo.
        </p>
        {error.digest && (
          <p className="text-[11px] text-muted-foreground/50 mt-2 font-mono">
            ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => { window.location.href = "/dashboard"; }}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-all active:scale-95"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
}
