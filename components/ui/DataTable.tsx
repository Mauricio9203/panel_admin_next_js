"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTablePagination from "./DataTable/DataTablePagination";
import { useDataTable } from "./DataTable/useDataTable";

/* =========================
   TYPES
========================= */
type RowAction<TData> = {
  label: string;
  onClick: (row: TData) => void;
  variant?: "default" | "danger";
};

type BulkAction<TData> = {
  label: string;
  onClick: (rows: TData[]) => void;
  variant?: "default" | "danger";
};

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  loading?: boolean;
  rowActions?: (row: TData) => RowAction<TData>[];
  bulkActions?: (rows: TData[]) => BulkAction<TData>[];
  onRowClick?: (row: TData) => void;
};

/* =========================
   COMPONENT
========================= */
export function DataTable<TData>({ data, columns, pageSize = 5, loading = false, rowActions, bulkActions, onRowClick }: DataTableProps<TData>) {
  const { table, pagination, handlePageSizeChange, activeFilter, setActiveFilter } = useDataTable({
    data,
    columns,
    pageSize,
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
    <div className="rounded-lg border border-violet-500/10 bg-white dark:bg-neutral-950 overflow-hidden flex flex-col max-h-[70vh] w-full max-w-full min-w-0">
      {/* =========================
          BULK ACTIONS BAR
      ========================= */}
      {hasSelection && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-violet-500/10 bg-violet-500/5">
          {/* contador */}
          <span className="text-xs text-violet-700 dark:text-violet-300">{selectedData.length} seleccionados</span>

          <div className="flex items-center gap-2 relative">
            {/* =========================
                DESKTOP ACTIONS
            ========================= */}
            <div className="hidden md:flex items-center gap-2">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => action.onClick(selectedData)}
                  className={`
                    px-3 py-1 text-xs rounded-md transition
                    ${action.variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "bg-violet-600 text-white hover:bg-violet-700"}
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* =========================
                MOBILE DROPDOWN
            ========================= */}
            <div className="md:hidden relative">
              <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="px-3 py-1 text-xs rounded-md bg-violet-600 text-white">
                Opciones ▾
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg z-50">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        action.onClick(selectedData);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full text-left px-3 py-2 text-xs transition
                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                        ${action.variant === "danger" ? "text-red-600" : ""}
                      `}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* =========================
                CLEAR SELECTION
            ========================= */}
            <button onClick={() => table.resetRowSelection()} className="px-2 py-1 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* =========================
          TABLE
      ========================= */}
      <div className="w-full max-w-full overflow-x-auto min-w-0">
        <table className="min-w-max w-full table-auto text-[11px]">
          <DataTableHeader table={table} activeFilter={activeFilter} setActiveFilter={setActiveFilter} hasRowActions={!!rowActions} />

          <DataTableBody table={table} loading={loading} rowActions={rowActions} onRowClick={onRowClick} />
        </table>
      </div>

      {/* =========================
          PAGINATION
      ========================= */}
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
