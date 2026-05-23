"use client";

import { flexRender, Table, RowData } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import InlineCellSelect from "./InlineCellSelect";
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
    /* Opciones normalizadas a { value, label } para ambos renders */
    const opts = (meta.options as Record<string, any>[]).map((opt) => ({
      value: String(opt[meta.valueKey]),
      label: String(opt[meta.labelKey]),
    }));

    /* ── searchable: true → dropdown con búsqueda + portal ── */
    if (meta?.searchable) {
      return (
        <InlineCellSelect
          value={String(value ?? "")}
          options={opts}
          onChange={(val) => { setValue(val); commit(val); }}
        />
      );
    }

    /* ── searchable: false (default) → <select> nativo ── */
    return (
      <select
        value={value ?? ""}
        onChange={(e) => { setValue(e.target.value); commit(e.target.value); }}
        className="w-full bg-transparent outline-none px-1 py-0.5 rounded-sm hover:bg-foreground/5 focus:bg-card focus:ring-1 focus:ring-primary/40 transition-all text-[12px] cursor-pointer"
      >
        <option value="" disabled>Seleccionar...</option>
        {opts.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
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
      className="w-full bg-transparent outline-none px-1 py-0.5 rounded-sm hover:bg-foreground/5 focus:bg-card focus:ring-1 focus:ring-primary/40 transition-all text-[12px] truncate"
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
      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all shrink-0 ${checked ? "bg-primary border-primary" : "bg-transparent border-border"}`}
    >
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
    </button>
  );
}

// Anchos deterministas para las celdas skeleton (evita Math.random en render)
const SKELETON_WIDTHS = ["72%", "45%", "60%", "55%", "78%", "40%", "65%", "50%"];

export default function DataTableBody<TData extends RowData>({ table, loading = false, rowActions, onRowClick }: any) {
  const rows = table.getPaginationRowModel().rows;
  const visibleCols = table.getVisibleLeafColumns();
  const totalColumns = visibleCols.length + (rowActions ? 1 : 0) + 1; // +1 checkbox

  return (
    <tbody>
      {loading ? (
        // Skeleton: imita la estructura real de la tabla mientras carga
        Array.from({ length: 8 }).map((_, i) => (
          <tr key={i} className="border-t border-border/60">
            {/* Checkbox */}
            <td className="w-12 px-4 py-2">
              <div className="w-4 h-4 rounded-[3px] bg-muted animate-pulse mx-auto" />
            </td>
            {/* Celdas de datos */}
            {visibleCols.map((_col: any, j: number) => (
              <td key={j} className="px-3 py-2.5">
                <div
                  className="h-3 rounded-full bg-muted animate-pulse"
                  style={{ width: SKELETON_WIDTHS[j % SKELETON_WIDTHS.length] }}
                />
              </td>
            ))}
            {/* Columna de acciones */}
            {rowActions && (
              <td className="px-2 py-0 w-8">
                <div className="w-5 h-5 rounded-md bg-muted animate-pulse mx-auto" />
              </td>
            )}
          </tr>
        ))
      ) : rows.length === 0 ? (
        <tr>
          <td colSpan={totalColumns} className="py-12 text-center text-xs text-muted-foreground">
            <Inbox className="mx-auto mb-2 w-5 h-5 opacity-50" />
            Sin resultados
          </td>
        </tr>
      ) : (
        rows.map((row: any) => (
          <tr key={row.id} className="border-t border-border/60 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => onRowClick?.(row.original)}>
            <td className="w-12 px-4 py-2 text-center align-middle" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center">
                <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
              </div>
            </td>

            {row.getVisibleCells().map((cell: any) => {
              const isEditable = cell.column.columnDef.meta?.editable;
              return (
                <td key={cell.id} className="px-1 py-1 text-muted-foreground text-[12px]" onClick={(e) => isEditable && e.stopPropagation()}>
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
