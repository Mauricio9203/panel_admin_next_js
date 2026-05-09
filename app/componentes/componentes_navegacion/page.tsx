"use client";

import React, { useState } from "react";
import { LucideAppWindow, Layers, GitCommitVertical, MapPin, ListTree, User, Settings, Bell, Mail, HelpCircle } from "lucide-react";

import TituloModulo from "@/components/ui/TituloModulo";

// Importación de los nuevos componentes de navegación
import { GlassTabs } from "@/components/ui/GlassTabs";
import { GlassAccordion } from "@/components/ui/GlassAccordion";
import { GlassStepper } from "@/components/ui/GlassStepper";
import { GlassBreadcrumbs } from "@/components/ui/GlassBreadcrumbs";

export default function Page() {
  // Estados para el muestrario
  const [activeTab, setActiveTab] = useState("perfil");
  const [currentStep, setCurrentStep] = useState(1);

  // Datos de ejemplo para Breadcrumbs
  const breadcrumbItems = [{ label: "Dashboard", icon: LucideAppWindow, href: "#" }, { label: "Configuración", icon: Settings, href: "#" }, { label: "Navegación Dinámica" }];

  // Datos de ejemplo para Tabs
  const tabOptions = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "mensajes", label: "Mensajes", icon: Mail },
    { id: "ajustes", label: "Ajustes", icon: Bell },
  ];

  // Datos de ejemplo para Accordion
  const accordionItems = [
    {
      id: "1",
      title: "¿Cómo funciona el Glassmorphism?",
      content: "Utiliza fondos semi-transparentes con desenfoque (backdrop-blur) y bordes claros para simular una lámina de vidrio flotando sobre la interfaz.",
    },
    {
      id: "2",
      title: "Optimización para Tablets",
      content: "Todos estos componentes han sido diseñados con áreas de contacto amplias, ideales para pantallas de 11 pulgadas, facilitando la navegación sin precisión milimétrica.",
    },
    {
      id: "3",
      title: "Seguridad y Rendimiento",
      content: "Al usar Framer Motion, las animaciones son ejecutadas por la GPU, lo que garantiza una fluidez constante de 60fps incluso en dispositivos portátiles.",
    },
  ];

  // Datos de ejemplo para Stepper
  const stepperSteps = ["Registro", "Verificación", "Configuración", "Finalizar"];

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Cabecera del Módulo */}
      <TituloModulo titulo="Componentes de Navegación" variant="violet" icon={LucideAppWindow} />

      {/* 1. SECCIÓN FULL WIDTH: BREADCRUMBS (Jerarquía) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 ml-1">
          <MapPin className="text-violet-500" size={16} />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ubicación en el Sistema</h2>
        </div>
        <GlassBreadcrumbs items={breadcrumbItems} />
      </section>

      {/* 2. SECCIÓN FULL WIDTH: STEPPER (Procesos) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center gap-2">
            <GitCommitVertical className="text-violet-500" size={16} />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Progreso del Flujo</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} className="text-[10px] bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Anterior
            </button>
            <button onClick={() => setCurrentStep(Math.min(stepperSteps.length - 1, currentStep + 1))} className="text-[10px] bg-violet-500 text-white px-3 py-1 rounded-full shadow-lg shadow-violet-500/20">
              Siguiente
            </button>
          </div>
        </div>
        <GlassStepper steps={stepperSteps} currentStep={currentStep} />
      </section>

      {/* 3. COLUMNAS: TABS Y ACCORDION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado Izquierdo: Tabs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <Layers className="text-violet-500" size={16} />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Organización por Contexto</h2>
          </div>
          <GlassTabs options={tabOptions} activeTab={activeTab} onChange={setActiveTab} variant="violet" />
          <div className="h-48 flex items-center justify-center rounded-[2rem] bg-white/20 dark:bg-white/5 border border-white/10 backdrop-blur-sm border-dashed">
            <span className="text-sm text-slate-400 font-medium">
              Mostrando contenido de: <b className="text-violet-500 uppercase">{activeTab}</b>
            </span>
          </div>
        </section>

        {/* Lado Derecho: Accordion */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <ListTree className="text-violet-500" size={16} />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Preguntas y Detalles</h2>
          </div>
          <GlassAccordion items={accordionItems} />
          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-3">
            <HelpCircle className="text-violet-500 shrink-0" size={18} />
            <p className="text-[11px] text-violet-700 dark:text-violet-300 leading-relaxed">Utiliza acordeones para ocultar información técnica densa que el usuario no necesita ver de inmediato.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
