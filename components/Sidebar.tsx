"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "@/config/sidebarMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

type OpenMenus = Record<string, boolean>;

interface SidebarProps {
  collapsed:     boolean;
  mobileOpen:    boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, mobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { session, role, roleLoading } = useAuth();

  const user      = session?.user;
  const userName  = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Usuario";
  const userEmail = user?.email ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const initials  = userName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const [openMenus, setOpenMenus] = useState<OpenMenus>({});
  const toggleMenu = (key: string) => setOpenMenus((p) => ({ ...p, [key]: !p[key] }));

  const visibleMenu = role
    ? sidebarMenu
        .filter((item) => item.roles?.includes(role))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => {
            const childRoles = (child as any).roles ?? item.roles ?? [];
            return childRoles.includes(role);
          }),
        }))
    : [];

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full z-50
        bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${collapsed  ? "md:w-16"       : "md:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col
      `}
    >
      {/* ── LOGO ─────────────────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-b border-sidebar-border">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative group w-9 h-9 flex items-center justify-center rounded-lg bg-sidebar-primary/10 overflow-hidden shrink-0">
            <img
              src="/logo_ejemplo.png"
              alt="Logo"
              className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">Admin Panel</span>
              <span className="text-[10px] text-sidebar-foreground/50">Industrial Solutions</span>
            </div>
          )}
        </div>
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 space-y-0.5 mt-2 overflow-y-auto custom-scrollbar">

        {/* Skeleton mientras carga el rol */}
        {roleLoading && !collapsed && (
          <div className="space-y-1 px-1 pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 rounded-md bg-sidebar-accent animate-pulse" />
            ))}
          </div>
        )}

        {visibleMenu.map((item) => {
          const Icon    = item.icon;
          const isActive = pathname === `/${item.key}` || pathname.startsWith(`/${item.key}/`);
          const isOpen   = openMenus[item.key] ?? isActive;

          return (
            <div key={item.key}>

              {item.children ? (
                /* ── PADRE CON SUBMENÚ ── */
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={`
                    flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive
                      ? "text-sidebar-primary font-semibold"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? "text-sidebar-primary" : ""} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 opacity-60 ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              ) : (
                /* ── ENLACE SIMPLE ── */
                <Link
                  href={`/${item.key}`}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive
                      ? "bg-sidebar-primary/10 text-sidebar-primary font-semibold shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <Icon size={17} className={isActive ? "text-sidebar-primary" : ""} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )}

              {/* ── SUBMENÚ ── */}
              {item.children && (
                <div
                  className={`
                    ml-5 pl-3 mt-0.5 space-y-0.5 border-l border-sidebar-border
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen && !collapsed ? "max-h-[500px] opacity-100 mb-1" : "max-h-0 opacity-0 pointer-events-none"}
                  `}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === `/${child.key}`;
                    return (
                      <Link
                        key={child.key}
                        href={`/${child.key}`}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors
                          ${isChildActive
                            ? "text-sidebar-primary font-bold bg-sidebar-primary/8"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isChildActive ? "bg-sidebar-primary" : "bg-sidebar-foreground/20"
                          }`}
                        />
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

      {/* ── FOOTER / USUARIO ─────────────────────────────────────────────── */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={`
            flex items-center gap-3 rounded-lg px-2 py-2
            hover:bg-sidebar-accent transition-colors cursor-default
            ${collapsed ? "justify-center" : ""}
          `}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-sidebar-primary-foreground">{initials}</span>
            </div>
          )}

          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">{userName}</span>
              <span className="text-[11px] text-sidebar-foreground/50 truncate">{userEmail}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
