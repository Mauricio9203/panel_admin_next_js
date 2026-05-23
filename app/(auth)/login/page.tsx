"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Mail, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import NormalInput from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

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

type Mode = "signin" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState("");
  const [successMsg,    setSuccessMsg]     = useState("");
  const [loading,       setLoading]       = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [mode,          setMode]          = useState<Mode>("signin");

  const isDark  = (mounted ? theme : "light") === "dark";
  const colors  = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

  const inputClass = isDark
    ? "[&_input]:!bg-slate-900/80 [&_input]:!border-slate-700 [&_input]:!text-slate-200"
    : "[&_input]:!bg-white/80 [&_input]:!border-slate-200 [&_input]:!text-slate-700";

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

  /* ── Cambiar modo (limpia mensajes, conserva el email) ── */
  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setSuccessMsg("");
  };

  /* ── Google ── */
  const handleGoogleSignIn = async () => {
    setError("");
    setLoadingGoogle(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) { setError("No se pudo iniciar sesión con Google"); setLoadingGoogle(false); }
  };

  /* ── Submit (maneja los tres modos) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    /* RECUPERAR CONTRASEÑA */
    if (mode === "forgot") {
      if (!email) { setError("Ingresa tu correo"); return; }
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      setLoading(false);
      if (error) setError("No se pudo enviar el enlace. Verifica el correo.");
      else       setSuccessMsg("¡Listo! Revisa tu correo y haz clic en el enlace para restablecer tu contraseña.");
      return;
    }

    if (!email || !password) { setError("Por favor completa todos los campos"); return; }
    setLoading(true);

    /* REGISTRO */
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(
          error.message.toLowerCase().includes("already")
            ? "Este correo ya está registrado. Intenta iniciar sesión."
            : "Error al crear la cuenta. Inténtalo de nuevo."
        );
      } else {
        setSuccessMsg("¡Cuenta creada! Revisa tu correo y haz clic en el enlace de confirmación para activarla.");
      }
      return;
    }

    /* INICIO DE SESIÓN */
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Credenciales inválidas"); setLoading(false); }
    else        router.push("/dashboard");
  };

  const TITLES: Record<Mode, string> = {
    signin: "Ingresar",
    signup: "Crear cuenta",
    forgot: "Recuperar acceso",
  };

  const BUTTON_LABELS: Record<Mode, string> = {
    signin: loading ? "Ingresando..."      : "Ingresar",
    signup: loading ? "Creando cuenta..."  : "Registrarse",
    forgot: loading ? "Enviando..."        : "Enviar enlace",
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

      <div className="w-full max-w-[400px] flex flex-col items-center justify-center z-50 px-6">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-5 shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            {isDark ? <Moon size={22} className="text-yellow-400" /> : <Sun size={22} className="text-violet-600" />}
          </motion.div>
          <h1 className={`text-lg font-black tracking-[0.4em] uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
            MAGIC<span className="opacity-30 font-light italic">PANEL</span>
          </h1>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col p-6 border rounded-3xl backdrop-blur-3xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <div className="flex flex-col gap-3.5">

            {/* TÍTULO DEL MODO (animado) */}
            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className={`text-sm font-bold text-center ${isDark ? "text-white/60" : "text-slate-500"}`}
              >
                {TITLES[mode]}
              </motion.p>
            </AnimatePresence>

            {/* MENSAJES DE ERROR / ÉXITO */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-center">
                  {error}
                </motion.div>
              )}
              {successMsg && (
                <motion.div key="success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[11px] py-3 px-4 rounded-xl font-medium text-center leading-relaxed">
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CAMPOS (ocultos cuando hay mensaje de éxito) */}
            {!successMsg && (
              <>
                <NormalInput label="Email" placeholder="nombre@ejemplo.com" icon={Mail} type="email" size="md"
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || loadingGoogle} className={inputClass} />

                {mode !== "forgot" && (
                  <NormalInput label="Password" placeholder="••••••••" icon={Lock} type="password" size="md"
                    value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading || loadingGoogle} className={inputClass} />
                )}

                <Button type="submit" disabled={loading || loadingGoogle}
                  className={`w-full font-black uppercase tracking-[0.3em] text-[11px] h-11 text-white border-none rounded-2xl shadow-xl transition-all active:scale-95 ${colors.button}`}>
                  {BUTTON_LABELS[mode]}
                </Button>
              </>
            )}

            {/* LINKS DE MODO */}
            <div className="flex flex-col items-center gap-1.5">
              {!successMsg && mode === "signin" && (
                <>
                  <button type="button" onClick={() => switchMode("forgot")}
                    className={`text-[11px] transition-colors ${isDark ? "text-white/30 hover:text-yellow-400" : "text-slate-400 hover:text-violet-600"}`}>
                    ¿Olvidaste tu contraseña?
                  </button>
                  <button type="button" onClick={() => switchMode("signup")}
                    className={`text-[11px] transition-colors ${isDark ? "text-white/30 hover:text-yellow-400" : "text-slate-400 hover:text-violet-600"}`}>
                    ¿No tienes cuenta? <span className="font-bold">Regístrate</span>
                  </button>
                </>
              )}
              {(successMsg || mode === "signup" || mode === "forgot") && (
                <button type="button" onClick={() => switchMode("signin")}
                  className={`text-[11px] transition-colors ${isDark ? "text-white/30 hover:text-yellow-400" : "text-slate-400 hover:text-violet-600"}`}>
                  ← Volver a iniciar sesión
                </button>
              )}
            </div>

            {/* GOOGLE (solo en signin y sin éxito) */}
            {!successMsg && mode === "signin" && (
              <>
                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                  <span className={`text-[11px] font-medium ${isDark ? "text-white/30" : "text-slate-400"}`}>o</span>
                  <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                </div>
                <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={loading || loadingGoogle}
                  className={`w-full h-10 rounded-2xl gap-3 text-[12px] font-semibold tracking-wide border ${
                    isDark
                      ? "border-slate-700/60 bg-slate-800/40 text-slate-200 hover:bg-slate-700/50"
                      : "border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50"
                  }`}>
                  <GoogleIcon />
                  {loadingGoogle ? "Redirigiendo..." : "Continuar con Google"}
                </Button>
              </>
            )}

          </div>
        </motion.form>

        <div className="mt-5 opacity-30 shrink-0">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase">M. GARRIDO — 2026</span>
        </div>
      </div>
    </div>
  );
}
