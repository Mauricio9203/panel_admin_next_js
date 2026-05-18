"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { useCrud } from "@/hooks/useCrud";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // 🔥 Importamos toast

// Importaciones unificadas del sistema de diseño y subcomponentes
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
    cell: ({ row }) => {
      const precio = parseFloat(row.getValue("precio"));
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(precio);
    },
    enableColumnFilter: false,
  },
  { accessorKey: "stock", header: "Stock" },
];

interface ProductosTableProps {
  initialData: Producto[];
}

export default function ProductosTable({ initialData }: ProductosTableProps) {
  const router = useRouter();
  const { deleteRecord } = useCrud<Producto>("productos");

  // Estados para controlar tu Modal de cristal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  // Lógica de borrado optimizada con Sonner
  const handleEliminar = (producto: Producto) => {
    // 1. Desplegamos un toast interactivo de confirmación estética
    toast.warning(`¿Estás seguro de eliminar "${producto.nombre}"?`, {
      description: "Esta acción no se puede deshacer.",
      duration: 5000, // Da buen margen de tiempo para interactuar
      action: {
        label: "Eliminar",
        onClick: async () => {
          // 2. Si hace clic en "Eliminar", disparamos la promesa
          const ejecutarEliminacion = async () => {
            const exito = await deleteRecord(producto.id);
            if (!exito) {
              throw new Error("No se pudo eliminar el producto de la base de datos.");
            }
            return true;
          };

          // 3. Vinculamos los estados de la promesa al feedback de Sonner
          toast.promise(ejecutarEliminacion(), {
            loading: "Eliminando producto...",
            success: () => {
              router.refresh(); // Actualiza los datos del Server Component en segundo plano
              return `"${producto.nombre}" eliminado correctamente.`;
            },
            error: (err) => (err instanceof Error ? err.message : "Error al intentar eliminar."),
          });
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Función para abrir el modal en modo edición
  const handleEditar = (producto: Producto) => {
    setProductoAEditar(producto);
    setModalAbierto(true);
  };

  const obtenerAccionesDeFila = (producto: Producto) => [
    {
      label: "Editar",
      onClick: () => handleEditar(producto),
      variant: "outline" as const,
    },
    {
      label: "Eliminar",
      onClick: () => handleEliminar(producto),
      variant: "danger" as const,
    },
  ];

  return (
    <div className="w-full space-y-4 relative">
      <div className="fixed bottom-6 right-6 z-50 sm:relative sm:bottom-auto sm:right-auto sm:flex sm:justify-end sm:px-2 sm:py-2">
        <Button
          variant="primary"
          size="xl"
          className="h-14 w-14 p-0 sm:h-8 sm:w-auto sm:px-3 sm:py-1 text-sm shadow-xl sm:shadow-md"
          onClick={() => {
            setProductoAEditar(null);
            setModalAbierto(true);
          }}
        >
          <Plus className="w-6 h-6 sm:w-4 sm:bg-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
        </Button>
      </div>

      {/* Componente DataTable genérico */}
      <DataTable<Producto> data={initialData} columns={columns} pageSize={5} rowActions={obtenerAccionesDeFila} />

      {/* Modal personalizado */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} title={productoAEditar ? "Editar Producto" : "Agregar Nuevo Producto"} size="md">
        <FormProducto productoEdicion={productoAEditar} onExito={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}
