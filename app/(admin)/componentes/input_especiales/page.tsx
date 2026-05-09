"use client";

import React, { useState } from "react";
import { LogsIcon, Settings, Layers, Sliders, Tags, UploadCloud } from "lucide-react";
import TituloModulo from "@/components/ui/TituloModulo";

// Importación de componentes base
import { SpecialToggle } from "@/components/ui/SpecialToggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GlassSlider } from "@/components/ui/GlassSlider";
import { MultiTagInput } from "@/components/ui/MultiTagInput";
import { GlassDropzone } from "@/components/ui/GlassDropzone";

export default function Page() {
  // Estados para controlar los inputs
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState(50);
  const [categories, setCategories] = useState(["React", "Next.js", "Tailwind"]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFiles = (files: File[]) => {
    setUploadedFiles(files);
    console.log("Archivos recibidos:", files);
  };

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      <TituloModulo titulo="Inputs Especiales" variant="violet" icon={LogsIcon} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SECCIÓN: TOGGLES / SWITCHES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="text-violet-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Configuración</h2>
          </div>
          <SpecialToggle label="Modo Oscuro" description="Cambia el tema visual de la interfaz" checked={isDarkMode} onChange={setIsDarkMode} />
          <SpecialToggle label="Notificaciones" description="Recibir alertas de sistema" checked={notifications} onChange={setNotifications} />
        </section>

        {/* SECCIÓN: SEGMENTED CONTROL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-violet-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Vista de Módulo</h2>
          </div>
          <SegmentedControl
            options={[
              { label: "Cuadrícula", value: "grid" },
              { label: "Lista", value: "list" },
              { label: "Compacto", value: "compact" },
            ]}
            selectedValue={viewMode}
            onChange={setViewMode}
          />
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 text-center text-xs text-slate-400 italic">Seleccionado: {viewMode}</div>
        </section>

        {/* SECCIÓN: SLIDER */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="text-violet-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Rangos Dinámicos</h2>
          </div>
          <GlassSlider label="Presupuesto Mensual" min={0} max={100} step={5} value={priceRange} onChange={setPriceRange} unit="k" />
        </section>

        {/* SECCIÓN: MULTI-TAGS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Tags className="text-violet-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Taxonomía / Etiquetas</h2>
          </div>
          <MultiTagInput label="Categorías de Proyecto" placeholder="Escribe una tecnología..." tags={categories} setTags={setCategories} />
        </section>

        {/* SECCIÓN: DROPZONE */}
        <section className="space-y-4 md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <UploadCloud className="text-violet-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Gestión de Archivos</h2>
          </div>
          <GlassDropzone label="Documentación del Sistema" accept=".pdf,.png,.jpg" multiple={true} onFilesChange={handleFiles} />
        </section>
      </div>
    </div>
  );
}
