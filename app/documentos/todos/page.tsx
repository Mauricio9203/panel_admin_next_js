"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import TituloModulo from "@/components/ui/TituloModulo";

/* =========================
   TYPE
========================= */
type Documento = {
  nombre: string;
  tipo: string;
  fecha: string;
};

/* =========================
   DATA
========================= */
const data: Documento[] = [
  { nombre: "Contrato.pdf", tipo: "PDF", fecha: "2026-05-01" },
  { nombre: "Reporte.docx", tipo: "Word", fecha: "2026-05-02" },
  { nombre: "Datos.xlsx", tipo: "Excel", fecha: "2026-05-03" },
  { nombre: "Factura.pdf", tipo: "PDF", fecha: "2026-05-04" },
  { nombre: "Resumen.docx", tipo: "Word", fecha: "2026-05-05" },
  { nombre: "Plan.xlsx", tipo: "Excel", fecha: "2026-05-06" },
  { nombre: "Propuesta_comercial.pdf", tipo: "PDF", fecha: "2026-05-07" },
  { nombre: "Informe_finanzas_q1.xlsx", tipo: "Excel", fecha: "2026-05-08" },
  { nombre: "Acta_reunion.docx", tipo: "Word", fecha: "2026-05-09" },
  { nombre: "Manual_usuario.pdf", tipo: "PDF", fecha: "2026-05-10" },

  { nombre: "Estrategia_marketing.pdf", tipo: "PDF", fecha: "2026-05-11" },
  { nombre: "Balance_general.xlsx", tipo: "Excel", fecha: "2026-05-12" },
  { nombre: "Contrato_proveedor.docx", tipo: "Word", fecha: "2026-05-13" },
  { nombre: "Flujo_caja.xlsx", tipo: "Excel", fecha: "2026-05-14" },
  { nombre: "Analisis_competencia.pdf", tipo: "PDF", fecha: "2026-05-15" },
  { nombre: "Acta_directorio.docx", tipo: "Word", fecha: "2026-05-16" },
  { nombre: "Presupuesto_anual.xlsx", tipo: "Excel", fecha: "2026-05-17" },
  { nombre: "Informe_ventas.pdf", tipo: "PDF", fecha: "2026-05-18" },
  { nombre: "Presentacion_clientes.pptx", tipo: "PowerPoint", fecha: "2026-05-19" },
  { nombre: "Registro_proveedores.xlsx", tipo: "Excel", fecha: "2026-05-20" },

  { nombre: "Manual_procesos.docx", tipo: "Word", fecha: "2026-05-21" },
  { nombre: "Plan_operativo.pdf", tipo: "PDF", fecha: "2026-05-22" },
  { nombre: "Indicadores_kpi.xlsx", tipo: "Excel", fecha: "2026-05-23" },
  { nombre: "Informe_rrhh.docx", tipo: "Word", fecha: "2026-05-24" },
  { nombre: "Ejecucion_presupuesto.xlsx", tipo: "Excel", fecha: "2026-05-25" },
  { nombre: "Politicas_internas.pdf", tipo: "PDF", fecha: "2026-05-26" },
  { nombre: "Evaluacion_proyectos.docx", tipo: "Word", fecha: "2026-05-27" },
  { nombre: "Cierre_mensual.xlsx", tipo: "Excel", fecha: "2026-05-28" },
  { nombre: "Informe_auditoria.pdf", tipo: "PDF", fecha: "2026-05-29" },
  { nombre: "Resumen_ejecutivo.docx", tipo: "Word", fecha: "2026-05-30" },
];

/* =========================
   COLUMNS
========================= */
const columns: ColumnDef<Documento>[] = [
  {
    accessorKey: "nombre",
    header: "Documento",
    cell: ({ row }) => <span className="block truncate max-w-[150px] md:max-w-xs font-medium text-neutral-900 dark:text-neutral-100">{row.original.nombre}</span>,
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

/* =========================
   PAGE
========================= */
export default function Page() {
  return (
    /**
     * 1. grid-cols-1 + min-w-0: Obliga al navegador a calcular el ancho
     *    basándose en el padre y no en el contenido de la tabla.
     */
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Documentos" variant="violet" />

      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <div className="overflow-x-auto w-full">
          <DataTable
            data={data}
            columns={columns}
            pageSize={10}
            rowActions={(row) => [
              {
                label: "Ver",
                onClick: () => console.log("ver", row),
              },
              {
                label: "Editar",
                onClick: () => console.log("editar", row),
              },
              {
                label: "Eliminar",
                variant: "danger",
                onClick: () => console.log("eliminar", row),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
