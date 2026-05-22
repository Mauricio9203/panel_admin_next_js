"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

/* ============================
   LÓGICA DEL CALLBACK
============================ */
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, loading } = useAuth(); // ← usa el contexto compartido
  const [codeExchanged, setCodeExchanged] = useState(false);

  // Paso 1: Intercambia el código UNA sola vez al montar
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setCodeExchanged(true); // no hay código → dejar que el siguiente efecto decida
      return;
    }
    supabase.auth.exchangeCodeForSession(code)
      .catch(() => {/* ignorar error de doble intercambio */})
      .finally(() => setCodeExchanged(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Paso 2: Una vez intercambiado Y el AuthProvider confirmó el estado, navegar.
  // Esto garantiza que SessionGuard ya tiene la sesión antes de que cambie la ruta.
  useEffect(() => {
    if (!codeExchanged) return; // esperar al intercambio
    if (loading) return;        // esperar al AuthProvider
    router.replace(session ? "/dashboard" : "/login");
  }, [codeExchanged, loading, session, router]);

  return null;
}

/* ============================
   PÁGINA
============================ */
export default function AuthCallbackPage() {
  return (
    <>
      <Suspense>
        <CallbackHandler />
      </Suspense>

      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#fcfcff] dark:bg-[#050502]">
        <div className="w-10 h-10 rounded-full border-[3px] border-violet-600/20 border-t-violet-600 animate-spin" />
        <p className="text-[12px] font-medium tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500">
          Verificando...
        </p>
      </div>
    </>
  );
}
