"use client";

import { useEffect, useState } from "react";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { sidebarMenu } from "@/config/sidebarMenu";

type MenuType = "documentos" | "usuarios" | "modulo-prueba";

type ActiveItem = "dashboard" | "documentos/todos" | "documentos/crear" | "usuarios/lista" | "modulo-prueba/lista";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<ActiveItem>("dashboard");
  const [hoverMenu, setHoverMenu] = useState<MenuType | null>(null);
  const [ready, setReady] = useState(false);

  const [openMenus, setOpenMenus] = useState<Record<MenuType, boolean>>({
    documentos: false,
    usuarios: false,
    "modulo-prueba": false,
  });

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("activeItem") as ActiveItem | null;
    if (saved) setActiveItem(saved);
    setReady(true);
  }, []);

  /* ---------------- SAVE ---------------- */
  useEffect(() => {
    if (ready) {
      localStorage.setItem("activeItem", activeItem);
    }
  }, [activeItem, ready]);

  /* ---------------- SYNC MENU STATE ---------------- */
  useEffect(() => {
    setOpenMenus({
      documentos: activeItem.startsWith("documentos"),
      usuarios: activeItem.startsWith("usuarios"),
      "modulo-prueba": activeItem.startsWith("modulo-prueba"),
    });
  }, [activeItem]);

  const goTo = (item: ActiveItem) => setActiveItem(item);

  const toggleMenu = (menu: MenuType) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  /* ---------------- HELPERS ---------------- */
  const getChildren = (key: string) => {
    return sidebarMenu.find((m) => m.key === key)?.children ?? [];
  };

  /* ---------------- ITEM ---------------- */
  const Item = ({ icon: Icon, label, active, onClick, menuKey, children }: any) => (
    <div
      className="relative"
      onMouseEnter={() => {
        if (!collapsed && menuKey) return;
        setHoverMenu(menuKey || null);
      }}
      onMouseLeave={() => {
        if (collapsed) setHoverMenu(null);
      }}
    >
      <button
        onClick={onClick}
        className={`
          flex w-full items-center justify-between
          rounded-md text-sm transition-colors
          px-3 py-2

          ${collapsed ? "justify-center" : "gap-3 justify-between"}

          ${active ? "bg-violet-100 dark:bg-gray-800 text-violet-900 dark:text-violet-200" : "text-violet-900 dark:text-violet-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <Icon size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </div>

        {!collapsed && children}
      </button>

      {/* FLYOUT */}
      {collapsed && menuKey && (
        <div
          className={`
            absolute left-14 top-0 w-44
            bg-white dark:bg-black
            border border-gray-200 dark:border-gray-800
            rounded-md shadow-lg p-2 z-50
            transition-all duration-150
            ${hoverMenu === menuKey ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
          <div className="space-y-1">
            {getChildren(menuKey).map((child: any) => (
              <SubItem key={child.key} label={child.label} active={activeItem === child.key} onClick={() => goTo(child.key)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- READY ---------------- */
  if (!ready) {
    return <aside className="hidden md:block w-64 h-full border-r border-gray-200 dark:border-gray-800" />;
  }

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full z-50
        bg-white dark:bg-black
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300
        overflow-x-hidden overflow-y-auto

        ${collapsed ? "md:w-16" : "md:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

        flex flex-col
      `}
    >
      {/* HEADER */}
      <div className="px-3 py-3">{!collapsed && <h2 className="font-semibold text-sm text-violet-900 dark:text-violet-200">Admin Panel</h2>}</div>

      {/* NAV */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {/* DASHBOARD */}
        <Item icon={LayoutDashboard} label="Dashboard" active={activeItem === "dashboard"} onClick={() => goTo("dashboard")} />

        {/* MENUS DINÁMICOS */}
        {sidebarMenu
          .filter((m) => m.key !== "dashboard")
          .map((item: any) => {
            const Icon = item.icon;
            const isOpen = openMenus[item.key as MenuType];

            const isActive = activeItem === item.key || item.children?.some((c: any) => c.key === activeItem);

            return (
              <div key={item.key}>
                {/* ITEM PRINCIPAL */}
                <Item
                  icon={Icon}
                  label={item.label}
                  menuKey={item.key}
                  active={isActive}
                  onClick={() => {
                    if (item.children) {
                      toggleMenu(item.key as MenuType);
                    } else {
                      goTo(item.key);
                    }
                  }}
                >
                  {!collapsed && item.children && <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                </Item>

                {/* SUBMENÚ */}
                <div
                  className={`
                    ml-5 space-y-1 overflow-hidden
                    transition-all duration-300 ease-out

                    ${isOpen && !collapsed ? "max-h-40 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"}
                  `}
                >
                  {getChildren(item.key).map((child: any) => (
                    <SubItem key={child.key} label={child.label} active={activeItem === child.key} onClick={() => goTo(child.key)} />
                  ))}
                </div>
              </div>
            );
          })}
      </nav>
    </aside>
  );
}

/* ---------------- SUB ITEM ---------------- */
function SubItem({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-2
        px-3 py-1.5 rounded-md text-sm
        transition-colors

        ${active ? "bg-violet-100 dark:bg-gray-800 text-violet-900 dark:text-violet-200" : "text-violet-900 dark:text-violet-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-violet-600" : "bg-violet-300"}`} />
      {label}
    </button>
  );
}
