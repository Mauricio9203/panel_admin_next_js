// app/dashboard/page.tsx
import { LucideAppWindow, CheckCircle2 } from "lucide-react";
import TituloModulo from "@/components/ui/TituloModulo";
import Grid from "@/components/ui/Grid";
import Card from "@/components/ui/Card";

// Función para simular retraso del servidor (Simula una DB lenta)
async function getDatos() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 segundos
  return { status: "Operativo", version: "2.4.0" };
}

export default async function Page() {
  // En el momento que ejecutamos 'await', Next.js muestra loading.tsx
  const datos = await getDatos();

  return (
    <div className="flex flex-col min-w-0 w-full p-4 md:p-6 space-y-6 animate-in fade-in duration-700">
      <TituloModulo titulo="Modales" variant="violet" icon={LucideAppWindow} />

      <div className="space-y-6">
        <Grid gap={4}>
          <Card md={6}>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Información</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              Esta página es un <b>Server Component</b>. El archivo <i>loading.tsx</i> se mostró automáticamente mientras la función <code>getDatos()</code> estaba en espera.
            </p>
          </Card>

          <Card md={6}>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Versión</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">Build v{datos.version} - Sincronizado con éxito.</p>
          </Card>
        </Grid>
      </div>
    </div>
  );
}
