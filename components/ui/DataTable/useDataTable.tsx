"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, ColumnDef } from "@tanstack/react-table";

import { useState } from "react";

type UseDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
};

export function useDataTable<TData>({ data, columns, pageSize = 5 }: UseDataTableProps<TData>) {
  /* =========================
     STATES
  ========================= */
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  /* =========================
     TABLE INSTANCE
  ========================= */
  const table = useReactTable({
    data,
    columns,

    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

    enableRowSelection: true,

    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  /* =========================
     HANDLERS
  ========================= */
  const handlePageSizeChange = (size: number) => {
    setPagination((old) => ({
      ...old,
      pageSize: size,
      pageIndex: 0,
    }));
  };

  const closeFilter = () => setActiveFilter(null);

  const toggleFilter = (id: string) => {
    setActiveFilter((old) => (old === id ? null : id));
  };

  /* =========================
     ESC SUPPORT (opcional pero recomendado)
  ========================= */
  const handleEscape = () => {
    setActiveFilter(null);
  };

  /* =========================
     RETURN
  ========================= */
  return {
    table,

    // pagination
    pagination,
    setPagination,
    handlePageSizeChange,

    // filters UI state
    activeFilter,
    setActiveFilter,
    toggleFilter,
    closeFilter,

    // helper
    handleEscape,
  };
}
