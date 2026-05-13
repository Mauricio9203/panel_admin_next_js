import { createClient } from "@supabase/supabase-js"; // O tu utilidad de supabase personalizada
import TituloModulo from "@/components/ui/TituloModulo";
import { LayoutDashboard } from "lucide-react";
import VentasTable from "./VentasTable";

// Si usas el cliente estándar, asegúrate de que estas variables estén en tu .env
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function Page() {
  // 1. Fetch de datos en el Servidor (Rápido y Seguro)
  const { data, error } = await supabase.from("ventas").select("id, name, usuarios, ventas");

  if (error) {
    return <div className="p-6 text-red-500 font-medium">Error cargando datos de ventas: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Dashboard" variant="violet" icon={LayoutDashboard} />

      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        {/* 2. Pasamos los datos al componente de cliente */}
        <VentasTable initialData={data || []} />
      </div>
    </div>
  );
}
