import { LayoutDashboard, Table2, FlaskConical, ServerIcon, Users, History, Palette, FolderOpen } from "lucide-react";

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
    key: "gestor_archivos",
    label: "Gestor de Archivos",
    icon: FolderOpen,
    roles: ["admin"],
    children: [
      { key: "gestor_archivos/archivos", label: "Documentos", icon: Palette, roles: ["admin"] },
    ],
  },
  {
    key:   "auditoria",
    label: "Auditoría",
    icon:  History,
    roles: ["admin"],
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
