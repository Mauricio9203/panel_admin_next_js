import { LayoutDashboard, Table2, Box } from "lucide-react";

export const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
    {
    key: "modulo_base",
    label: "Módulo Base",
    icon: Box,
    children: [
      { key: "modulo_base/sub_modulo_base", label: "Sub módulo Base" },
      { key: "modulo_base/cargando_modulo", label: "Ejemplo de Carga de Modulo" },
    ],
  },
  {
    key: "tablas",
    label: "Tablas",
    icon: Table2,
    children: [
      { key: "tablas/tabla_base", label: "Tabla Base" },
      { key: "tablas/tabla_supabase", label: "Tabla Supabase" },
    ],
  },
  {
    key: "componentes",
    label: "Componentes",
    icon: Box,
    children: [
      { key: "componentes/modales", label: "Modales" },
      { key: "componentes/botones", label: "Botones" },
      { key: "componentes/input", label: "Input" },
      { key: "componentes/input_especiales", label: "Input Especiales" },
      { key: "componentes/componentes_navegacion", label: "Componentes de Navegación" },
    ],
  },

];