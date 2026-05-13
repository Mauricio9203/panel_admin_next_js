"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";

type Venta = {
  id: number;
  name: string;
  usuarios: number;
  ventas: number;
};

const columns: ColumnDef<Venta>[] = [
  { accessorKey: "name", header: "Mes" },
  { accessorKey: "usuarios", header: "Usuarios", enableColumnFilter: false, enableSorting: false },
  { accessorKey: "ventas", header: "Ventas", enableColumnFilter: false, enableSorting: false },
];

interface VentasTableProps {
  initialData: Venta[];
}

export default function VentasTable({ initialData }: VentasTableProps) {
  // Ahora el DataTable corre feliz en el cliente con los datos del servidor
  return <DataTable<Venta> data={initialData} columns={columns} pageSize={5} />;
}
