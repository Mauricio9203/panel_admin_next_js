import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-md
        p-5
        bg-white/80
        border border-violet-200
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
