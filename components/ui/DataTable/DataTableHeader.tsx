"use client";

import { flexRender, Table, Header } from "@tanstack/react-table";
import { Search } from "lucide-react";
import DataTableFilter from "./DataTableFilter";

/* =========================
   CHECKBOX HEADER
========================= */
function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
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
      {!checked && indeterminate && <div className="w-2 h-0.5 bg-violet-500 rounded" />}
    </button>
  );
}

/* =========================
   TYPES
========================= */
type Props<TData> = {
  table: Table<TData>;
  activeFilter: string | null;
  setActiveFilter: (id: string | null) => void;
  hasRowActions?: boolean;
};

/* =========================
   COMPONENT
========================= */
export default function DataTableHeader<TData>({ table, activeFilter, setActiveFilter, hasRowActions }: Props<TData>) {
  return (
    <thead className="sticky top-0 z-10 bg-violet-500/5 dark:bg-violet-500/10 backdrop-blur">
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id} className="border-b border-violet-500/10">
          {/* =========================
              MASTER CHECKBOX
          ========================= */}
          <th className="px-2 py-2 w-10 whitespace-nowrap align-middle">
            <Checkbox checked={table.getIsAllRowsSelected()} indeterminate={table.getIsSomeRowsSelected()} onChange={() => table.toggleAllRowsSelected()} />
          </th>

          {/* =========================
              COLUMNS
          ========================= */}
          {hg.headers.map((header: Header<TData, unknown>) => (
            <th key={header.id} className="px-2 py-2 whitespace-nowrap align-middle">
              <div className="flex items-center justify-between gap-2">
                <div
                  onClick={header.column.getToggleSortingHandler()}
                  className="
                    text-violet-700 dark:text-violet-300
                    cursor-pointer select-none
                    whitespace-nowrap
                  "
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>

                {header.column.getCanFilter() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(activeFilter === header.id ? null : header.id);
                    }}
                    className="text-violet-400 hover:text-violet-600"
                  >
                    <Search size={13} />
                  </button>
                )}
              </div>

              {/* FILTER */}
              {activeFilter === header.id && <DataTableFilter value={(header.column.getFilterValue() as string) ?? ""} onChange={(val) => header.column.setFilterValue(val)} onClose={() => setActiveFilter(null)} />}
            </th>
          ))}

          {/* =========================
              ACTIONS COLUMN
          ========================= */}
          {hasRowActions && <th className="w-10 px-2 py-2 text-center whitespace-nowrap align-middle text-violet-700 dark:text-violet-300">Opciones</th>}
        </tr>
      ))}
    </thead>
  );
}
