"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as "light" | "dark" | "system"}
      richColors
      closeButton
      position="bottom-right" // Opcional: donde prefieras que aparezca
    />
  );
}
