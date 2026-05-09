"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const GlassAccordion = ({ items }: { items: AccordionItem[] }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2 w-full">
      {items.map((item) => (
        <div key={item.id} className="overflow-hidden rounded-2xl border border-white/20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/20">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
            <motion.div animate={{ rotate: openId === item.id ? 180 : 0 }}>
              <ChevronDown size={18} className="text-slate-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
