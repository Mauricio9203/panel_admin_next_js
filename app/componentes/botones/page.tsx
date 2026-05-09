"use client";

import { LucideAppWindow, Save, Trash2, AlertTriangle, Info, CheckCircle, ArrowRight } from "lucide-react";
import TituloModulo from "@/components/ui/TituloModulo";
import Button from "@/components/ui/Button";

export default function Page() {
  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-8">
      {/* Cabecera del Módulo */}
      <TituloModulo titulo="Componentes: Botones" variant="violet" icon={LucideAppWindow} />

      {/* SECCIÓN 1: VARIANTES (Lógica Bootstrap) */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 ml-2">Variantes de Color</h3>
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">
              <Save className="w-4 h-4" />
              Primary (Violet)
            </Button>

            <Button variant="secondary">Secondary</Button>

            <Button variant="success">
              <CheckCircle className="w-4 h-4" />
              Success
            </Button>

            <Button variant="danger">
              <Trash2 className="w-4 h-4" />
              Danger
            </Button>

            <Button variant="warning">
              <AlertTriangle className="w-4 h-4" />
              Warning
            </Button>

            <Button variant="info">
              <Info className="w-4 h-4" />
              Info
            </Button>

            <Button variant="outline">Outline Mode</Button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: ESCALA DE TAMAÑOS */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 ml-2">Escala de Tamaños</h3>
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Button size="sm">Small (SM)</Button>
              <span className="text-[10px] uppercase font-bold text-slate-400">Acciones de tabla</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button size="md">Medium (MD)</Button>
              <span className="text-[10px] uppercase font-bold text-slate-400">Estándar</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button size="lg">Large (LG)</Button>
              <span className="text-[10px] uppercase font-bold text-slate-400">Formularios</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button size="xl" variant="primary">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
              <span className="text-[10px] uppercase font-bold text-slate-400">Hero / CTA (XL)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: ESTADOS ADICIONALES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 ml-2">Estados</h3>
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
          <div className="flex flex-wrap gap-4">
            <Button disabled>Deshabilitado</Button>

            <Button className="w-full sm:w-auto">Botón Full Width en Móvil</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
