import { FileText } from "lucide-react";
import TituloModulo from "@/components/ui/TituloModulo";
import DocumentosClient from "./DocumentosClient";

export default function Page() {
  return (
    <div className="grid grid-cols-1 min-w-0 w-full p-4 md:p-6 space-y-4 font-sans">
      {/* El encabezado es estático, se renderiza en el servidor */}
      <TituloModulo titulo="Gestión de Archivos" variant="violet" icon={FileText} />

      {/* Contenedor de la tabla */}
      <div className="w-full min-w-0 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <DocumentosClient />
      </div>
    </div>
  );
}
