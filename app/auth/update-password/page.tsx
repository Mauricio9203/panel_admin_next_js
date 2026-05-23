"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sun, Moon, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import NormalInput from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

const THEME_CONFIG = {
  dark: {
    bg:     "bg-[#050502]",
    card:   "rgba(10, 10, 5, 0.7)",
    border: "rgba(234, 179, 8, 0.2)",
    button: "bg-yellow-500 hover:bg-yellow-400",
    glow:   "rgba(255, 205, 56, 0.96)",
  },
  light: {
    bg:     "bg-[#fcfcff]",
    card:   "rgba(255, 255, 255, 0.8)",
    border: "rgba(139, 92, 246, 0.1)",
    button: "bg-violet-600 hover:bg-violet-700",
    glow:   "rgba(106, 43, 255, 0.94)",
  },
};

/* ─────────────────────────────────────────────
   LÓGICA: separada para poder usar Suspense
───────────────────────────────────────────── */
function UpdatePasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [codeReady,   setCodeReady]   = useState(false);  // sesión establecida
  const [codeError,   setCodeError]   = useState(false);  // enlace inválido
  const [mounted,     setMounted]     = useState(false);

  const isDark  = (mounted ? theme : "light") === "dark";
  const colors  = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

  const inputClass = isDark
    ? "[&_input]:!bg-slate-900/80 [&_input]:!border-slate-700 [&_input]:!text-slate-200"
    : "[&_input]:!bg-white/80 [&_input]:!border-slate-200 [&_input]:!text-slate-700";

  /* ── Mouse glow ── */
  const mouseX      = useMotionValue(0);
  const mouseY      = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX     = useSpring(mouseX, springConfig);
  const smoothY     = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  /* ── Intercambio del código PKCE ── */
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) { setCodeError(true); return; }

    supabase.auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) setCodeError(true);
        else       setCodeReady(true);
      })
      .catch(() => setCodeError(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) { setError("Completa ambos campos"); return; }
    if (password.length < 6)   { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (password !== confirm)  { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("No se pudo actualizar la contraseña. Intenta solicitar un nuevo enlace.");
    } else {
      setSuccess(true);
      setTimeout(() => router.replace("/dashboard"), 2500);
    }
  };

  return (
    <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${colors.bg}`}>

      {/* FONDO ANIMADO */}
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

      {/* MOUSE FOLLOW GLOW */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-0 blur-[100px] opacity-40 transition-colors duration-500"
        style={{
          x: smoothX, y: smoothY,
          translateX: "-50%", translateY: "-50%",
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* TOGGLE TEMA */}
      <div className="absolute top-6 right-6 z-[60]">
        <Button variant="ghost" size="icon" className="rounded-full backdrop-blur-md border border-white/10" onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-violet-600" />}
        </Button>
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center justify-center z-50 px-6">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-[5vh] shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            {isDark ? <Moon size={28} className="text-yellow-400" /> : <Sun size={28} className="text-violet-600" />}
          </motion.div>
          <h1 className={`text-xl font-black tracking-[0.4em] uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
            MAGIC<span className="opacity-30 font-light italic">PANEL</span>
          </h1>
        </div>

        {/* ── ESTADO: ENLACE INVÁLIDO ── */}
        {codeError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col p-8 border rounded-[2.5rem] backdrop-blur-3xl shadow-2xl text-center gap-4"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <div className={`text-sm font-bold ${isDark ? "text-white/60" : "text-slate-500"}`}>
              Enlace inválido o expirado
            </div>
            <p className={`text-[12px] leading-relaxed ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Este enlace ya fue usado o ha caducado. Solicita uno nuevo desde la pantalla de inicio de sesión.
            </p>
            <Button
              type="button"
              onClick={() => router.replace("/login")}
              className={`w-full font-black uppercase tracking-[0.3em] text-[11px] h-14 text-white border-none rounded-2xl shadow-xl transition-all active:scale-95 ${colors.button}`}
            >
              Ir al inicio de sesión
            </Button>
          </motion.div>
        )}

        {/* ── ESTADO: ESPERANDO CÓDIGO ── */}
        {!codeError && !codeReady && !success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center p-8 border rounded-[2.5rem] backdrop-blur-3xl shadow-2xl gap-4"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <div className="w-8 h-8 rounded-full border-[3px] border-violet-600/20 border-t-violet-600 animate-spin" />
            <p className={`text-[12px] font-medium tracking-[0.3em] uppercase ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Verificando enlace...
            </p>
          </motion.div>
        )}

        {/* ── ESTADO: ÉXITO ── */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center p-8 border rounded-[2.5rem] backdrop-blur-3xl shadow-2xl gap-4 text-center"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <CheckCircle2 size={40} className="text-green-500" />
            <div>
              <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                ¡Contraseña actualizada!
              </p>
              <p className={`text-[12px] mt-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Redirigiendo al dashboard...
              </p>
            </div>
            <div className="w-6 h-6 rounded-full border-[2px] border-green-500/20 border-t-green-500 animate-spin" />
          </motion.div>
        )}

        {/* ── FORMULARIO ── */}
        {codeReady && !success && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col p-8 border rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <div className="flex flex-col gap-[3vh]">

              {/* TÍTULO */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-yellow-500/10" : "bg-violet-500/10"}`}>
                  <KeyRound size={20} className={isDark ? "text-yellow-400" : "text-violet-600"} />
                </div>
                <p className={`text-sm font-bold text-center ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Nueva contraseña
                </p>
              </div>

              {/* ERROR */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CAMPOS */}
              <NormalInput
                label="Nueva contraseña"
                placeholder="••••••••"
                icon={Lock}
                type="password"
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={inputClass}
              />

              <NormalInput
                label="Confirmar contraseña"
                placeholder="••••••••"
                icon={Lock}
                type="password"
                size="md"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className={inputClass}
              />

              <Button
                type="submit"
                disabled={loading}
                className={`w-full font-black uppercase tracking-[0.3em] text-[11px] h-14 text-white border-none rounded-2xl shadow-xl transition-all active:scale-95 ${colors.button}`}
              >
                {loading ? "Actualizando..." : "Guardar contraseña"}
              </Button>

              {/* LINK VOLVER */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.replace("/login")}
                  className={`text-[11px] transition-colors ${isDark ? "text-white/30 hover:text-yellow-400" : "text-slate-400 hover:text-violet-600"}`}
                >
                  ← Volver a iniciar sesión
                </button>
              </div>

            </div>
          </motion.form>
        )}

        <div className="mt-[5vh] opacity-30 shrink-0">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase">M. GARRIDO — 2026</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PÁGINA (envuelve en Suspense por useSearchParams)
───────────────────────────────────────────── */
export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordForm />
    </Suspense>
  );
}
