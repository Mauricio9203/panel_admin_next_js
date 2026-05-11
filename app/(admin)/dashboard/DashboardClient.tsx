"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard } from "lucide-react";

// UI Components
import { CreditCard, Percent, Users } from "lucide-react";
import ChartCard from "@/components/ChartCard";
import TituloModulo from "@/components/ui/TituloModulo";
import Grid from "@/components/ui/Grid";
import StatCard from "@/components/ui/StatCard";

// Gráficos Modulares (Asegúrate de que las rutas sean correctas)
import AreaChartCustom from "@/components/charts/AreaChartCustom";
import BarChartCustom from "@/components/charts/BarChartCustom";
import PieChartCustom from "@/components/charts/PieChartCustom";
import LineChartCustom from "@/components/charts/LineChart";

type Props = {
  data: { name: string; usuarios: number; ventas: number }[];
  pieData: { name: string; value: number }[];
};

export default function DashboardClient({ data, pieData }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-transparent min-h-screen">
      <TituloModulo titulo="Dashboard" variant="violet" icon={LayoutDashboard} />

      {/* MÉTRICAS */}
      {/* SECCIÓN DE MÉTRICAS */}
      <Grid cols={12} gap={4}>
        {/* Usuario (que ya teníamos) */}
        <StatCard
          title="Usuarios"
          value="1,240"
          icon={Users} // Asumiendo que importaste Users de lucide-react
          color="violet"
          md={4}
        />

        {/* Ventas - Adaptada */}
        <StatCard
          title="Ventas"
          value="$8,320"
          icon={CreditCard} // Ícono sugerido para transacciones
          color="emerald"
          md={4}
          trend={{ value: "8.1%", isUp: true }} // Opcional: puedes quitarlo si no tienes el dato
        />

        {/* Conversión - Adaptada */}
        <StatCard
          title="Conversión"
          value="4.2%"
          icon={Percent} // Ícono sugerido para porcentajes
          color="amber"
          md={4}
          description="Tasa de cierre" // Opcional: una pequeña aclaración
        />
      </Grid>

      {/* SECCIÓN DE GRÁFICOS MODULARIZADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ChartCard title="Usuarios por mes">
          <AreaChartCustom data={data} dataKey="usuarios" xKey="name" color="#a78bfa" />
        </ChartCard>

        <ChartCard title="Ventas por mes">
          <BarChartCustom data={data} dataKey="ventas" xKey="name" color="#34d399" />
        </ChartCard>

        <ChartCard title="Tendencia de Tráfico">
          <AreaChartCustom data={data} dataKey="usuarios" xKey="name" color="#a78bfa" />
        </ChartCard>

        <ChartCard title="Distribución">
          <PieChartCustom data={pieData} colors={["#a78bfa", "#34d399"]} />
        </ChartCard>

        <ChartCard title="Línea">
          <LineChartCustom data={data} dataKey="usuarios" xKey="name" color="#a78bfa" />
        </ChartCard>

        <ChartCard title="Rendimiento Combinado">
          {/* Si no creaste el ComposedChartCustom, puedes usar el BarChartCustom 
              o crear uno similar para mantener la estética */}
          <BarChartCustom data={data} dataKey="ventas" xKey="name" color="#34d399" />
        </ChartCard>
      </div>
    </div>
  );
}
