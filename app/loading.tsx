"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 transition-colors">
      <div className="flex flex-col items-center gap-4">
        {/* 🌀 Spinner elegante */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        </div>

        {/* ✨ Texto */}
        <p className="text-sm text-gray-500 dark:text-neutral-400 animate-pulse">Cargando módulo...</p>
      </div>
    </div>
  );
}
