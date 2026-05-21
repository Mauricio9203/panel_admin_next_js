"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type UseDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  onUpdate?: (rowIndex: number, columnId: string, value: any) => void;
};

export function useDataTable<TData>({ data, columns, pageSize = 10, onUpdate }: UseDataTableProps<TData>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row: any) => String(row.id),
    defaultColumn: {
      filterFn: "includesString",
    },
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Definimos meta para que las celdas puedan llamar a updateData
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        onUpdate?.(rowIndex, columnId, value);
      },
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

  const handlePageSizeChange = (size: number) => {
    setPagination((old) => ({ ...old, pageSize: size, pageIndex: 0 }));
  };

  return {
    table,
    pagination,
    handlePageSizeChange,
    activeFilter,
    setActiveFilter,
    toggleFilter: (id: string) => setActiveFilter((old) => (old === id ? null : id)),
    closeFilter: () => setActiveFilter(null),
  };
}
