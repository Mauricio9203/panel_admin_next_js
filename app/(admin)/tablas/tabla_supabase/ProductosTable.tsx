"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { useTableCrud } from "@/hooks/useTableCrud";
import { Plus } from "lucide-react";
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

  const { setData, props } = useTableCrud({
    initialData,
    tableName: "productos",
    onEdit: (row) => { setProductoAEditar(row); setModalAbierto(true); },
    deleteLabel: (row) => `"${row.nombre}"`,
  });

  return (
    <div className="w-full">
      <DataTable<Producto>
        columns={columns}
        editableColumns={["sku","stock", "precio"]}
        pageSize={10}
        tableActions={[
          {
            label: "Nuevo Producto",
            icon: Plus,
            onClick: () => { setProductoAEditar(null); setModalAbierto(true); },
            variant: "primary",
          },
          {
            type: "export",
            formats: ["csv", "excel", "json"],
            filename: "productos",
          },
        ]}
        {...props}
      />

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={productoAEditar ? "Editar Producto" : "Agregar Nuevo Producto"}
        size="md"
      >
        <FormProducto
          productoEdicion={productoAEditar}
          onExito={(record) => {
            setData((prev) =>
              productoAEditar
                ? prev.map((r) => (r.id === record.id ? { ...r, ...record } : r))
                : [record, ...prev]
            );
            setModalAbierto(false);
          }}
        />
      </Modal>
    </div>
  );
}
