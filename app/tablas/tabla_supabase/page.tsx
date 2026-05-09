import { createClient } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import TituloModulo from "@/components/ui/TituloModulo";
import { LayoutDashboard } from "lucide-react";

/* =========================
   SUPABASE CLIENT
========================= */
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

/* =========================
   TYPES
========================= */
type Venta = {
  id: number;
  name: string;
  usuarios: number;
  ventas: number;
};

/* =========================
   COLUMNS
========================= */
const columns: ColumnDef<Venta>[] = [
  {
    accessorKey: "name",
    header: "Mes",
  },
  {
    accessorKey: "usuarios",
    header: "Usuarios",
  },
  {
    accessorKey: "ventas",
    header: "Ventas",
  },
];

/* =========================
   PAGE (SERVER COMPONENT)
========================= */
export default async function Page() {
  const { data, error } = await supabase.from("ventas").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return <div className="p-6 text-red-500">Error cargando datos: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Dashboard" variant="violet" icon={LayoutDashboard} />
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <DataTable<Venta> data={data ?? []} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
