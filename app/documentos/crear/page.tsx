import { createClient } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";

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
    <div className="p-6">
      <DataTable<Venta> data={data ?? []} columns={columns} pageSize={5} />
    </div>
  );
}
