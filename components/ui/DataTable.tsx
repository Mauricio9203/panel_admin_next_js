"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

// Ajusta las rutas según tu estructura de carpetas
import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTablePagination from "./DataTable/DataTablePagination";
import { useDataTable } from "./DataTable/useDataTable";

/* =========================
    TYPES
========================= */
type RowAction<TData> = {
  label: string;
  onClick: (row: TData) => void | Promise<void>; // 1. Permitimos promesas (async)
  variant?: "default" | "danger" | "outline"; // 2. Agregamos "outline"
};

type BulkAction<TData> = {
  label: string;
  onClick: (rows: TData[]) => void;
  variant?: "default" | "danger" | "outline";
};

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  loading?: boolean;
  rowActions?: (row: TData) => RowAction<TData>[];
  bulkActions?: (rows: TData[]) => BulkAction<TData>[];
  onRowClick?: (row: TData) => void;
  onUpdate?: (rowIndex: number, columnId: string, value: any) => void; // Prop vital para reutilización
};

/* =========================
    COMPONENT
========================= */
export function DataTable<TData>({
  data,
  columns,
  pageSize = 5,
  loading = false,
  rowActions,
  bulkActions,
  onRowClick,
  onUpdate, // 1. Extraemos la prop correctamente
}: DataTableProps<TData>) {
  // 2. Pasamos la prop onUpdate directamente al hook
  const { table, pagination, handlePageSizeChange, activeFilter, setActiveFilter } = useDataTable({
    data,
    columns,
    pageSize,
    onUpdate, // El componente ya no decide qué hacer, solo "pasa el recado"
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================
      SELECTION STATE
  ========================= */
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((r) => r.original);
  const hasSelection = selectedData.length > 0;
  const actions = bulkActions?.(selectedData) ?? [];

  return (
    <div className="rounded-sm border border-violet-500/10 bg-white dark:bg-neutral-950 overflow-hidden flex flex-col max-h-[70vh] w-full max-w-full min-w-0 transition-colors">
      {/* BARRA DE ACCIONES MASIVAS */}
      {hasSelection && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-violet-500/10 bg-violet-500/5 animate-in fade-in duration-200">
          <span className="text-[11px] text-violet-700 dark:text-violet-300 font-medium">{selectedData.length} seleccionados</span>

          <div className="flex items-center gap-2 relative">
            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-2">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => action.onClick(selectedData)}
                  className={`px-3 py-1 text-[11px] rounded-md transition font-medium ${action.variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : action.variant === "outline" ? "bg-transparent text-violet-600 border border-violet-600 hover:bg-violet-100 dark:hover:bg-violet-800" : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"}`}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* MOBILE */}
            <div className="md:hidden relative">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="px-3 py-1 text-[11px] rounded-md bg-violet-600 text-white">
                Opciones ▾
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-xl z-50 py-1">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        action.onClick(selectedData);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${action.variant === "danger" ? "text-red-600" : action.variant === "outline" ? "text-violet-600 border border-violet-600" : "text-neutral-700 dark:text-neutral-300"}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => table.resetRowSelection()} className="px-2 py-1 text-[11px] rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ÁREA DE TABLA */}
      <div className="w-full max-w-full overflow-x-auto min-w-0 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
        <table className="min-w-max w-full table-auto">
          <DataTableHeader table={table} activeFilter={activeFilter} setActiveFilter={setActiveFilter} hasRowActions={!!rowActions} />

          <DataTableBody table={table} loading={loading} rowActions={rowActions} onRowClick={onRowClick} />
        </table>
      </div>

      {/* PAGINACIÓN */}
      <DataTablePagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </div>
  );
}
