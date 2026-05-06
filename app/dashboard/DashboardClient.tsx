"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ComposedChart } from "recharts";

import Card from "@/components/ui/Card";
import ChartCard from "./ChartCard";

type Props = {
  data: {
    name: string;
    usuarios: number;
    ventas: number;
  }[];
  pieData: {
    name: string;
    value: number;
  }[];
};

export default function DashboardClient({ data, pieData }: Props) {
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-white dark:bg-zinc-900 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-lg sm:text-xl font-semibold text-violet-900 dark:text-violet-300">Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Resumen general</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-gray-500">Usuarios</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold truncate">1,240</p>
        </Card>

        <Card>
          <p className="text-xs text-gray-500">Ventas</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold truncate">$8,320</p>
        </Card>

        <Card>
          <p className="text-xs text-gray-500">Conversión</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold truncate">4.2%</p>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* LINE */}
        <ChartCard title="Usuarios por mes">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Line dataKey="usuarios" stroke="#a78bfa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR */}
        <ChartCard title="Ventas por mes">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Bar dataKey="ventas" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* AREA */}
        <ChartCard title="Tendencia usuarios">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Area dataKey="usuarios" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PIE */}
        <ChartCard title="Distribución">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={60}>
                <Cell fill="#a78bfa" />
                <Cell fill="#34d399" />
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* COMPOSED */}
        <ChartCard title="Usuarios vs Ventas">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Bar dataKey="ventas" fill="#34d399" />
              <Line dataKey="usuarios" stroke="#a78bfa" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
