"use client";

import { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
};

export default function Grid({ children, cols = 12, gap = 4, className = "" }: GridProps) {
  // Mapeo de columnas para asegurar que Tailwind compile las clases
  const colVariants = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    8: "grid-cols-8",
    10: "grid-cols-10",
    12: "grid-cols-12",
  };

  // Mapeo de gaps
  const gapVariants = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  return (
    <div
      className={`
      grid 
      w-full 
      ${colVariants[cols]} 
      ${gapVariants[gap]} 
      ${className}
    `}
    >
      {children}
    </div>
  );
}
