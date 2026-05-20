"use client";

import { flexRender, Table, RowData } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import { Inbox } from "lucide-react";
import { useState, useEffect } from "react";

/* --- Componente de Celda Editable --- */
const EditableCell = ({ value: initialValue, row, column, table }: any) => {
  const [value, setValue] = useState(initialValue);
  const meta = column.columnDef.meta;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const commit = (val: any) => {
    if (val !== initialValue) {
      table.options.meta?.updateData(row.index, column.id, val);
    }
  };

  if (meta?.type === "select") {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => {
          setValue(e.target.value);
          commit(e.target.value);
        }}
        className="w-full bg-transparent outline-none px-1 py-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-neutral-800 focus:ring-1 focus:ring-violet-500/40 transition-all text-[12px] cursor-pointer"
      >
        <option value="" disabled>Seleccionar...</option>
        {(meta.options as Record<string, any>[]).map((opt) => (
          <option key={opt[meta.valueKey]} value={opt[meta.valueKey]}>
            {opt[meta.labelKey]}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => commit(value)}
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
      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all shrink-0 ${checked ? "bg-violet-600 border-violet-600" : "bg-transparent border-neutral-300 dark:border-neutral-700"}`}
    >
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
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
            <td className="w-12 px-4 py-2 text-center align-middle" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center">
                <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
              </div>
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
