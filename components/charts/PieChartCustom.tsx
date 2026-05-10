"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
}

export default function PieChartCustom({ data, colors = ["#a78bfa", "#34d399", "#fbbf24"], height = 220 }: PieChartProps) {
  // Inyectamos el color en el objeto de datos como aprendimos antes
  const coloredData = data.map((entry, index) => ({
    ...entry,
    fill: colors[index % colors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={coloredData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5} stroke="none" />
        <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
