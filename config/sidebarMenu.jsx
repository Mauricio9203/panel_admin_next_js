import { LayoutDashboard, Folder, BarChart2 } from "lucide-react";

export const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "tablas",
    label: "Tablas",
    icon: Folder,
    children: [
      { key: "tablas/tabla_base", label: "Tabla Base" },
      { key: "tablas/tabla_supabase", label: "Tabla Supabase" },
    ],
  },
   // 🆕 NUEVO MÓDULO
  {
    key: "componentes",
    label: "Componentes",
    icon: BarChart2,
    children: [
      { key: "componentes/modales", label: "Modales" },
      { key: "componentes/botones", label: "Botones" },
      { key: "componentes/input", label: "Input" },
    ],
  },

];