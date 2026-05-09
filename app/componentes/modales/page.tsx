"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import TituloModulo from "@/components/ui/TituloModulo";
import Button from "@/components/ui/Button";
import { LucideAppWindow, FileText, Download, X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("md");

  const handleOpen = (size: ModalSize) => {
    setModalSize(size);
    setIsOpen(true);
  };

  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Modales" variant="violet" icon={LucideAppWindow} />

      <div className="max-w-5xl mx-auto w-full">
        {/* SECCIÓN DE ACTIVADORES */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
          <p className="text-sm text-slate-500 mb-6 ml-2 font-medium">Selecciona un tamaño para probar la respuesta del modal:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button variant="secondary" onClick={() => handleOpen("sm")} className="w-full">
              Aviso (SM)
            </Button>

            <Button variant="secondary" onClick={() => handleOpen("md")} className="w-full">
              Filtros (MD)
            </Button>

            <Button variant="secondary" onClick={() => handleOpen("lg")} className="w-full">
              Gráficos (LG)
            </Button>

            <Button variant="secondary" onClick={() => handleOpen("xl")} className="w-full">
              Data Table (XL)
            </Button>

            <Button variant="primary" onClick={() => handleOpen("full")} className="w-full">
              Dashboard Full
            </Button>
          </div>
        </div>
      </div>

      {/* IMPLEMENTACIÓN DEL MODAL */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} size={modalSize} title={`Vista de Reporte: ${modalSize.toUpperCase()}`}>
        <div className="space-y-6">
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-2xl">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-violet-600 shrink-0" />
              <p className="text-sm text-violet-800 dark:text-violet-300">
                Estás visualizando el modal en tamaño <strong>{modalSize}</strong>. El contenido interno respeta el scroll y los bordes redondeados gracias al
                <code>overflow-hidden</code> del contenedor padre.
              </p>
            </div>
          </div>

          {/* Contenido simulado con Skeleton UI */}
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-full bg-slate-100 dark:bg-slate-800/40 rounded-2xl animate-pulse border border-black/5 dark:border-white/5" />
            ))}
          </div>

          {/* ACCIONES DENTRO DEL MODAL (Usando tus botones) */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="secondary" size="md" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
              Cerrar
            </Button>

            <Button variant="primary" size="md" onClick={() => setIsOpen(false)}>
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
