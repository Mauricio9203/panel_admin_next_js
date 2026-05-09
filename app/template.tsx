// app/template.tsx
"use client";

import { usePathname } from "next/navigation";
import PageTransition from "@/components/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // Usar la key aquí es suficiente para que Next.js
    // reinicie la animación en cada subpágina.
    <PageTransition key={pathname}>{children}</PageTransition>
  );
}
