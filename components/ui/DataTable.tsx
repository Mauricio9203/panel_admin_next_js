"use client";

import { ColumnDef } from "@tanstack/react-table";

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

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  loading?: boolean;
  rowActions?: (row: TData) => RowAction<TData>[];
  onRowClick?: (row: TData) => void;
};

/* =========================
   COMPONENT
========================= */
export function DataTable<TData>({ data, columns, pageSize = 5, loading = false, rowActions, onRowClick }: DataTableProps<TData>) {
  const { table, pagination, handlePageSizeChange, activeFilter, setActiveFilter } = useDataTable({
    data,
    columns,
    pageSize,
  });

  return (
    <div className="rounded-lg border border-violet-500/10 bg-white dark:bg-neutral-950 overflow-hidden flex flex-col max-h-[70vh] w-full max-w-full min-w-0">
      {/* =========================
          TABLE WRAPPER (FIX REAL)
      ========================= */}
      <div className="w-full max-w-full overflow-x-auto min-w-0">
        {/* 👇 CLAVE: permite expansión real para activar scroll */}
        <table className="min-w-max w-full table-auto text-[11px]">
          {/* HEADER */}
          <DataTableHeader table={table} activeFilter={activeFilter} setActiveFilter={setActiveFilter} hasRowActions={!!rowActions} />

          {/* BODY */}
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
