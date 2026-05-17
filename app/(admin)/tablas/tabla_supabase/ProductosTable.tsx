"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";

// 1. Adaptamos el tipo TypeScript a la estructura real de tu tabla de Postgres
type Producto = {
  id: string; // Es un UUID, por lo tanto se maneja como string
  created_at: string;
  nombre: string;
  precio: number;
  sku: string | null; // Puede ser nulo si no se define
  stock: number;
};

// 2. Definimos las columnas que queremos mostrar en el DataTable de shadcn
const columns: ColumnDef<Producto>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "nombre",
    header: "Producto",
  },
  {
    accessorKey: "precio",
    header: "Precio",
    // Opcional: Formateamos el precio como moneda (ej: $10.000)
    cell: ({ row }) => {
      const precio = parseFloat(row.getValue("precio"));
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP", // Cámbialo si manejas otra moneda
      }).format(precio);
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    enableColumnFilter: false,
  },
];

interface ProductosTableProps {
  initialData: Producto[];
}

export default function ProductosTable({ initialData }: ProductosTableProps) {
  // El DataTable corre feliz en el cliente renderizando tus productos de Supabase
  return <DataTable<Producto> data={initialData} columns={columns} pageSize={5} />;
}
