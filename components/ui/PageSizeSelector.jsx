export default function PageSizeSelector({
  value,
  onChange,
  options = [10, 20, 50, 100],
}) {
  return (
    <div className="flex items-center gap-2">
 
      <div className="flex items-center rounded-md border border-violet-500/20 bg-white dark:bg-neutral-900 overflow-hidden">
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
                border-violet-500/10
                hover:bg-violet-500/10
                ${
                  active
                    ? "bg-violet-500 text-white"
                    : "text-neutral-500 dark:text-neutral-300"
                }
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