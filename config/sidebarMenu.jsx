import { LayoutDashboard, Folder, BarChart2 } from "lucide-react";

export const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "documentos",
    label: "Documentos",
    icon: Folder,
    children: [
      { key: "documentos/todos", label: "Todos" },
      { key: "documentos/crear", label: "Crear" },
    ],
  },
   // 🆕 NUEVO MÓDULO
  {
    key: "reportes",
    label: "Reportes",
    icon: BarChart2,
    children: [
      { key: "reportes/lista", label: "Lista" },
      { key: "reportes/estadisticas", label: "Estadísticas" },
    ],
  },

];