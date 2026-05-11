import { LayoutDashboard } from "lucide-react";
import Grid from "@/components/ui/Grid";

export default function LoadingDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-transparent min-h-screen">
      {/* TÍTULO SKELETON */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-xl" />
        <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-md" />
      </div>

      {/* MÉTRICAS SKELETON (StatCards) */}
      <Grid cols={12} gap={4}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-span-12 md:col-span-4 h-32 bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-sm animate-pulse p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded" />
                <div className="h-8 w-24 bg-gray-300 dark:bg-white/20 rounded" />
              </div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-lg" />
            </div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-white/10 rounded" />
          </div>
        ))}
      </Grid>

      {/* GRÁFICOS SKELETON (ChartCards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[300px] bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-sm p-4 space-y-4 animate-pulse">
            {/* Título del gráfico */}
            <div className="h-4 w-40 bg-gray-200 dark:bg-white/10 rounded" />

            {/* Cuerpo del gráfico (simulando líneas o barras) */}
            <div className="flex items-end gap-2 h-48 w-full pt-4">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="flex-1 bg-gray-200 dark:bg-white/10 rounded-t" style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} />
              ))}
            </div>

            {/* Eje X simulado */}
            <div className="flex justify-between pt-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-2 w-8 bg-gray-100 dark:bg-white/5 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
