"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const data = [
  { name: "Ene", usuarios: 400, ventas: 240 },
  { name: "Feb", usuarios: 300, ventas: 139 },
  { name: "Mar", usuarios: 500, ventas: 380 },
  { name: "Abr", usuarios: 700, ventas: 520 },
  { name: "May", usuarios: 600, ventas: 410 },
];

export default function Page() {
  return (
    <div className="p-4 space-y-4 bg-white dark:bg-neutral-950 min-h-screen">
      {/* 🧠 Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-neutral-400">Resumen general</p>
      </div>

      {/* 🔢 Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card title="Usuarios" value="1,240" />
        <Card title="Ventas" value="$8,320" />
        <Card title="Conv." value="4.2%" />
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Línea */}
        <ChartCard title="Usuarios por mes">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="2 2" stroke="#525252" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="usuarios" stroke="#60a5fa" strokeWidth={2} dot={false} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Barras */}
        <ChartCard title="Ventas por mes">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="2 2" stroke="#525252" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="ventas" fill="#34d399" radius={[4, 4, 0, 0]} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* 🧩 Card animada */
function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="
        relative group
        bg-white dark:bg-neutral-900
        px-3 py-2 rounded-md
        border border-gray-200 dark:border-neutral-800
        shadow-sm dark:shadow-none
        dark:ring-1 dark:ring-white/5
        overflow-hidden

        transition-all duration-300 ease-out

        hover:-translate-y-1
        hover:shadow-md
        dark:hover:shadow-black/30
        hover:border-gray-300
        dark:hover:border-neutral-700
      "
    >
      {/* Glow sutil */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-emerald-500/0
          pointer-events-none
        "
      />

      <p className="text-[11px] text-gray-500 dark:text-neutral-400 relative z-10 transition-colors duration-300 group-hover:text-gray-600 dark:group-hover:text-neutral-300">{title}</p>

      <p className="text-lg font-semibold text-gray-900 dark:text-neutral-100 leading-tight relative z-10">{value}</p>
    </div>
  );
}

/* 📦 Chart wrapper */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-3 rounded-md border border-gray-200 dark:border-neutral-800 shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5">
      <h2 className="text-xs font-medium mb-2 text-gray-600 dark:text-neutral-300">{title}</h2>
      {children}
    </div>
  );
}
