import TituloModulo from "@/components/ui/TituloModulo";
import { ServerIcon } from "lucide-react";
import ProductosServerTable from "./ProductosServerTable";

/**
 * tabla_server/page.tsx
 * ─────────────────────
 * Versión server-side de la tabla de productos.
 *
 * Diferencias clave respecto a tabla_supabase:
 *  ✦ No hay fetch en el servidor — el componente cliente pide solo la página actual.
 *  ✦ Filtros, ordenamiento y paginación ocurren en Postgres, no en el navegador.
 *  ✦ Ideal para tablas con miles o millones de filas.
 */
export default function Page() {
  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Productos (Server-Side)" variant="violet" icon={ServerIcon} />

      <div className="w-full min-w-0 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <ProductosServerTable />
      </div>
    </div>
  );
}
