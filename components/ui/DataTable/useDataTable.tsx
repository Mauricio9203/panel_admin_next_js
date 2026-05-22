"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ColumnDef,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import { useState } from "react";

/* ============================
   TIPOS
============================ */
type UseDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  onUpdate?: (rowIndex: number, columnId: string, value: any) => void;

  /**
   * Modo server-side (inyectado por useServerTable).
   * Activa manualPagination / manualSorting / manualFiltering en TanStack Table
   * para que toda la lógica ocurra en Supabase, no en el navegador.
   */
  serverSide?: boolean;
  pageCount?: number;
  externalPagination?: PaginationState;
  onExternalPaginationChange?: (p: PaginationState) => void;
  externalSorting?: SortingState;
  onExternalSortingChange?: (s: SortingState) => void;
  externalColumnFilters?: ColumnFiltersState;
  onExternalColumnFiltersChange?: (f: ColumnFiltersState) => void;
};

/* ============================
   HELPER
============================ */
/** Resuelve el Updater de TanStack (valor directo o función). */
function applyUpdater<T>(prev: T, updater: Updater<T>): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
}

/* ============================
   HOOK
============================ */
export function useDataTable<TData>({
  data,
  columns,
  pageSize = 10,
  onUpdate,
  serverSide = false,
  pageCount: externalPageCount,
  externalPagination,
  onExternalPaginationChange,
  externalSorting,
  onExternalSortingChange,
  externalColumnFilters,
  onExternalColumnFiltersChange,
}: UseDataTableProps<TData>) {
  /* ---------- Estado interno (modo cliente) ---------- */
  const [pagination,     setPagination]     = useState<PaginationState>({ pageIndex: 0, pageSize });
  const [sorting,        setSorting]        = useState<SortingState>([]);
  const [columnFilters,  setColumnFilters]  = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection,   setRowSelection]   = useState<RowSelectionState>({});
  const [activeFilter,   setActiveFilter]   = useState<string | null>(null);

  /* ---------- Estado activo (interno o externo) ---------- */
  const activePagination = serverSide ? externalPagination! : pagination;
  const activeSorting    = serverSide ? externalSorting!    : sorting;
  const activeFilters    = serverSide ? externalColumnFilters! : columnFilters;

  /* ============================
     TABLA
  ============================ */
  const table = useReactTable({
    data,
    columns,
    getRowId: (row: any) => String(row.id),
    defaultColumn: { filterFn: "includesString" },

    state: {
      pagination:    activePagination,
      sorting:       activeSorting,
      columnFilters: activeFilters,
      columnVisibility,
      rowSelection,
    },

    // Modo server-side: TanStack no procesa datos localmente
    manualPagination: serverSide,
    manualSorting:    serverSide,
    manualFiltering:  serverSide,
    ...(serverSide ? { pageCount: externalPageCount ?? 1 } : {}),

    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        onUpdate?.(rowIndex, columnId, value);
      },
    },

    enableRowSelection: true,

    // Handlers: redirigen a estado externo o interno según el modo
    onPaginationChange: serverSide
      ? (updater) => onExternalPaginationChange!(applyUpdater(activePagination, updater))
      : setPagination,

    onSortingChange: serverSide
      ? (updater) => onExternalSortingChange!(applyUpdater(activeSorting, updater))
      : setSorting,

    onColumnFiltersChange: serverSide
      ? (updater) => onExternalColumnFiltersChange!(applyUpdater(activeFilters, updater))
      : setColumnFilters,

    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange:     setRowSelection,

    getCoreRowModel:       getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
  });

  /* ============================
     PAGE SIZE
  ============================ */
  const handlePageSizeChange = (size: number) => {
    if (serverSide) {
      onExternalPaginationChange?.({ pageIndex: 0, pageSize: size });
    } else {
      setPagination((old) => ({ ...old, pageSize: size, pageIndex: 0 }));
    }
  };

  return {
    table,
    pagination: activePagination,
    handlePageSizeChange,
    activeFilter,
    setActiveFilter,
    toggleFilter: (id: string) => setActiveFilter((old) => (old === id ? null : id)),
    closeFilter:  () => setActiveFilter(null),
  };
}
