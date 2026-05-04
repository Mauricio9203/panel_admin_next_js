"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const iconBtn = "group w-10 h-10 flex items-center justify-center rounded-xl transition-all transform hover:scale-[1.05] active:scale-[0.96] text-violet-900 dark:text-violet-200 hover:bg-white/40 dark:hover:bg-white/10";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme(); // 👈 IMPORTANTE
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")} className={iconBtn}>
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
