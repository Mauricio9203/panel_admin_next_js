"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}

export default function AreaChartCustom({ data, dataKey, xKey, color = "#a78bfa", height = 220 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
        <XAxis dataKey={xKey} hide />
        <YAxis hide />
        <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#color-${dataKey})`} strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
