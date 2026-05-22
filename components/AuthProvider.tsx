"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Batch 1 (síncrono): libera el loading de sesión inmediatamente
        setSession(session);
        setLoading(false);

        if (session) {
          setRoleLoading(true); // bloquea contenido hasta conocer el rol
          try {
            const r = await fetchRole(session.user.id);
            setRole(r);
          } catch {
            setRole(null);
          } finally {
            setRoleLoading(false);
          }
        } else {
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
