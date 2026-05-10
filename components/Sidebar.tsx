"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "@/config/sidebarMenu";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Fundamental para evitar el pestañeo

/* 🧠 TIPOS */
type MenuKey = (typeof sidebarMenu)[number]["key"];
type OpenMenus = Record<string, boolean>;

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, mobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // Estado para manejar qué menús están desplegados manualmente
  const [openMenus, setOpenMenus] = useState<OpenMenus>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full z-50
        bg-white dark:bg-black
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "md:w-16" : "md:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col
      `}
    >
      {/* 🟣 HEADER / LOGO */}
      <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative group w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-violet-700/10 overflow-hidden">
            <img src="/logo_ejemplo.png" alt="Logo" className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110" />
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">Admin Panel</span>
              <span className="text-[10px] text-gray-500 dark:text-neutral-400">Industrial Solutions</span>
            </div>
          )}
        </div>
      </div>

      {/* 📂 NAV - Con scroll sutil */}
      <nav className="flex-1 px-2 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === `/${item.key}` || pathname.startsWith(`/${item.key}/`);
          const isOpen = openMenus[item.key] ?? isActive; // Si no se ha tocado, se abre si es la ruta activa

          return (
            <div key={item.key} className="relative">
              {item.children ? (
                /* ELEMENTO CON SUBMENÚ (Botón para desplegar) */
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={`
                    flex w-full items-center justify-between px-3 py-2 rounded-md text-sm transition-all
                    ${isActive ? "text-violet-600 font-semibold" : "text-slate-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-800"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
                </button>
              ) : (
                /* ELEMENTO SIMPLE (Link directo) */
                <Link
                  href={`/${item.key}`}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                    ${isActive ? "bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-200 shadow-sm" : "text-slate-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-800"}
                  `}
                >
                  <Icon size={18} className={isActive ? "text-violet-600" : ""} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )}

              {/* SUBMENU ANIMADO */}
              {item.children && (
                <div
                  className={`
                    ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen && !collapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
                  `}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === `/${child.key}`;

                    return (
                      <Link
                        key={child.key}
                        href={`/${child.key}`}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all
                          ${isChildActive ? "text-violet-700 dark:text-violet-300 font-bold" : "text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-200"}
                        `}
                      >
                        <span className={`w-1 h-1 rounded-full ${isChildActive ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 👤 USER / FOOTER */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className={`flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${collapsed ? "justify-center" : ""}`}>
          <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full object-cover" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">Mauri</span>
              <span className="text-[11px] text-gray-500 dark:text-neutral-400">Administrador</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
