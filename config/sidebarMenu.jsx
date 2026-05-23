import { LayoutDashboard, Table2, Box, ServerIcon, Users, History } from "lucide-react";

export const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "viewer"],
  },
  {
    key:   "usuarios",
    label: "Usuarios",
    icon:  Users,
    roles: ["admin"],
  },
  {
    key:   "auditoria",
    label: "Auditoría",
    icon:  History,
    roles: ["admin"],
  },
  {
    key: "modulo_base",
    label: "Módulo Base",
    icon: Box,
    roles: ["admin", "manager"],
    children: [
      { key: "modulo_base/sub_modulo_base", label: "Sub módulo Base",            roles: ["admin", "manager"] },
      { key: "modulo_base/cargando_modulo", label: "Ejemplo de Carga de Modulo", roles: ["admin"] },
    ],
  },
  {
    key: "maps",
    label: "Multi Mapas",
    icon: Box,
    roles: ["admin", "manager", "viewer"],
    children: [
      { key: "maps/multi_maps", label: "Multi Mapas", roles: ["admin", "manager", "viewer"] },
    ],
  },
  {
    key: "tablas",
    label: "Tablas",
    icon: Table2,
    roles: ["admin", "manager", "viewer"],
    children: [
      { key: "tablas/tabla_base",     label: "Tabla Base",               roles: ["admin", "manager", "viewer"] },
      { key: "tablas/tabla_supabase", label: "Tabla Supabase (Cliente)", roles: ["admin", "manager", "viewer"] },
      { key: "tablas/tabla_server",   label: "Tabla Server-Side",        roles: ["admin"], icon: ServerIcon },
    ],
  },
  {
    key: "componentes",
    label: "Componentes",
    icon: Box,
    roles: ["admin"],
    children: [
      { key: "componentes/modales",                label: "Modales",                   roles: ["admin"] },
      { key: "componentes/botones",                label: "Botones",                   roles: ["admin"] },
      { key: "componentes/input",                  label: "Input",                     roles: ["admin"] },
      { key: "componentes/input_especiales",       label: "Input Especiales",          roles: ["admin"] },
      { key: "componentes/componentes_navegacion", label: "Componentes de Navegación", roles: ["admin"] },
    ],
  },
];
