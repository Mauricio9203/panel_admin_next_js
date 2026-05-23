import { LayoutDashboard, Table2, FlaskConical, ServerIcon, Users, History, Settings, Palette } from "lucide-react";

export const sidebarMenu = [
  {
    key:   "dashboard",
    label: "Dashboard",
    icon:  LayoutDashboard,
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
    key:   "configuracion",
    label: "Configuración",
    icon:  Settings,
    roles: ["admin"],
    children: [
      { key: "configuracion/apariencia", label: "Apariencia", icon: Palette, roles: ["admin"] },
    ],
  },
  {
    key:   "ejemplos",
    label: "Ejemplos",
    icon:  FlaskConical,
    roles: ["admin", "manager"],
    children: [
      { key: "ejemplos/tabla_supabase", label: "Tabla Cliente",     roles: ["admin", "manager"] },
      { key: "ejemplos/tabla_server",   label: "Tabla Server-Side", roles: ["admin"], icon: ServerIcon },
    ],
  },
];
