import { createClient } from "@supabase/supabase-js";
import TituloModulo from "@/components/ui/TituloModulo";
import { LayoutDashboard } from "lucide-react";
// 1. Cambiamos la importación al nuevo componente de productos
import ProductosTable from "./ProductosTable";

// 💡 AGREGA ESTA LÍNEA AQUÍ PARA FORZAR EL RENDERIZADO DINÁMICO
export const dynamic = "force-dynamic";

// Asegúrate de que estas variables estén en tu .env.local (para tu PC) o en Vercel (para producción)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function Page() {
  // 2. Apuntamos a la tabla "productos" y seleccionamos las columnas que creamos con SQL
  const { data, error } = await supabase.from("productos").select("id, created_at, nombre, precio, sku, stock");

  // Ajustamos el mensaje de error para que sea coherente con el inventario
  if (error) {
    return <div className="p-6 text-red-500 font-medium">Error cargando el inventario de productos: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Inventario de Productos" variant="violet" icon={LayoutDashboard} />

      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        {/* 3. Renderizamos la nueva tabla pasando los productos obtenidos de Supabase */}
        <ProductosTable initialData={data || []} />
      </div>
    </div>
  );
}
