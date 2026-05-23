import React from "react";

type PageSizeSelectorProps = {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
};

export default function PageSizeSelector({ value, onChange, options = [10, 20, 50, 100] }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border border-primary/20 bg-card overflow-hidden">
        {options.map((size) => {
          const active = value === size;

          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={`
                px-3 py-1 text-[11px]
                transition
                border-r last:border-r-0
                border-primary/10
                hover:bg-primary/10
                ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
