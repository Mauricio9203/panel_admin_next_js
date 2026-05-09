"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "@/config/sidebarMenu";
import { useRouter, usePathname } from "next/navigation";

/* 🧠 TIPOS */
type MenuKey = (typeof sidebarMenu)[number]["key"];
type OpenMenus = Record<MenuKey, boolean>;

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, mobileOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<OpenMenus>(() => {
    const initial = {} as OpenMenus;
    sidebarMenu.forEach((m) => {
      initial[m.key] = false;
    });
    return initial;
  });

  /* 🔥 sync automático con la URL */
  useEffect(() => {
    const updated = {} as OpenMenus;
    sidebarMenu.forEach((m) => {
      // Mantiene abierto el menú si la ruta actual coincide con la key del padre
      updated[m.key] = pathname.startsWith(`/${m.key}`);
    });
    setOpenMenus(updated);
  }, [pathname]);

  const goTo = (item: string) => {
    router.push(`/${item}`);
  };

  const toggleMenu = (menu: MenuKey) => {
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
        transition-all duration-300

        ${collapsed ? "md:w-16" : "md:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

        flex flex-col
      `}
    >
      {/* 🟣 HEADER */}
      <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-800">
        <div
          className={`
            flex items-center gap-3
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative group w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-violet-700/10 overflow-hidden">
            <img src="/logo_ejemplo.png" alt="Logo" className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-violet-500/20 blur-md" />
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">Nombre de Marca</span>
              <span className="text-[10px] text-gray-500 dark:text-neutral-400">Slogan de empresa</span>
            </div>
          )}
        </div>
      </div>

      {/* 📂 NAV - Con scroll sutil si hay demasiados items */}
      <nav className="flex-1 px-2 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenus[item.key];
          const isActive = pathname === `/${item.key}` || pathname.startsWith(`/${item.key}/`);

          return (
            <div key={item.key} className="relative">
              <button
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.key);
                  } else {
                    goTo(item.key);
                  }
                }}
                className={`
                  flex w-full items-center justify-between
                  px-3 py-2 rounded-md text-sm
                  transition-all
                  ${isActive ? "bg-violet-100 dark:bg-gray-800 text-violet-900 dark:text-violet-200 shadow-sm" : "text-slate-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-violet-600" : ""} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>

                {!collapsed && item.children && <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
              </button>

              {/* SUBMENU CORREGIDO */}
              {item.children && (
                <div
                  className={`
                    ml-5 mt-1 space-y-1 overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${isOpen && !collapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
                  `}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === `/${child.key}`;

                    return (
                      <button
                        key={child.key}
                        onClick={() => goTo(child.key)}
                        className={`
                          flex w-full items-center gap-2 px-3 py-1.5 rounded-md text-xs
                          transition-all
                          ${isChildActive ? "bg-violet-50 dark:bg-gray-800/50 text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-200"}
                        `}
                      >
                        <span className={`w-1 h-1 rounded-full ${isChildActive ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 👤 USER */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div
          className={`
            flex items-center gap-3 rounded-md px-2 py-2
            transition-all duration-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative group shrink-0">
            <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full object-cover transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-md opacity-0 group-hover:opacity-100 transition" />
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">Mauri</span>
              <span className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
