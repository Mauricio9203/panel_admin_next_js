import { LayoutDashboard, Folder, Users } from "lucide-react";

/**
 * 🧠 sidebarMenu = fuente única de navegación
 *
 * 👉 Todo lo que agregues aquí:
 *    - aparece automáticamente en el sidebar
 *    - puede tener submenús (children)
 *    - define la estructura de navegación de la app
 *
 * ⚠️ REGLAS IMPORTANTES:
 * - key SIEMPRE en kebab-case (sin espacios ni tildes)
 * - children usan formato: "modulo/accion"
 * - key debe ser único
 */

export const sidebarMenu = [
  /**
   * 🟣 MÓDULO SIMPLE
   */
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  /**
   * 🟡 MÓDULO: DOCUMENTOS
   */
  {
    key: "documentos",
    label: "Documentos",
    icon: Folder,
    children: [
      {
        key: "documentos/todos",
        label: "Todos",
      },
      {
        key: "documentos/crear",
        label: "Crear",
      },
    ],
  },

  /**
   * 🔵 MÓDULO: USUARIOS
   */
  {
    key: "usuarios",
    label: "Usuarios",
    icon: Users,
    children: [
      {
        key: "usuarios/lista",
        label: "Lista",
      },
    ],
  },

  /**
   * 🧪 MÓDULO DE PRUEBA (CORREGIDO)
   *
   * ✔ sin espacios en keys
   * ✔ consistente con el resto del sistema
   */
  {
    key: "modulo-prueba",
    label: "Módulo de Prueba",
    icon: Users,
    children: [
      {
        key: "modulo-prueba/lista",
        label: "Lista de Prueba",
      },
    ],
  },
];