"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconBtn = "group w-10 h-10 flex items-center justify-center rounded-xl transition-all transform hover:scale-[1.05] active:scale-[0.96] text-violet-900 dark:text-violet-200 hover:bg-white/40 dark:hover:bg-white/10 overflow-hidden relative";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")} className={iconBtn} aria-label="Toggle theme">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={isDark ? "moon" : "sun"} initial={{ y: 20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="flex items-center justify-center">
          {isDark ? <Moon size={18} className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" /> : <Sun size={18} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
