"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCrud } from "./useCrud";

type UseTableCrudOptions<T extends Record<string, any>> = {
  initialData: T[];
  tableName: string;
  onEdit?: (row: T) => void;
  deleteLabel?: (row: T) => string;
};

export function useTableCrud<T extends Record<string, any>>({
  initialData,
  tableName,
  onEdit,
  deleteLabel = () => "este registro",
}: UseTableCrudOptions<T>) {
  const router = useRouter();
  const { updateRecord, deleteRecord } = useCrud<T>(tableName);
  const [data, setData] = useState<T[]>(initialData);

  const handleUpdate = async (rowIndex: number, columnId: string, value: any) => {
    const row = data[rowIndex];
    const prevValue = row[columnId as keyof T];

    setData((prev) =>
      prev.map((r, i) => (i === rowIndex ? { ...r, [columnId]: value } : r))
    );

    toast.promise(updateRecord(row.id, { [columnId]: value } as Partial<T>), {
      loading: "Guardando...",
      success: "Guardado",
      error: () => {
        setData((prev) =>
          prev.map((r, i) => (i === rowIndex ? { ...r, [columnId]: prevValue } : r))
        );
        return "Error al guardar";
      },
    });
  };

  const handleBulkDelete = (rows: T[]) => {
    toast.warning(`¿Eliminar ${rows.length} registro${rows.length !== 1 ? "s" : ""}?`, {
      description: "Esta acción no se puede deshacer.",
      duration: 5000,
      action: {
        label: "Eliminar",
        onClick: () => {
          const ids = new Set(rows.map((r) => r.id));
          toast.promise(
            (async () => {
              const results = await Promise.all(rows.map((r) => deleteRecord(r.id)));
              if (results.some((ok) => !ok)) throw new Error("Algunos registros no pudieron eliminarse.");
              return results.length;
            })(),
            {
              loading: `Eliminando ${rows.length} registros...`,
              success: (n) => {
                setData((prev) => prev.filter((r) => !ids.has(r.id)));
                return `${n} registro${n !== 1 ? "s" : ""} eliminado${n !== 1 ? "s" : ""}`;
              },
              error: (e) => (e instanceof Error ? e.message : "Error al eliminar"),
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  const handleDelete = (row: T) => {
    toast.warning(`¿Eliminar ${deleteLabel(row)}?`, {
      description: "Esta acción no se puede deshacer.",
      duration: 5000,
      action: {
        label: "Eliminar",
        onClick: () => {
          toast.promise(
            (async () => {
              const ok = await deleteRecord(row.id);
              if (!ok) throw new Error("No se pudo eliminar el registro.");
              return true;
            })(),
            {
              loading: "Eliminando...",
              success: () => {
                setData((prev) => prev.filter((r) => r.id !== row.id));
                return "Eliminado correctamente";
              },
              error: (e) => (e instanceof Error ? e.message : "Error al eliminar"),
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  const rowActions = (row: T) => [
    ...(onEdit
      ? [{ label: "Editar", onClick: () => onEdit(row), variant: "outline" as const }]
      : []),
    { label: "Eliminar", onClick: () => handleDelete(row), variant: "danger" as const },
  ];

  return {
    data,
    setData,
    props: {
      data,
      onUpdate: handleUpdate,
      onBulkDelete: handleBulkDelete,
      rowActions,
    },
  };
}
