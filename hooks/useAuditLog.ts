"use client";

import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

type LogParams = {
  action:    string;   // 'editar', 'eliminar', 'cambiar_rol', etc.
  entity:    string;   // nombre de la tabla o módulo: 'productos', 'usuario'
  entityId?: string;   // id del registro afectado (opcional)
  detail?:   string;   // descripción legible para humanos
};

/**
 * Hook que expone una función `log()` para registrar acciones en audit_log.
 * Fire-and-forget — no bloquea la acción principal.
 * Falla en silencio (solo console.warn) para no interrumpir al usuario.
 */
export function useAuditLog() {
  const { session } = useAuth();

  const log = ({ action, entity, entityId, detail }: LogParams) => {
    if (!session?.user) return;

    supabase
      .from("audit_log")
      .insert({
        user_id:   session.user.id,
        user_email: session.user.email ?? "",
        action,
        entity,
        entity_id: entityId ?? null,
        detail:    detail   ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn("[audit]", error.message);
      });
  };

  return { log };
}
