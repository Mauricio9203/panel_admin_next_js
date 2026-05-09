"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Importante para salir del div contenedor
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses: Record<string, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-[95vw] sm:h-[90vh]",
};

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true); // Evita errores de hidratación en Next.js
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!mounted) return null;

  const desktopVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 400 } },
    exit: { opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } },
  };

  const mobileVariants: Variants = {
    initial: { y: "100%" },
    animate: { y: 0, transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 } },
    exit: { y: "100%", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // El Portal renderiza fuera del árbol jerárquico actual
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center overflow-hidden p-4">
          {/* BACKDROP - Glassmorphism puro */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-md" />

          {/* VENTANA MODAL - Estilo Glassmorphic */}
          <motion.div
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
            relative w-full ${sizeClasses[size]}
            flex flex-col 
            
            /* 🔥 LA SOLUCIÓN AL ALTO: */
            /* En móvil usa el 100% del alto dinámico menos un margen de 2rem */
            max-h-[calc(100dvh-2rem)] 
            /* En tablets/desktop se ajusta a un máximo de 90% para que nunca toque el borde */
            sm:max-h-[90vh] 
            
            /* Estilo Cristal y Borde Gris */
            bg-white/80 dark:bg-slate-900/90 
            backdrop-blur-xl 
            border border-slate-300 dark:border-slate-700
            
            /* Redondeado sutil (Corregido de 2.5rem a 2xl) */
            rounded-2xl
            
            shadow-2xl
            will-change-transform
            overflow-hidden`}
          >
            {/* Indicador visual móvil */}
            <div className="flex justify-center pt-4 sm:hidden shrink-0">
              <div className="w-12 h-1.5 bg-slate-400/50 dark:bg-slate-500/50 rounded-full" />
            </div>

            {/* CABECERA */}
            <div className="px-6 py-4 sm:px-8 sm:py-5 flex justify-between items-center shrink-0">
              {title ? <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2> : <div />}
              <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* CUERPO */}
            <div className="px-6 pb-8 sm:px-8 overflow-y-auto flex-1 min-h-0 text-slate-800 dark:text-slate-200">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body, // Aquí se inyecta
  );
}
