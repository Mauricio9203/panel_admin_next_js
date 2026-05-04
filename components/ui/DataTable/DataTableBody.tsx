"use client";

import { flexRender, Table, RowData } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";

/* =========================
   CHECKBOX
========================= */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`
        w-4 h-4 rounded
        border border-violet-500/30
        flex items-center justify-center
        transition
        hover:border-violet-500/60
        ${checked ? "bg-violet-500 border-violet-500" : ""}
      `}
    >
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-[2px]" />}
    </button>
  );
}

/* =========================
   TYPES
========================= */
type RowAction<TData> = {
  label: string;
  onClick: (row: TData) => void;
  variant?: "default" | "danger";
};

type Props<TData extends RowData> = {
  table: Table<TData>;
  loading?: boolean;
  rowActions?: (row: TData) => RowAction<TData>[];
  onRowClick?: (row: TData) => void;
};

/* =========================
   COMPONENT
========================= */
export default function DataTableBody<TData extends RowData>({ table, loading = false, rowActions, onRowClick }: Props<TData>) {
  const rows = table.getPaginationRowModel().rows;

  return (
    <tbody>
      {!loading &&
        rows.map((row) => (
          <tr
            key={row.id}
            className="
              border-t border-violet-500/10
              hover:bg-violet-500/5
              cursor-pointer
            "
            onClick={() => onRowClick?.(row.original)}
          >
            {/* =========================
                CHECKBOX COLUMN
            ========================= */}
            <td className="px-2 py-2 w-10 whitespace-nowrap">
              <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
            </td>

            {/* =========================
                DATA CELLS
            ========================= */}
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="
                  px-2 py-2
                  text-neutral-700 dark:text-neutral-300
                  whitespace-nowrap
                "
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}

            {/* =========================
                ACTIONS COLUMN
            ========================= */}
            {rowActions && (
              <td className="px-2 py-0 w-10 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <DataTableRowActions actions={rowActions(row.original)} row={row.original} />
              </td>
            )}
          </tr>
        ))}
    </tbody>
  );
}
