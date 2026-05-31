"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { usePermission } from "@/hooks/usePermission";
import { Plus, FileIcon, ExternalLink, Files } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";

// Componentes del módulo
import { FormDocumento } from "./FormDocumento";
import { FormSubidaMasiva } from "./FormSubidaMasiva";
import { deleteFileAction } from "./actions/deleteFileAction";

/* ============================
    TIPO DE DATO
============================ */
export type Documento = {
  id: string;
  created_at: string;
  nombre: string;
  url_r2: string;
  size: number;
  mime_type: string;
};

/* ============================
    UTILIDADES
============================ */
function fmtBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/* ============================
    COLUMNAS DE LA TABLA
============================ */
const columns: ColumnDef<Documento, any>[] = [
  {
    accessorKey: "nombre",
    header: "Archivo",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-left">
        <div className="p-2 rounded-xl bg-muted text-muted-foreground">
          <FileIcon size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-tight">
            {row.getValue("nombre")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
            {(row.original.mime_type)?.split("/")[1] || "file"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Tamaño",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {fmtBytes(row.getValue("size") || 0)}
      </span>
    ),
  },
  {
    id: "link",
    header: "Acceso",
    cell: ({ row }) => (
      <a
        href={row.original.url_r2}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold"
      >
        <ExternalLink size={14} />
        Ver archivo
      </a>
    ),
  },
];

/* ============================
    COMPONENTE PRINCIPAL
============================ */
export default function DocumentosServerTable() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoSubida, setModoSubida] = useState<"individual" | "masiva">("individual");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Permisos
  const canCrear = usePermission("crear");
  const canEliminar = usePermission("eliminar");
  const canExportar = usePermission("exportar");

  // Hook de Supabase
  const { props, refetch } = useSupabaseTable<Documento>({
    mode: "server",
    tableName: "documentos",
    select: "id, created_at, nombre, url_r2, size, mime_type",
    pageSize: 10,
    defaultSort: { column: "created_at", ascending: false },
  });

  /* ============================
      LÓGICA DE BORRADO INDIVIDUAL
  ============================ */
  const handleCustomDelete = async (row: Documento) => {
    const toastId = toast.loading(`Eliminando "${row.nombre}"...`);
    try {
      const res = await deleteFileAction(row.id, row.url_r2);
      if (!res.success) throw new Error(res.error);
      toast.success(`"${row.nombre}" eliminado`, { id: toastId });
      refetch();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  /* ============================
      LÓGICA DE BORRADO MASIVO
  ============================ */
  const handleBulkDelete = async (rows: Documento[]) => {
    const total = rows.length;
    const toastId = toast.loading(`Preparando eliminación de ${total} archivos...`);
    
    let eliminados = 0;
    let errores = 0;

    for (const row of rows) {
      try {
        const res = await deleteFileAction(row.id, row.url_r2);
        if (res.success) {
          eliminados++;
        } else {
          errores++;
        }
        
        // Actualizamos el toast con el progreso real 1/X
        toast.loading(`Eliminando archivos: ${eliminados + errores}/${total}...`, {
          id: toastId,
        });
      } catch (error) {
        errores++;
      }
    }

    if (errores === 0) {
      toast.success(`Se eliminaron los ${total} archivos correctamente.`, { id: toastId });
    } else {
      toast.warning(`Terminado: ${eliminados} eliminados, ${errores} fallaron.`, { id: toastId });
    }

    refetch();
  };

  return (
    <div className="w-full space-y-4">
      <DataTable<Documento>
        {...props} 
        columns={columns}
        // Habilitar checkbox y papelera de reciclaje
        onBulkDelete={canEliminar ? handleBulkDelete : undefined}
        
        // Acciones por fila
        rowActions={
          canEliminar
            ? (row) => [
                {
                  label: "Eliminar archivo",
                  variant: "danger" as const,
                  onClick: () => handleCustomDelete(row),
                },
              ]
            : undefined
        }

        // Acciones de la barra superior
        tableActions={[
          ...(canCrear ? [
            {
              label: "Subir Uno",
              icon: Plus,
              onClick: () => {
                setModoSubida("individual");
                setModalAbierto(true);
              },
              variant: "outline" as const,
            },
            {
              label: "Subida Masiva",
              icon: Files,
              onClick: () => {
                setModoSubida("masiva");
                setModalAbierto(true);
              },
              variant: "primary" as const,
            }
          ] : []),
          ...(canExportar ? [{
            type: "export" as const,
            formats: ["csv", "excel"] as ("csv" | "excel")[],
            filename: "reporte_documentos",
          }] : []),
        ]}
      />

      {/* Modal dinámico */}
      <Modal 
        open={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        title={modoSubida === "masiva" ? "Subida Múltiple a R2" : "Nuevo Documento"} 
        size="md"
      >
        <div className="p-1">
          {modoSubida === "masiva" ? (
            <FormSubidaMasiva 
              onExito={() => { 
                refetch(); 
                setModalAbierto(false); 
              }} 
            />
          ) : (
            <FormDocumento 
              onExito={() => { 
                refetch(); 
                setModalAbierto(false); 
              }} 
            />
          )}
        </div>
      </Modal>
    </div>
  );
}