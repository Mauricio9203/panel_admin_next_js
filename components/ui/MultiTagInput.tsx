"use client";

import React, { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiTagInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  className?: string;
}

export const MultiTagInput = ({ label, placeholder = "Escribe y pulsa Enter...", tags, setTags, className }: MultiTagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner min-h-[56px] focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.span key={tag} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-lg shadow-blue-500/20">
              {tag}
              <button type="button" onClick={() => removeTag(index)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400 min-w-[120px] px-2"
        />
      </div>
    </div>
  );
};
