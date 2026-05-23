"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import type { AuditEntry } from "./page";

/* ──────────────────────
   FORMATO FECHA Y HORA
────────────────────── */
function fmtDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/* ──────────────────────
   BADGE DE ACCIÓN
────────────────────── */
const ACTION_STYLES: Record<string, string> = {
  editar:                   "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300",
  eliminar:                 "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_masivo:          "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_usuario:         "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  eliminar_masivo_usuarios: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300",
  cambiar_rol:              "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  cambiar_rol_masivo:       "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  crear:                    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300",
};

const DEFAULT_BADGE = "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";

/* ──────────────────────
   COLUMNAS
────────────────────── */
const columns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: "created_at",
    header:      "Fecha",
    cell: ({ row }) => (
      <span className="text-[11px] text-neutral-500 whitespace-nowrap">
        {fmtDateTime(row.getValue("created_at"))}
      </span>
    ),
  },
  {
    accessorKey: "user_email",
    header:      "Usuario",
    cell: ({ row }) => (
      <span className="text-[12px] text-neutral-700 dark:text-neutral-300">
        {row.getValue("user_email")}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header:      "Acción",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${ACTION_STYLES[action] ?? DEFAULT_BADGE}`}>
          {action.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "entity",
    header:      "Módulo",
    cell: ({ row }) => (
      <span className="text-[11px] text-neutral-500 font-mono">
        {row.getValue("entity")}
      </span>
    ),
  },
  {
    accessorKey: "detail",
    header:      "Detalle",
    cell: ({ row }) => (
      <span className="text-[12px] text-neutral-600 dark:text-neutral-400">
        {row.getValue("detail") ?? "—"}
      </span>
    ),
  },
];

/* ──────────────────────
   COMPONENTE
────────────────────── */
export default function AuditoriaTable({ data }: { data: AuditEntry[] }) {
  return (
    <DataTable<AuditEntry>
      data={data}
      columns={columns}
      pageSize={25}
    />
  );
}
