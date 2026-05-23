"use client";

import PageSizeSelector from "./PageSizeSelector";

type Props = {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Total de registros en la BD (disponible en modo server-side). */
  totalCount?: number;
};

export default function DataTablePagination({ pageIndex, pageCount, pageSize, onPageSizeChange, canPrevious, canNext, onPrevious, onNext, totalCount }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-[11px] border-t border-primary/10">
      {/* INFO PAGINACIÓN */}
      <div className="text-muted-foreground flex items-center gap-1.5">
        <span>Pág. {pageIndex + 1} / {pageCount}</span>
        {totalCount !== undefined && (
          <span className="text-muted-foreground/60">
            · {totalCount.toLocaleString()} registros
          </span>
        )}
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-2">
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} options={[10, 20, 50, 100]} />

        <button onClick={onPrevious} disabled={!canPrevious} className="w-8 h-8 rounded-md border border-primary/20 text-muted-foreground hover:bg-primary/10 disabled:opacity-40 transition">
          ‹
        </button>

        <button onClick={onNext} disabled={!canNext} className="w-8 h-8 rounded-md border border-primary/20 text-muted-foreground hover:bg-primary/10 disabled:opacity-40 transition">
          ›
        </button>
      </div>
    </div>
  );
}
