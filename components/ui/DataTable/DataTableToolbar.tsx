"use client";

import { useState, useRef, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Download, ChevronDown, Plus, FileText, FileSpreadsheet, Braces } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import * as XLSX from "xlsx";
import { toast } from "sonner";

/* ===========================
   TIPOS EXPORTADOS
=========================== */
export type CustomAction = {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
};

export type ExportAction = {
  type: "export";
  formats: ("csv" | "excel" | "json")[];
  filename?: string;
};

export type TableAction = CustomAction | ExportAction;

/* ===========================
   TIPOS INTERNOS
=========================== */
type ExportData = { headers: string[]; rows: any[][] };

/* ===========================
   UTILIDADES DE EXPORTACIÓN
=========================== */

/** Columnas visibles con accessorKey (excluye columnas de UI como acciones). */
function getVisibleCols(table: Table<any>) {
  return table.getAllLeafColumns().filter((col) => {
    const def = col.columnDef as any;
    return def.accessorKey && col.getIsVisible();
  });
}

/** Obtiene headers + filas desde el modelo filtrado del cliente. */
function getClientExportData(table: Table<any>): ExportData {
  const cols = getVisibleCols(table);
  const headers = cols.map((col) => (typeof col.columnDef.header === "string" ? col.columnDef.header : col.id));
  const rows    = table.getFilteredRowModel().rows.map((row) => cols.map((col) => row.getValue(col.id) ?? ""));
  return { headers, rows };
}

/** Obtiene headers + filas a partir de datos crudos (para exportación server-side). */
function getServerExportData(table: Table<any>, rawData: any[]): ExportData {
  const cols    = getVisibleCols(table);
  const headers = cols.map((col) => (typeof col.columnDef.header === "string" ? col.columnDef.header : col.id));
  const rows    = rawData.map((item) => cols.map((col) => item[(col.columnDef as any).accessorKey] ?? ""));
  return { headers, rows };
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function doExportCSV({ headers, rows }: ExportData, filename: string) {
  const escape = (v: any) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  triggerBlobDownload(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), `${filename}.csv`);
}

function doExportJSON({ headers, rows }: ExportData, filename: string) {
  const data = rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
  triggerBlobDownload(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `${filename}.json`);
}

