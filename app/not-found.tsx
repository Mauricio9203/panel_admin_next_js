import { Compass } from "lucide-react";
import Link from "next/link";

/**
 * 404 global — rutas completamente desconocidas fuera del área admin.
 * Renderiza solo con el root layout (sin sidebar).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8 bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-slate-950">
      {/* LOGO / ICONO */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-700/10 flex items-center justify-center">
        <Compass size={36} className="text-violet-400" />
      </div>

      {/* NÚMERO */}
      <p className="text-8xl font-black text-violet-100 dark:text-violet-900/60 select-none -mb-4">
        404
      </p>

      {/* TEXTOS */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          La ruta que buscas no existe o fue movida.
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95"
        >
          Ir al Dashboard
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
