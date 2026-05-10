import { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div
      className="
        h-72
        w-full
        flex
        flex-col
        rounded-md
        p-5
        bg-white/80 dark:bg-zinc-800/70
        border border-violet-200 dark:border-zinc-700
        shadow-sm dark:shadow-none
        backdrop-blur
        transition-colors
      "
    >
      {/* Header */}
      <p className="text-xs mb-2 text-gray-500">{title}</p>

      {/* Chart container (CLAVE) */}
      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
}
