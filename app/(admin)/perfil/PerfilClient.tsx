"use client";

import { useState, useEffect } from "react";
import { User, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { updateProfileName, updatePassword } from "./actions";
import TituloModulo from "@/components/ui/TituloModulo";

const ROLE_LABELS: Record<string, string> = {
  admin:   "Administrador",
  manager: "Manager",
  viewer:  "Viewer",
};

const ROLE_COLORS: Record<string, string> = {
  admin:   "bg-primary/10 text-primary",
  manager: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  viewer:  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(new Date(iso));
}

/* ── Sección reutilizable ──────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:p-6 bg-card border border-border rounded-xl">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

/* ── Componente principal ──────────────────────────────────────────────── */
export default function PerfilClient() {
  const { session, role } = useAuth();

  // full_name y avatar_url viven en auth.users.user_metadata, no en profiles
  const meta       = session?.user?.user_metadata ?? {};
  const initialName = meta.full_name ?? meta.name ?? "";
  const avatarUrl   = meta.avatar_url ?? meta.picture ?? null;
  const email       = session?.user?.email ?? "";
  const createdAt   = session?.user?.created_at ?? "";

  /* Formulario — nombre */
  const [name,      setName]      = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  /* Formulario — contraseña */
  const [newPass,   setNewPass]   = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [savingPass, setSavingPass] = useState(false);

  // Nombre mostrado (refleja cambios locales tras guardar)
  const [displayedName, setDisplayedName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
    setDisplayedName(initialName);
  }, [session]);

  /* ── Guardar nombre ──────────────────────────────────────────────────── */
  const handleSaveName = async () => {
    if (!name.trim()) { toast.error("El nombre no puede estar vacío"); return; }
    setSavingName(true);
    try {
      await updateProfileName(name, session?.access_token ?? "");
      setDisplayedName(name.trim()); // refleja el cambio sin requerir re-login
      toast.success("Nombre actualizado correctamente");
    } catch (e: any) {
      toast.error(e?.message ?? "Error al actualizar el nombre");
    } finally {
      setSavingName(false);
    }
  };

  /* ── Cambiar contraseña ──────────────────────────────────────────────── */
  const handleChangePassword = async () => {
    if (newPass.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    if (newPass !== confirm)  { toast.error("Las contraseñas no coinciden"); return; }
    setSavingPass(true);
    try {
      await updatePassword(newPass, session?.access_token ?? "");
      setNewPass("");
      setConfirm("");
      toast.success("Contraseña cambiada correctamente");
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cambiar la contraseña");
    } finally {
      setSavingPass(false);
    }
  };

  /* ── Iniciales para avatar ───────────────────────────────────────────── */
  const initials = (displayedName || email)
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-4 md:p-6 max-w-2xl">
      <TituloModulo titulo="Mi Perfil" variant="violet" icon={User} />

      {/* ── INFO DE CUENTA ─────────────────────────────────────────────── */}
      <Section title="Cuenta">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayedName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">{initials}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-base font-semibold text-foreground truncate">
              {displayedName || "Sin nombre"}
            </p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[role ?? "viewer"]}`}>
                <ShieldCheck size={10} className="inline mr-1" />
                {ROLE_LABELS[role ?? "viewer"]}
              </span>
              {createdAt && (
                <span className="text-[11px] text-muted-foreground">
                  Miembro desde {fmtDate(createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── NOMBRE ─────────────────────────────────────────────────────── */}
      <Section title="Información personal">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Nombre para mostrar
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={savingName}
            placeholder="Tu nombre"
            className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveName}
            disabled={savingName || name.trim() === displayedName}
            className="px-5 py-2 text-[12px] font-black uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            {savingName ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </Section>

      {/* ── CONTRASEÑA ─────────────────────────────────────────────────── */}
      <Section title="Cambiar contraseña">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              disabled={savingPass}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={savingPass}
              placeholder="Repite la contraseña"
              className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition"
            />
          </div>
        </div>

        {/* Indicador de coincidencia */}
        {newPass && confirm && (
          <p className={`text-[11px] font-medium ${newPass === confirm ? "text-emerald-500" : "text-destructive"}`}>
            {newPass === confirm ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={savingPass || !newPass || !confirm}
            className="flex items-center gap-2 px-5 py-2 text-[12px] font-black uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <KeyRound size={13} />
            {savingPass ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </div>
      </Section>
    </div>
  );
}
