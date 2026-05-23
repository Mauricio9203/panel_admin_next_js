"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldX } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import LayoutHeader from "@/components/LayoutHeader";
import MobileOverlay from "@/components/MobileOverlay";
import { useAuth, type UserRole } from "@/components/AuthProvider";
import { sidebarMenu } from "@/config/sidebarMenu";

/* ── Comprueba si el rol tiene acceso a la ruta actual ──
   Busca primero en los hijos (match más específico); si el hijo
   tiene su propio campo `roles` lo usa, si no hereda el del padre.
   Si ningún ítem coincide, permite el acceso.
────────────────────────────────────────────────────────── */
function hasRouteAccess(pathname: string, role: UserRole): boolean {
  for (const item of sidebarMenu) {
    const parentRoles = (item.roles ?? []) as UserRole[];

    // Busca primero en los hijos (ruta más específica)
    if (item.children) {
      for (const child of item.children) {
        const childPath = `/${child.key}`;
        if (pathname === childPath || pathname.startsWith(childPath + "/")) {
          // Si el hijo tiene roles propios los usa; si no, hereda del padre
          const childRoles = ((child as any).roles ?? parentRoles) as UserRole[];
          return childRoles.includes(role);
        }
      }
    }

    // Luego comprueba el padre
    const base = `/${item.key}`;
    if (pathname === base || pathname.startsWith(base + "/")) {
      return parentRoles.includes(role);
    }
  }
  return true; // ruta no mapeada → permitir
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { loading, roleLoading, session, role } = useAuth();
  const pathname = usePathname();

  /* ── Decide qué mostrar en el área de contenido ── */
  const renderMain = () => {
    // Sesión o rol aún cargando → spinner (nunca muestra contenido sin verificar)
    if (loading || roleLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-violet-500/20 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-violet-500 rounded-full animate-spin" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 animate-pulse">
            Cargando
          </span>
        </div>
      );
    }

    // Sin rol asignado en la tabla profiles
    if (!role) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
            <ShieldX size={32} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sin rol asignado</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tu cuenta no tiene un rol asignado. Contacta al administrador.
            </p>
          </div>
        </div>
      );
    }

    // Rol sin acceso a esta ruta
    if (!hasRouteAccess(pathname, role)) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
            <ShieldX size={32} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sin acceso</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              No tienes permiso para ver este módulo.
            </p>
          </div>
          <button
            onClick={() => { window.location.href = "/dashboard"; }}
            className="mt-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 active:scale-95"
          >
            Ir al Dashboard
          </button>
        </div>
      );
    }

    // Acceso permitido → renderiza el contenido de la página
    return <>{children}</>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-slate-950">
      <aside className={`transition-all duration-300 ease-in-out ${collapsed ? "md:w-16" : "md:w-64"}`}>
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <LayoutHeader collapsed={collapsed} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 overflow-auto flex flex-col">
          {renderMain()}
        </main>
      </div>

      <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
