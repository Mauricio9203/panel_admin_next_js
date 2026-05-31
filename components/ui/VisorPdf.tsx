"use client";

import Modal from "@/components/ui/Modal";
import { Download, ExternalLink } from "lucide-react";

interface VisorPdfModalProps {
  url: string | null;
  onClose: () => void;
}

export function VisorPdfModal({ url, onClose }: VisorPdfModalProps) {
  if (!url) return null;

  // Extraemos el nombre del archivo de la URL para mostrarlo en el título
  const nombreArchivo = decodeURIComponent(url.split("/").pop() || "Documento PDF");

  return (
    <Modal
      open={!!url}
      onClose={onClose}
      title={`Visor: ${nombreArchivo}`}
      size="xl" // Usamos tamaño extra largo para una lectura cómoda del documento
    >
      <div className="flex flex-col h-[75vh] w-full bg-background border border-border rounded-[--radius] overflow-hidden">
        {/* Barra de utilidades del visor */}
        <div className="flex items-center justify-end gap-2 p-2 bg-muted/50 border-b border-border">
          <a
            href={url}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card hover:bg-accent border border-border rounded-md transition-colors"
          >
            <Download size={14} />
            Descargar
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:opacity-90 rounded-md transition-colors"
          >
            <ExternalLink size={14} />
            Original
          </a>
        </div>

        {/* Incrustación del PDF */}
        <div className="flex-1 w-full h-full bg-muted">
          <iframe
            src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-none"
            title={nombreArchivo}
          />
        </div>
      </div>
    </Modal>
  );
}