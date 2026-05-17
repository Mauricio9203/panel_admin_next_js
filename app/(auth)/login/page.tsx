"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Mail, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import NormalInput from "@/components/ui/Input";

const THEME_CONFIG = {
  dark: {
    bg: "bg-[#050502]",
    card: "rgba(10, 10, 5, 0.7)",
    border: "rgba(234, 179, 8, 0.2)",
    button: "bg-yellow-500 hover:bg-yellow-400",
    glow: "rgba(255, 205, 56, 0.96)",
  },
  light: {
    bg: "bg-[#fcfcff]",
    card: "rgba(255, 255, 255, 0.8)",
    border: "rgba(139, 92, 246, 0.1)",
    button: "bg-violet-600 hover:bg-violet-700",
    glow: "rgba(106, 43, 255, 0.94)",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // --- Estados Funcionales ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isDark = (mounted ? theme : "light") === "dark";
  const colors = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

  // --- Lógica del Mouse Glow ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // --- Manejador de Login ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación básica antes de enviar
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales inválidas");
      } else {
        router.push("/dashboard"); // O tu ruta de destino
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${colors.bg}`}>
      {/* --- FONDO ANIMADO --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-30 blur-[120px]"
          style={{ background: isDark ? "radial-gradient(circle, #facc15 0%, transparent 70%)" : "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[150px]"
          style={{ background: isDark ? "radial-gradient(circle, #ca8a04 0%, transparent 70%)" : "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />
      </div>

      {/* --- MOUSE FOLLOW GLOW --- */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-0 blur-[100px] opacity-40 transition-colors duration-500"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="absolute top-6 right-6 z-[60]">
        <Button variant="ghost" size="icon" className="rounded-full backdrop-blur-md border border-white/10" onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-violet-600" />}
        </Button>
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center justify-center z-50 px-6">
        <div className="flex flex-col items-center mb-[5vh] shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            {isDark ? <Moon size={28} className="text-yellow-400" /> : <Sun size={28} className="text-violet-600" />}
          </motion.div>
          <h1 className={`text-xl font-black tracking-[0.4em] uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
            MAGIC<span className="opacity-30 font-light italic">PANEL</span>
          </h1>
        </div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col p-8 border rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex flex-col gap-[3vh]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-center">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <NormalInput label="Email" placeholder="nombre@ejemplo.com" icon={Mail} type="email" size="md" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />

            <NormalInput label="Password" placeholder="••••••••" icon={Lock} type="password" size="md" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />

            <Button type="submit" disabled={loading} className={`w-full font-black uppercase tracking-[0.3em] text-[11px] h-14 mt-2 text-white border-none rounded-2xl shadow-xl transition-all active:scale-95 ${colors.button}`}>
              {loading ? "Iniciando..." : "Ingresar"}
            </Button>
          </div>
        </motion.form>

        <div className="mt-[5vh] opacity-30 shrink-0">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase">M. GARRIDO — 2026</span>
        </div>
      </div>
    </div>
  );
}
