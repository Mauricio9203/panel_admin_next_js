"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

export default function DataTableFilter({ value, onChange, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1">
      <div
        className="
          relative
          w-[180px]
          rounded-lg
          border border-violet-500/20
          bg-white dark:bg-neutral-900
          shadow-xl
          px-2 py-1
        "
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filtrar..."
          className="
            w-full text-[11px]
            bg-transparent
            outline-none
            pr-5
          "
        />

        <button
          onClick={onClose}
          className="
            absolute right-1 top-1/2 -translate-y-1/2
            text-neutral-400 hover:text-red-500
            transition
          "
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
