"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { useTableCrud } from "@/hooks/useTableCrud";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { FormProducto } from "./FormProducto";

type Producto = {
  id: string;
  created_at: string;
  nombre: string;
  precio: number;
  sku: string | null;
  stock: number;
};

const columns: ColumnDef<Producto>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "nombre", header: "Producto" },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
        parseFloat(row.getValue("precio"))
      ),

  },
  { accessorKey: "stock", header: "Stock" },
];

interface ProductosTableProps {
  initialData: Producto[];
}

export default function ProductosTable({ initialData }: ProductosTableProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  const { props } = useTableCrud({
    initialData,
    tableName: "productos",
    onEdit: (row) => { setProductoAEditar(row); setModalAbierto(true); },
    deleteLabel: (row) => `"${row.nombre}"`,
  });

  return (
    <div className="w-full space-y-4 relative">
      <div className="fixed bottom-6 right-6 z-50 sm:relative sm:bottom-auto sm:right-auto sm:flex sm:justify-end sm:px-2 sm:py-2">
        <Button
          variant="primary"
          size="xl"
          className="h-14 w-14 p-0 sm:h-8 sm:w-auto sm:px-3 sm:py-1 text-sm shadow-xl sm:shadow-md"
          onClick={() => { setProductoAEditar(null); setModalAbierto(true); }}
        >
          <Plus className="w-6 h-6 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
        </Button>
      </div>

      <DataTable<Producto>
        columns={columns}
        editableColumns={["stock","precio"]}
        pageSize={10}
        {...props}
      />

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={productoAEditar ? "Editar Producto" : "Agregar Nuevo Producto"}
        size="md"
      >
        <FormProducto productoEdicion={productoAEditar} onExito={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}
