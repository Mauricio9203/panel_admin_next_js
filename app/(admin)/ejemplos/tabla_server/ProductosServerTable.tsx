"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { usePermission } from "@/hooks/usePermission";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { FormProducto } from "../tabla_supabase/FormProducto";

/* ============================
   TIPO
============================ */
type Producto = {
  id: string;
  created_at: string;
  nombre: string;
  precio: number;
  sku: string | null;
  stock: number;
};

/* ============================
   COLUMNAS
============================ */
const columns: ColumnDef<Producto>[] = [
  { accessorKey: "sku",    header: "SKU" },
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

/* ============================
   COMPONENTE
============================ */
export default function ProductosServerTable() {
  const [modalAbierto,     setModalAbierto]     = useState(false);
  const [productoAEditar,  setProductoAEditar]  = useState<Producto | null>(null);

  const canCrear    = usePermission("crear");
  const canEditar   = usePermission("editar");
  const canEliminar = usePermission("eliminar");
  const canExportar = usePermission("exportar");

  /**
   * mode: "server" — pide a Supabase solo la página actual.
   *  - No necesita initialData (no hay fetch en el servidor)
   *  - Paginación, filtros y sort se ejecutan en Postgres
   *  - Al crear/editar un registro se llama refetch()
   */
  const { props, refetch } = useSupabaseTable<Producto>({
    mode:        "server",
    tableName:   "productos",
    select:      "id, created_at, nombre, precio, sku, stock",
    pageSize:    10,
    defaultSort: { column: "created_at", ascending: false },
    onEdit:      canEditar ? (row) => { setProductoAEditar(row); setModalAbierto(true); } : undefined,
    canDelete:   canEliminar,
    deleteLabel: (row) => `"${row.nombre}"`,
  });

  return (
    <div className="w-full">
      <DataTable<Producto>
        columns={columns}
        editableColumns={["stock", "precio","nombre"]}
        pageSize={10}
        tableActions={[
          ...(canCrear ? [{
            label:   "Nuevo Producto",
            icon:    Plus,
            onClick: () => { setProductoAEditar(null); setModalAbierto(true); },
            variant: "primary" as const,
          }] : []),
          ...(canExportar ? [{
            type:     "export"  as const,
            formats:  ["csv", "excel", "json"] as ("csv" | "excel" | "json")[],
            filename: "productos",
          }] : []),
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
          onExito={() => {
            // En modo server-side pedimos la página actual de nuevo.
            // No manipulamos el array local porque el orden/filtro
            // lo decide Supabase (ej: defaultSort por created_at desc).
            refetch();
            setModalAbierto(false);
          }}
        />
      </Modal>
    </div>
  );
}
