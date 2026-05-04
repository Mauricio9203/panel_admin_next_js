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
      {/* HEADER */}
      <div className="px-3 py-3">{!collapsed && <h2 className="font-semibold text-sm text-violet-900 dark:text-violet-200">Admin Panel</h2>}</div>

      {/* NAV */}
      <nav className="flex-1 px-2 space-y-2">
        {sidebarMenu.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenus[item.key];

          const isActive = pathname === `/${item.key}` || pathname.startsWith(`/${item.key}/`);

          return (
            <div key={item.key}>
              {/* ITEM PRINCIPAL */}
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
            

                  ${isActive ? "bg-violet-100 dark:bg-gray-800 text-violet-900 dark:text-violet-200" : "text-violet-900 dark:text-violet-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                <div className="flex items-center gap-3 ">
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.children && <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}
              </button>

              {/* SUBMENU */}
              {item.children && (
                <div
                  className={`
              ml-5 mt-1 space-y-1 overflow-hidden
    transition-all duration-300

                    ${isOpen && !collapsed ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
                  `}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === `/${child.key}`;

                    return (
                      <button
                        key={child.key}
                        onClick={() => goTo(child.key)}
                        className={`
                          flex w-full items-center gap-2 px-3 py-1.5 rounded-md text-sm

                          ${isChildActive ? "bg-violet-100 dark:bg-gray-800 text-violet-900 dark:text-violet-200" : "text-violet-900 dark:text-violet-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                        `}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
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
    </aside>
  );
}
