"use client";

import { ColumnDef, SortingState, ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { useState, useMemo } from "react";

// Ajusta las rutas según tu estructura de carpetas
import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTablePagination from "./DataTable/DataTablePagination";
import DataTableToolbar, { TableAction } from "./DataTable/DataTableToolbar";
import { useDataTable } from "./DataTable/useDataTable";
import { Trash2 } from "lucide-react";

export type { TableAction };

/* =========================
    TYPES
========================= */
export type SelectColumnConfig = {
  key: string;
  type: "select";
  options: Record<string, any>[];
  labelKey: string;
  valueKey: string;
  /**
   * true  → dropdown con búsqueda + portal  (recomendado para FK con muchas opciones)
   * false → <select> nativo                 (default, para listas cortas y fijas)
   */
  searchable?: boolean;
};

export type EditableColumnConfig = string | SelectColumnConfig;

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
  editableColumns?: EditableColumnConfig[];
  tableActions?: TableAction[];
  pageSize?: number;
  loading?: boolean;
  rowActions?: (row: TData) => RowAction<TData>[];
  bulkActions?: (rows: TData[]) => BulkAction<TData>[];
  onBulkDelete?: (rows: TData[]) => void;
  onRowClick?: (row: TData) => void;
  onUpdate?: (rowIndex: number, columnId: string, value: any) => void;

  /**
   * Props server-side inyectados automáticamente por useServerTable.
   * No hace falta pasarlos a mano: usa el spread {...props} del hook.
   */
  serverSide?: boolean;
  pageCount?: number;
  /** Total de registros en la BD (para paginación y límite de exportación). */
  totalCount?: number;
  /** En modo server-side: fetcha todos los registros filtrados para exportar. */
  fetchAllRows?: () => Promise<any[]>;
  pagination?: PaginationState;
  onPaginationChange?: (p: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (s: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (f: ColumnFiltersState) => void;
};

/* =========================
    COMPONENT
========================= */
export function DataTable<TData>({
  data,
  columns,
  editableColumns,
  tableActions,
  pageSize = 10,
  loading = false,
  rowActions,
  bulkActions,
  onBulkDelete,
  onRowClick,
  onUpdate,
  // Server-side
  serverSide,
  pageCount,
  totalCount,
  fetchAllRows,
  pagination: externalPagination,
  onPaginationChange,
  sorting: externalSorting,
  onSortingChange,
  columnFilters: externalColumnFilters,
  onColumnFiltersChange,
}: DataTableProps<TData>) {
  const processedColumns = useMemo(() => {
    if (!editableColumns?.length) return columns;
    return columns.map((col) => {
      const key = (col as any).accessorKey as string;
      const config = editableColumns.find((e) =>
        typeof e === "string" ? e === key : e.key === key
      );
      if (!config) return col;
      const meta =
        typeof config === "string"
          ? { editable: true }
          : {
              editable   : true,
              type       : config.type,
              options    : config.options,
              labelKey   : config.labelKey,
              valueKey   : config.valueKey,
              searchable : config.searchable ?? false,
            };
      return { ...col, meta: { ...((col as any).meta ?? {}), ...meta } };
    });
  }, [columns, editableColumns]);

  const { table, pagination, handlePageSizeChange, activeFilter, setActiveFilter } = useDataTable({
    data,
    columns: processedColumns,
    pageSize,
    onUpdate,
    // Server-side passthrough
    serverSide,
    pageCount,
    externalPagination,
    onExternalPaginationChange: onPaginationChange,
    externalSorting,
    onExternalSortingChange: onSortingChange,
    externalColumnFilters,
    onExternalColumnFiltersChange: onColumnFiltersChange,
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
          <span className="text-[11px] text-violet-700 dark:text-violet-300 font-medium">
            {selectedData.length} seleccionados
          </span>

          <div className="flex items-center gap-2">
            {/* Bulk actions custom (si las hay) */}
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

            {/* Botón eliminar selección */}
            {onBulkDelete && (
              <button
                onClick={() => onBulkDelete(selectedData)}
                className="w-8 h-8 rounded-full flex items-center justify-center gap-1 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group relative"
                title={`Eliminar ${selectedData.length} registro${selectedData.length !== 1 ? "s" : ""}`}
              >
                <Trash2 size={13} />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none group-hover:bg-red-700 transition-colors">
                  {selectedData.length}
                </span>
              </button>
            )}

            {/* Botón deseleccionar */}
            <button
              onClick={() => table.resetRowSelection()}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 text-[12px]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      {tableActions && tableActions.length > 0 && (
        <DataTableToolbar
          actions={tableActions}
          table={table}
          fetchAllRows={fetchAllRows}
          totalCount={totalCount}
        />
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
        totalCount={totalCount}
      />
    </div>
  );
}
