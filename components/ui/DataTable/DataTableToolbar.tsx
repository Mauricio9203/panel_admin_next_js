"use client";

import { useState, useRef, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Download, ChevronDown, Plus, X, FileText, FileSpreadsheet, Braces } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

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
   UTILIDADES DE EXPORTACIÓN
=========================== */
function getExportRows(table: Table<any>) {
  const cols = table.getAllLeafColumns().filter((col) => {
    const def = col.columnDef as any;
    return def.accessorKey && col.getIsVisible();
  });
  const headers = cols.map((col) => {
    const h = col.columnDef.header;
    return typeof h === "string" ? h : col.id;
  });
  const rows = table.getFilteredRowModel().rows.map((row) =>
    cols.map((col) => row.getValue(col.id) ?? "")
  );
  return { headers, rows };
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(table: Table<any>, filename: string) {
  const { headers, rows } = getExportRows(table);
  const escape = (v: any) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  triggerDownload("﻿" + csv, `${filename}.csv`, "text/csv;charset=utf-8");
}

function exportJSON(table: Table<any>, filename: string) {
  const { headers, rows } = getExportRows(table);
  const data = rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
  triggerDownload(JSON.stringify(data, null, 2), `${filename}.json`, "application/json");
}

function exportExcel(table: Table<any>, filename: string) {
  const { headers, rows } = getExportRows(table);
  const cell = (value: any) => {
    const v = value ?? "";
    const isNum = typeof v === "number";
    return `<Cell><Data ss:Type="${isNum ? "Number" : "String"}">${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Data></Cell>`;
  };
  const xmlRows = [
    `<Row>${headers.map((h) => cell(h)).join("")}</Row>`,
    ...rows.map((row) => `<Row>${row.map(cell).join("")}</Row>`),
  ].join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Datos"><Table>${xmlRows}</Table></Worksheet></Workbook>`;
  triggerDownload(xml, `${filename}.xls`, "application/vnd.ms-excel;charset=utf-8");
}

const FORMAT_CONFIG = {
  csv:   { label: "CSV (.csv)",   Icon: FileText },
  excel: { label: "Excel (.xls)", Icon: FileSpreadsheet },
  json:  { label: "JSON (.json)", Icon: Braces },
} as const;

/* ===========================
   COMPONENTE
=========================== */
type Props<TData> = {
  actions: TableAction[];
  table: Table<TData>;
};

export default function DataTableToolbar<TData>({ actions, table }: Props<TData>) {
  const [exportOpen, setExportOpen] = useState(false);
  const [fabOpen, setFabOpen]       = useState(false);
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

  const handleExport = (format: "csv" | "excel" | "json") => {
    setExportOpen(false);
    setFabOpen(false);
    if (format === "csv")   exportCSV(table, filename);
    if (format === "json")  exportJSON(table, filename);
    if (format === "excel") exportExcel(table, filename);
  };

  // Todas las opciones del speed dial (export formats + custom actions)
  const speedDialItems = [
    ...(exportAction?.formats ?? []).map((fmt) => ({
      key: fmt,
      label: FORMAT_CONFIG[fmt].label,
      Icon: FORMAT_CONFIG[fmt].Icon,
      onClick: () => handleExport(fmt),
      color: "bg-neutral-700 dark:bg-neutral-600",
    })),
    ...customActions.map((a, i) => ({
      key: `custom-${i}`,
      label: a.label,
      Icon: (a.icon ?? Plus) as React.ComponentType<{ size?: number }>,
      onClick: () => { setFabOpen(false); a.onClick(); },
      color: a.variant === "danger" ? "bg-red-500" : "bg-violet-600",
    })),
  ];

  return (
    <>
      {/* ── DESKTOP TOOLBAR ── */}
      <div className="hidden md:flex items-center justify-end gap-2 px-3 py-2 border-b border-violet-500/10">
        {exportAction && (
          <div ref={exportRef} className="relative">
            <Button variant="outline" size="sm" onClick={() => setExportOpen((o) => !o)} className="gap-1.5 text-[11px]">
              <Download size={13} />
              Exportar
              <ChevronDown size={11} className={`transition-transform duration-150 ${exportOpen ? "rotate-180" : ""}`} />
            </Button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-xl z-[200] py-1 animate-in fade-in duration-100">
                {exportAction.formats.map((fmt) => {
                  const { label, Icon } = FORMAT_CONFIG[fmt];
                  return (
                    <button key={fmt} onClick={() => handleExport(fmt)} className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 transition-colors text-neutral-700 dark:text-neutral-300">
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
        {/* Overlay */}
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

        {/* Speed dial container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
          {/* Speed dial items */}
          <AnimatePresence>
            {fabOpen && speedDialItems.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.8 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <span className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {item.label}
                </span>
                {/* Mini FAB */}
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
                >
                  <item.Icon size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={() => setFabOpen((o) => !o)}
            className="w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl active:scale-95"
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
