import { Compass } from "lucide-react";
import Link from "next/link";

/**
 * 404 para rutas dentro del área admin.
 * Renderiza dentro del layout admin (con sidebar y header).
 */
export default function AdminNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Compass size={32} className="text-primary/60" />
      </div>

      <div>
        <p className="text-5xl font-black text-primary/20 select-none mb-2">
          404
        </p>
        <h2 className="text-lg font-bold text-foreground">
          Página no encontrada
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          La ruta que buscas no existe o fue movida.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="mt-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
      >
        Ir al Dashboard
      </Link>
    </div>
  );
}
