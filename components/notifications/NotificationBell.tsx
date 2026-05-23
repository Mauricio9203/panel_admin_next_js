"use client";

import { useState, useEffect } from "react"; // 1. Agregamos hooks de React
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

const ICON_BTN_CLASS = "group w-9 h-9 flex items-center justify-center rounded-sm transition-all text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

export default function NotificationBell({ initialData }: { initialData: any[] }) {
  const { isOpen, setIsOpen, notifications, unreadCount, containerRef, deleteNotification, markAsRead, markAllAsRead } = useNotifications(initialData);

  // 2. Estado para controlar la hidratación
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`${ICON_BTN_CLASS} ${isOpen ? "bg-gray-100/50 dark:bg-white/10" : ""}`}>
        <Bell size={18} />

        {/* 3. Solo mostramos el contador si el cliente ya está montado */}
        {mounted && unreadCount > 0 && <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-sm bg-red-600 px-1 text-[9px] font-bold text-white border border-white dark:border-black shadow-sm">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-14 mt-2 md:absolute md:inset-auto md:right-0 md:top-full md:w-80 bg-popover/90 backdrop-blur-xl border border-border rounded-sm shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notificaciones</span>
            <button onClick={markAllAsRead} className="text-[10px] text-primary font-bold hover:opacity-70">
              MARCAR TODO
            </button>
          </div>

          <div className="max-h-[60vh] md:max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? notifications.map((n) => <NotificationItem key={n.id} n={n} onMarkRead={markAsRead} onDelete={deleteNotification} />) : <div className="py-10 text-center text-[11px] text-muted-foreground uppercase font-bold opacity-40">Bandeja Vacía</div>}
          </div>

          <div className="p-2 border-t border-border text-center">
            <button className="text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-all">Ver Historial Completo</button>
          </div>
        </div>
      )}
    </div>
  );
}
