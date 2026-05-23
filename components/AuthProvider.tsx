"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/* ============================
   TIPOS
============================ */
export type UserRole = "admin" | "manager" | "viewer";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
  role: UserRole | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  roleLoading: false,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

/* ============================
   HELPER — carga el rol desde profiles
============================ */
async function fetchRole(userId: string): Promise<UserRole | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as UserRole) ?? null;
}

/* ============================
   PROVEEDOR
============================ */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session,     setSession]     = useState<Session | null>(null);
  const [role,        setRole]        = useState<UserRole | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  // Evita volver a buscar el rol cuando Supabase dispara SIGNED_IN
  // por cambio de pestaña, refresco de token, etc.
  const roleFetched = useRef(false);

  useEffect(() => {
    /* ── 1. Hidratación inmediata ──────────────────────────────────────────
       getSession() lee desde localStorage sin hacer llamada de red.
       Así el spinner desaparece de inmediato en lugar de esperar el evento
       INITIAL_SESSION de onAuthStateChange (que puede tardar en Next.js 16).
    ──────────────────────────────────────────────────────────────────────── */
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      if (session && !roleFetched.current) {
        roleFetched.current = true;
        setRoleLoading(true);
        try {
          const r = await fetchRole(session.user.id);
          setRole(r);
        } catch {
          setRole(null);
        } finally {
          setRoleLoading(false);
        }
      }
    });

    /* ── 2. Escucha cambios futuros (login, logout, refresco de token) ─────
       INITIAL_SESSION se ignora porque ya lo manejó getSession() arriba.
    ──────────────────────────────────────────────────────────────────────── */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") return;

        setSession(session);
        setLoading(false);

        if (session) {
          if (!roleFetched.current) {
            roleFetched.current = true;
            setRoleLoading(true);
            try {
              const r = await fetchRole(session.user.id);
              setRole(r);
            } catch {
              setRole(null);
            } finally {
              setRoleLoading(false);
            }
          }
        } else {
          // Sign-out: resetea todo para la próxima sesión
          roleFetched.current = false;
          setRole(null);
          setRoleLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, roleLoading, role }}>
      {children}
    </AuthContext.Provider>
  );
}
