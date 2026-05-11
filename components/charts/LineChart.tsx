"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export default function LineChartCustom({ data, dataKey, xKey, color = "#a78bfa", height = 220 }: LineChartProps) {
  // Colores dinámicos:
  // Modo Claro: Gris oscuro (#4b5563 - slate-600)
  // Modo Oscuro: Blanco tenue (#e2e8f0 - slate-200)
  const axisColor = "var(--axis-line, currentColor)";
  const textColor = "var(--axis-text, #94a3b8)";

  return (
    <div className="w-full h-full text-slate-600 dark:text-slate-200">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
          <XAxis
            dataKey={xKey}
            // 'currentColor' tomará el color del texto del div padre (negro/gris en light, blanco en dark)
            axisLine={{ stroke: "currentColor", strokeWidth: 1, opacity: 0.5 }}
            tickLine={false}
            tick={{ fontSize: 12, fill: "currentColor", opacity: 0.8 }}
            dy={10}
          />
          <YAxis axisLine={{ stroke: "currentColor", strokeWidth: 1, opacity: 0.5 }} tickLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.8 }} dx={-5} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--tw-prose-invert, #fff)", // Opcional: fondo adaptativo
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              color: "#000",
            }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
