"use client";

import React, { useState, useRef } from "react";
import { X, CloudUpload, File, Text, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassDropzoneProps {
  label?: string;
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const GlassDropzone = ({ label, onFilesChange, accept = "*", multiple = false, size = "md", className }: GlassDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mapeo de tamaños
  const sizeStyles = {
    sm: "p-4 gap-2",
    md: "p-8 gap-4",
    lg: "p-12 gap-6",
    xl: "p-20 gap-8",
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const handleFiles = (newFiles: File[]) => {
    let updatedFiles;
    if (multiple) {
      // Evitar duplicados por nombre
      const uniqueNewFiles = newFiles.filter((nf) => !files.some((f) => f.name === nf.name));
      updatedFiles = [...files, ...uniqueNewFiles];
    } else {
      updatedFiles = [newFiles[0]];
    }
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (name: string) => {
    const updatedFiles = files.filter((f) => f.name !== name);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <label className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1">{label}</label>}

      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer overflow-hidden rounded-[2rem]",
          sizeStyles[size],
          // Mejora de bordes en modo claro: slate-300 para que se note más
          isDragging ? "border-blue-500 bg-blue-500/10 backdrop-blur-xl" : "border-slate-300 dark:border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 shadow-sm",
        )}
      >
        <div className="p-4 rounded-full bg-blue-500/15 text-blue-500 shadow-inner">
          <CloudUpload size={iconSizes[size]} />
        </div>

        <div className="text-center z-10">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{multiple ? "Sube tus archivos" : "Sube un archivo"}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Arrastra o haz clic • {accept === "*" ? "Cualquier formato" : accept}</p>
        </div>

        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} accept={accept} multiple={multiple} className="hidden" />

        {/* Decoración Glass */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full" />
      </motion.div>

      {/* Lista de archivos seleccionados */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {files.map((file) => (
              <motion.div key={file.name} layout exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                    <Paperclip size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.name);
                  }}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-slate-400"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
