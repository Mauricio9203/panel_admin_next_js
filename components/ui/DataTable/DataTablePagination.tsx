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
};

export default function DataTablePagination({ pageIndex, pageCount, pageSize, onPageSizeChange, canPrevious, canNext, onPrevious, onNext }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-[11px] border-t border-violet-500/10">
      {/* INFO PAGINACIÓN */}
      <div className="text-neutral-500">
        {pageIndex + 1} / {pageCount}
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-2">
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} options={[10, 20, 50, 100]} />

        <button onClick={onPrevious} disabled={!canPrevious} className="w-8 h-8 rounded-md border border-violet-500/20">
          ‹
        </button>

        <button onClick={onNext} disabled={!canNext} className="w-8 h-8 rounded-md border border-violet-500/20">
          ›
        </button>
      </div>
    </div>
  );
}
