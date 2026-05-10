"use client";

import { LucideAppWindow } from "lucide-react";
import TituloModulo from "@/components/ui/TituloModulo";
import SubtituloModulo from "@/components/ui/SubModulo";
import Card from "@/components/ui/Card";
import Grid from "@/components/ui/Grid";

export default function Page() {
  return (
    <div className="min-w-0 w-full p-4 md:p-6 space-y-6">
      {/* Encabezado del Módulo */}
      <TituloModulo titulo="Sub Módulo Base" variant="violet" icon={LucideAppWindow} />

      {/* Uso del nuevo componente Grid con variables clave */}
      <Grid cols={12} gap={4}>
        <Card md={3} className="flex items-center">
          <p className="text-sm text-slate-500 dark:text-zinc-400">Este es un sub módulo base. Puedes personalizar este contenido conforme sea necesario.</p>
        </Card>

        <Card md={3} className="flex items-center">
          <p className="text-sm text-slate-500 dark:text-zinc-400">Segunda tarjeta de ejemplo compartiendo la misma fila mediante el sistema de 12 columnas.</p>
        </Card>

        <Card md={3} className="flex items-center italic border-dashed">
          <p className="text-sm text-slate-400">Espacio disponible para métricas o acciones rápidas.</p>
        </Card>
      </Grid>

      <SubtituloModulo titulo="Subtítulo del Sub Módulo" descripcion="Descripción adicional para este subtítulo específico." variant="violet" icon={LucideAppWindow} />
      <Grid cols={12} gap={4}>
        <Card md={12} className="flex items-center">
          <p className="text-sm text-slate-500 dark:text-zinc-400">Otra fila de contenido que también se adapta al sistema de 12 columnas.</p>
        </Card>
      </Grid>
    </div>
  );
}
