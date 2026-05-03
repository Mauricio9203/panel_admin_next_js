"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import LayoutHeader from "@/components/LayoutHeader";
import MobileOverlay from "@/components/MobileOverlay";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-slate-950">
      {/* SIDEBAR */}
      <div className={`transition-all duration-300 ${collapsed ? "md:w-16" : "md:w-64"}`}>
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      {/* MAIN */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        <LayoutHeader collapsed={collapsed} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>

      {/* MOBILE OVERLAY */}
      <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
