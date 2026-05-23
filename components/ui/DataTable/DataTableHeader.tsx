"use client";

import { flexRender, Table, Header } from "@tanstack/react-table";
import { useRef } from "react";
import { Search, Eraser } from "lucide-react";
import DataTableFilter from "./DataTableFilter";

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

function Checkbox({ checked, indeterminate, onChange }: CheckboxProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all shrink-0
        ${checked ? "bg-primary border-primary" : "bg-transparent border-border"}`}
    >
      {checked && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-[1px]" />}
      {!checked && indeterminate && <div className="w-2.5 h-0.5 bg-primary rounded-full" />}
    </button>
  );
}

type Props<TData> = {
  table: Table<TData>;
  activeFilter: string | null;
  setActiveFilter: (id: string | null) => void;
  hasRowActions?: boolean;
};

export default function DataTableHeader<TData>({ table, activeFilter, setActiveFilter, hasRowActions }: Props<TData>) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  return (
    <thead className="sticky top-0 z-[10] bg-card/95 backdrop-blur-md border-b border-border">
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} className="[&>th]:first:pl-4 [&>th]:last:pr-4">
          <th className="w-12 px-4 py-2 text-center align-middle">
            <div className="flex justify-center items-center">
              <Checkbox checked={table.getIsAllRowsSelected()} indeterminate={table.getIsSomeRowsSelected()} onChange={() => table.toggleAllRowsSelected()} />
            </div>
          </th>

          {hg.headers.map((header: Header<TData, unknown>, index) => {
            const isFiltered = !!header.column.getFilterValue();
            const columnName = typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.id;

            const isAtEnd = index >= hg.headers.length - 2;

            return (
              <th key={header.id} className="relative px-3 py-3 whitespace-nowrap align-middle text-left">
                <div className="flex items-center gap-1.5 group">
                  <div onClick={header.column.getToggleSortingHandler()} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight cursor-pointer select-none hover:text-primary transition-colors">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>

                  {header.column.getCanFilter() && (
                    <div className="flex items-center gap-1">
                      {/* Botón de Lupa */}
                      <button
                        ref={(el) => { buttonRefs.current[header.id] = el; }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFilter(activeFilter === header.id ? null : header.id);
                        }}
                        className={`p-1.5 rounded-lg transition-all
                          ${isFiltered ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/50" : activeFilter === header.id ? "bg-primary/10 text-primary" : "text-muted-foreground/60 hover:text-primary hover:bg-muted"}`}
                      >
                        <Search size={12} strokeWidth={isFiltered ? 3 : 2} />
                      </button>

                      {/* Botón de Goma (Solo si hay filtro activo) */}
                      {isFiltered && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            header.column.setFilterValue(undefined);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all animate-in fade-in zoom-in duration-200"
                          title="Limpiar filtro"
                        >
                          <Eraser size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {activeFilter === header.id && <DataTableFilter value={(header.column.getFilterValue() as string) ?? ""} columnName={columnName} anchorEl={buttonRefs.current[header.id]} onChange={(val: string) => header.column.setFilterValue(val || undefined)} onClose={() => setActiveFilter(null)} />}
              </th>
            );
          })}

          {hasRowActions && <th className="w-20 px-2 py-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-tight text-right pr-6">Acciones</th>}
        </tr>
      ))}
    </thead>
  );
}
