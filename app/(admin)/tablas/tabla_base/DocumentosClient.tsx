"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { toast } from "sonner";

/* === Tipos === */
type Documento = {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
};

/* === Datos Iniciales (Mock) === */
const initialData: Documento[] = [
  { id: 1, nombre: "Contrato.pdf", tipo: "PDF", fecha: "2026-05-01" },
  { id: 2, nombre: "Reporte.docx", tipo: "Word", fecha: "2026-05-02" },
  { id: 3, nombre: "Datos.xlsx", tipo: "Excel", fecha: "2026-05-03" },
];

export default function DocumentosClient() {
  const [documentos, setDocumentos] = useState<Documento[]>(initialData);

  /* === Definición de Columnas === */
  const columns: ColumnDef<Documento, any>[] = [
    {
      accessorKey: "nombre",
      header: "Documento",
      meta: { editable: true } as any,
      cell: ({ row }) => <span className="block truncate max-w-[150px] md:max-w-xs font-medium text-neutral-900 dark:text-neutral-100 italic">{row.original.nombre}</span>,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => <span className="whitespace-nowrap text-neutral-600 dark:text-neutral-400">{row.original.tipo}</span>,
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="whitespace-nowrap text-neutral-500">{row.original.fecha}</span>,
    },
  ];

  const handleUpdateData = (rowIndex: number, columnId: string, value: any) => {
    setDocumentos((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, [columnId]: value };
        }
        return row;
      }),
    );
    let todalafila = documentos[rowIndex];
    console.log("Fila completa antes de la edición:", todalafila);
    console.log(`Documento editado: ${columnId} ahora es ${value}`);

    toast.success("Registro actualizado", {
      description: "Los cambios se han guardado en la base de datos.",
    });
  };

  return (
    <DataTable
      data={documentos}
      columns={columns}
      pageSize={10}
      onUpdate={handleUpdateData}
      rowActions={(row) => [
        {
          label: "Ver",
          onClick: () => console.log("Abriendo archivo:", row.nombre),
        },
        {
          label: "Eliminar",
          variant: "danger",
          onClick: () => {
            setDocumentos((prev) => prev.filter((d) => d.id !== row.id));
            console.log("Eliminado:", row.id);
          },
        },
      ]}
      bulkActions={(rows) => [
        {
          label: "Eliminar seleccionados",
          variant: "danger",
          onClick: (selected) => {
            const ids = selected.map((s) => s.id);
            setDocumentos((prev) => prev.filter((d) => !ids.includes(d.id)));
          },
        },
        {
          label: "Descargar ZIP",
          onClick: (selected) => console.log("Descargando:", selected.length),
        },
      ]}
    />
  );
}
