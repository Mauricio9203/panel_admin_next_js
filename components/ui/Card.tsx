import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        h-full
        rounded-md
        p-5
        bg-white/80 dark:bg-zinc-800/70
        border border-violet-200 dark:border-zinc-700
        shadow-sm dark:shadow-none
        backdrop-blur
        transition-colors
        ${className}
      `}
    >
      {children}
    </div>
  );
}
