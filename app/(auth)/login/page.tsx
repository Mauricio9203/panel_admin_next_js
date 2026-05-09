"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sun, Gem, Mail, Lock, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import NormalInput from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- VALIDACIÓN DE CAMPOS ---
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen max-h-screen flex items-center justify-center p-4 transition-all duration-1000 relative overflow-hidden
      ${theme === "dark" ? "bg-[#05010d]" : "bg-[#f8f7ff]"}`}
    >
      {/* --- ICONO DE CAMBIO DE MODO (Sol que cambia al Tema) --- */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant={theme === "dark" ? "warning" : "primary"}
          size="icon"
          className={`h-10 w-10 rounded-full shadow-lg transition-all active:scale-90
            ${theme === "dark" ? "bg-yellow-400 text-black shadow-yellow-500/20" : "bg-violet-600 text-white shadow-violet-500/20"}`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun size={20} fill={theme === "dark" ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="w-full max-w-[360px] relative z-10 flex flex-col items-center">
        {/* --- CABECERA: SOL ARCANO (Sin rotación constante) --- */}
        <div className="flex flex-col items-center mb-6 group cursor-default" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="relative mb-3 transition-transform duration-500 group-hover:scale-110">
            {/* Glow Estático */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 blur-[30px]
              ${isHovered ? "opacity-40 scale-125" : "opacity-20 scale-100"}
              ${theme === "dark" ? "bg-violet-500" : "bg-violet-300"}`}
            ></div>

            {/* El Círculo del Sol */}
            <div
              className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500
              ${isHovered ? "border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]" : "border-violet-500/30"}
              ${theme === "dark" ? "bg-black/60" : "bg-white shadow-md"}`}
            >
              {isHovered ? <Gem size={28} className="text-yellow-400 animate-pulse" /> : <Sun size={28} className={theme === "dark" ? "text-violet-400" : "text-violet-600"} />}
            </div>
          </div>

          <div className="text-center">
            <h1
              className={`text-2xl font-black tracking-[0.2em] uppercase transition-all duration-500
              ${isHovered ? "text-yellow-500" : theme === "dark" ? "text-white" : "text-violet-900"}`}
            >
              MAGIC<span className="font-light italic">PANEL</span>
            </h1>
          </div>
        </div>

        {/* --- FORMULARIO --- */}
        <form
          onSubmit={handleSubmit}
          noValidate // Usamos nuestra propia validación de estado
          className={`w-full p-7 border-2 rounded-[1.5rem] transition-all duration-500 relative
            ${theme === "dark" ? "bg-slate-900/40 backdrop-blur-xl border-violet-500/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)]" : "bg-white border-violet-50 shadow-[0_10px_25px_rgba(139,92,246,0.05)]"}`}
        >
          <div className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</div>}

            <NormalInput
              label="Correo"
              icon={Mail}
              type="email"
              placeholder="admin@test.com"
              size="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Mostramos error visual si el error contiene la palabra correo o si intentó enviar vacío
              error={error && !email ? "Campo obligatorio" : undefined}
            />

            <NormalInput label="Contraseña" icon={Lock} type="password" placeholder="••••••••" size="md" value={password} onChange={(e) => setPassword(e.target.value)} error={error && !password ? "Campo obligatorio" : undefined} />

            <Button
              type="submit"
              variant={(theme === "dark" ? "warning" : "primary") as any}
              size="lg"
              disabled={loading}
              className={`w-full font-black uppercase tracking-[0.3em] text-[10px] h-12 transition-all mt-2
                ${theme === "dark" ? "bg-yellow-500 text-black shadow-yellow-500/20 hover:bg-yellow-400" : "bg-violet-600 text-white shadow-violet-500/20 hover:bg-violet-700"}`}
            >
              {loading ? "Validando..." : "Iniciar Sesión"}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center gap-1 opacity-20">
          <Stars size={14} className={theme === "dark" ? "text-yellow-500" : "text-violet-500"} />
          <span className="text-[7px] font-bold tracking-[0.4em] uppercase">M. Garrido — 2026</span>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
