"use client";

import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import { MapPin } from "lucide-react";

// Importación dinámica: SSR deshabilitado para este componente
const MultiMapView = dynamic(() => import("@/components/maps/MultiMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] md:h-[400px] w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cargando Mapa...</span>
    </div>
  ),
});

export default function MapsPage() {
  const puntos = [{ id: 1, norte: 6227149, este: 341757, label: "Punto de Prueba" }];

  return (
    <div className="p-6">
      <Card className="!p-0 overflow-hidden border-violet-500/20 shadow-xl max-w-4xl">
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-2 bg-white/50 dark:bg-black/20">
          <MapPin className="w-4 h-4 text-violet-600" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-200">Mapa de Catastro</h3>
        </div>

        {/* El componente dinámico ahora funcionará sin errores */}
        <MultiMapView puntos={puntos} />
      </Card>
    </div>
  );
}
