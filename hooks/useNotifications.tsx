// @/hooks/useNotifications.ts
import { useState, useRef, useEffect } from "react";

export function useNotifications(initialData: any[] = []) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Inicializamos con los datos, asegurando que no sea undefined
  const [notifications, setNotifications] = useState(() => initialData ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. EFECTO CORREGIDO:
  // Usamos un stringify para comparar el CONTENIDO y no la REFERENCIA del array.
  // Esto evita el bucle infinito si el padre envía un array nuevo con los mismos datos.
  const dataString = JSON.stringify(initialData);

  useEffect(() => {
    if (initialData) {
      setNotifications(initialData);
    }
  }, [dataString]); // <--- Dependencia estable

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  // Manejo de click fuera (sin cambios, ya estaba bien)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // --- ACCIONES LOCALES ---
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return {
    isOpen,
    setIsOpen,
    notifications: notifications || [],
    unreadCount,
    containerRef,
    deleteNotification,
    markAsRead,
    markAllAsRead,
  };
}
