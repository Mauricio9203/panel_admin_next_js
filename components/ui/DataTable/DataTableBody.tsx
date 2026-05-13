"use client";

import { flexRender, Table, RowData } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import { Inbox } from "lucide-react";
import { useState, useEffect } from "react";

/* --- Componente de Celda Editable --- */
const EditableCell = ({ value: initialValue, row, column, table }: any) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id, value);
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      className="w-full bg-transparent outline-none px-1 py-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-neutral-800 focus:ring-1 focus:ring-violet-500/40 transition-all text-[12px] truncate"
    />
  );
};

/* --- Checkbox minimalista --- */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-3.5 h-3.5 rounded-[3px] border border-violet-500/30 flex items-center justify-center transition-all ${checked ? "bg-violet-500 border-violet-500" : "bg-transparent"}`}
    >
      {checked && <div className="w-1 h-1 bg-white rounded-full" />}
    </button>
  );
}

export default function DataTableBody<TData extends RowData>({ table, loading = false, rowActions, onRowClick }: any) {
  const rows = table.getPaginationRowModel().rows;
  const totalColumns = table.getAllColumns().length + (rowActions ? 1 : 0) + 1;

  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={totalColumns} className="py-10 text-center text-xs text-neutral-500">
            Cargando...
          </td>
        </tr>
      ) : rows.length === 0 ? (
        <tr>
          <td colSpan={totalColumns} className="py-12 text-center text-xs text-neutral-500">
            <Inbox className="mx-auto mb-2 w-5 h-5 opacity-50" />
            Sin resultados
          </td>
        </tr>
      ) : (
        rows.map((row: any) => (
          <tr key={row.id} className="border-t border-neutral-100 dark:border-neutral-800/50 hover:bg-violet-500/[0.02] cursor-pointer group" onClick={() => onRowClick?.(row.original)}>
            <td className="px-2 py-1 w-8 text-center" onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
            </td>

            {row.getVisibleCells().map((cell: any) => {
              const isEditable = cell.column.columnDef.meta?.editable;
              return (
                <td key={cell.id} className="px-1 py-1 text-neutral-600 dark:text-neutral-400 text-[12px]" onClick={(e) => isEditable && e.stopPropagation()}>
                  {isEditable ? <EditableCell value={cell.getValue()} row={row} column={cell.column} table={table} /> : <div className="px-1 py-0.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>}
                </td>
              );
            })}

            {rowActions && (
              <td className="px-2 py-0 w-8 text-right" onClick={(e) => e.stopPropagation()}>
                <DataTableRowActions actions={rowActions(row.original)} row={row.original} />
              </td>
            )}
          </tr>
        ))
      )}
    </tbody>
  );
}