function doExportExcel({ headers, rows }: ExportData, filename: string) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  worksheet["!cols"] = headers.map((h, i) => ({
    wch: Math.min(Math.max(String(h).length, ...rows.map((r) => String(r[i] ?? "").length)) + 2, 50),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  triggerBlobDownload(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${filename}.xlsx`
  );
}

const FORMAT_CONFIG = {
  csv:   { label: "CSV (.csv)",   Icon: FileText },
  excel: { label: "Excel (.xlsx)", Icon: FileSpreadsheet },
  json:  { label: "JSON (.json)", Icon: Braces },
} as const;

const EXPORT_LIMIT = 50_000;

/* ===========================
   COMPONENTE
=========================== */
type Props<TData> = {
  actions: TableAction[];
  table: Table<TData>;
  /** En modo server-side: función que carga TODOS los datos filtrados desde Supabase. */
  fetchAllRows?: () => Promise<any[]>;
  /** Total de registros (para mostrar advertencia si supera el límite). */
  totalCount?: number;
};

export default function DataTableToolbar<TData>({ actions, table, fetchAllRows, totalCount }: Props<TData>) {
  const [exportOpen, setExportOpen] = useState(false);
  const [fabOpen,    setFabOpen]    = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const exportAction  = actions.find((a): a is ExportAction  => "type" in a && a.type === "export");
  const customActions = actions.filter((a): a is CustomAction => !("type" in a));
  const filename      = exportAction?.filename ?? "export";

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  /* ===========================
     LÓGICA DE EXPORTACIÓN
  =========================== */

  /** Genera y descarga el archivo con los datos ya obtenidos. */
  const generateFile = (exportData: ExportData, format: "csv" | "excel" | "json") => {
    if (format === "csv")   doExportCSV(exportData, filename);
    if (format === "json")  doExportJSON(exportData, filename);
    if (format === "excel") doExportExcel(exportData, filename);
  };

  /** Exportación server-side: fetch de todos los registros filtrados + descarga. */
  const runServerExport = (format: "csv" | "excel" | "json") => {
    toast.promise(
      (async () => {
        const rawData    = await fetchAllRows!();
        const exportData = getServerExportData(table as Table<any>, rawData);
        generateFile(exportData, format);
        return rawData.length;
      })(),
      {
        loading: "Preparando exportación...",
        success: (n: number) => `${n.toLocaleString()} registros exportados`,
        error:   (e: any)    => `Error al exportar: ${e?.message ?? "error desconocido"}`,
      }
    );
  };

  const handleExport = (format: "csv" | "excel" | "json") => {
    setExportOpen(false);
    setFabOpen(false);

    if (fetchAllRows) {
      // Server-side: advertir si hay muchos registros
      if (totalCount && totalCount > EXPORT_LIMIT) {
        toast.warning(`Son ${totalCount.toLocaleString()} registros. Esto puede tardar un momento.`, {
          description: "¿Deseas continuar con la exportación?",
          duration: 8000,
          action: {
            label: "Exportar igual",
            onClick: () => runServerExport(format),
          },
          cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
        });
        return;
      }
      runServerExport(format);
    } else {
      // Cliente: todos los datos ya están en memoria
      generateFile(getClientExportData(table as Table<any>), format);
    }
  };

  /* ===========================
     SPEED DIAL ITEMS
  =========================== */
  const speedDialItems = [
    ...(exportAction?.formats ?? []).map((fmt) => ({
      key:   fmt,
      label: FORMAT_CONFIG[fmt].label,
      Icon:  FORMAT_CONFIG[fmt].Icon,
      onClick: () => handleExport(fmt),
      color: "bg-muted-foreground/70",
    })),
    ...customActions.map((a, i) => ({
      key:   `custom-${i}`,
      label: a.label,
      Icon:  (a.icon ?? Plus) as React.ComponentType<{ size?: number }>,
      onClick: () => { setFabOpen(false); a.onClick(); },
      color: a.variant === "danger" ? "bg-red-500" : "bg-primary",
    })),
  ];

  return (
    <>
      {/* ── DESKTOP TOOLBAR ── */}
      <div className="hidden md:flex items-center justify-end gap-2 px-3 py-2 border-b border-primary/10">
        {exportAction && (
          <div ref={exportRef} className="relative">
            <Button variant="outline" size="sm" onClick={() => setExportOpen((o) => !o)} className="gap-1.5 text-[11px]">
              <Download size={13} />
              Exportar
              <ChevronDown size={11} className={`transition-transform duration-150 ${exportOpen ? "rotate-180" : ""}`} />
            </Button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-popover border border-border rounded-md shadow-xl z-[200] py-1 animate-in fade-in duration-100">
                {exportAction.formats.map((fmt) => {
                  const { label, Icon } = FORMAT_CONFIG[fmt];
                  return (
                    <button key={fmt} onClick={() => handleExport(fmt)} className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2 hover:bg-primary/8 transition-colors text-popover-foreground">
                      <Icon size={13} className="opacity-60" />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {customActions.map((action, i) => (
          <Button key={i} variant={action.variant ?? "primary"} size="sm" onClick={action.onClick} className="gap-1.5 text-[11px]">
            {action.icon && <action.icon size={13} />}
            {action.label}
          </Button>
        ))}
      </div>

      {/* ── MOBILE FAB SPEED DIAL ── */}
      <div className="md:hidden">
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setFabOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
          <AnimatePresence>
            {fabOpen && speedDialItems.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0,  scale: 1   }}
                exit={{ opacity: 0, y: 16, scale: 0.8 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="bg-card text-card-foreground text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {item.label}
                </span>
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
                >
                  <item.Icon size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            onClick={() => setFabOpen((o) => !o)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl active:scale-95"
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>
    </>
  );
}
