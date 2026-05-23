"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { toast } from "sonner";
import { updateUserRole, deleteUser, deleteUsers, updateUsersRole } from "./actions";
import { useAuth } from "@/components/AuthProvider";
import { useAuditLog } from "@/hooks/useAuditLog";
import type { UsuarioConRol } from "./page";
import type { UserRole } from "@/components/AuthProvider";

/* ──────────────────
   FORMATO DE FECHA
────────────────── */
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  }).format(new Date(iso));
}

/* ──────────────────
   OPCIONES DE ROL
────────────────── */
const ROLE_OPTIONS = [
  { value: "admin",   label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "viewer",  label: "Viewer" },
];

/* ──────────────────
   COLUMNAS
────────────────── */
const columns: ColumnDef<UsuarioConRol>[] = [
  {
    id:          "usuario",
    header:      "Usuario",
    accessorFn:  (row) => row.email, // para búsqueda/sort
    cell: ({ row }) => {
      const { full_name, email, avatar_url } = row.original;
      const displayName = full_name ?? email;
      const initials    = displayName
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3 py-0.5">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-white">{initials}</span>
            </div>
          )}
          <div className="flex flex-col leading-tight min-w-0">
            {full_name && (
              <span className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200 truncate">
                {full_name}
              </span>
            )}
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
              {email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    // La columna "role" no tiene cell personalizado —
    // EditableCell (select) toma el control via editableColumns.
    accessorKey: "role",
    header:      "Rol",
  },
  {
    accessorKey: "created_at",
    header:      "Registrado",
    cell: ({ row }) => (
      <span className="text-[11px] text-neutral-500">
        {fmtDate(row.getValue("created_at"))}
      </span>
    ),
  },
  {
    accessorKey: "last_sign_in_at",
    header:      "Último acceso",
    cell: ({ row }) => (
      <span className="text-[11px] text-neutral-500">
        {fmtDate(row.getValue("last_sign_in_at"))}
      </span>
    ),
  },
];

/* ──────────────────
   COMPONENTE
────────────────── */
export default function UsuariosTable({ initialData }: { initialData: UsuarioConRol[] }) {
  const [data, setData] = useState(initialData);
  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const { log } = useAuditLog();

  /* ── Eliminar usuario ──────────────────────────────────────────────── */
  const handleDelete = (user: UsuarioConRol) => {
    if (user.id === currentUserId) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }

    toast.warning(`¿Eliminar a ${user.full_name ?? user.email}?`, {
      description: "Esta acción eliminará la cuenta permanentemente y no se puede deshacer.",
      duration: 6000,
      action: {
        label: "Eliminar",
        onClick: () => {
          toast.promise(
            (async () => {
              await deleteUser(user.id);
              setData((prev) => prev.filter((u) => u.id !== user.id));
            })(),
            {
              loading: "Eliminando usuario...",
              success: () => {
                log({ action: "eliminar_usuario", entity: "usuario", entityId: user.id, detail: `Eliminó a ${user.full_name ?? user.email}` });
                return `${user.full_name ?? user.email} eliminado correctamente`;
              },
              error:   (e: any) => e instanceof Error ? e.message : "Error al eliminar",
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  /* ── Eliminar múltiples usuarios ──────────────────────────────────── */
  const handleBulkDelete = (selected: UsuarioConRol[]) => {
    const toDelete = selected.filter((u) => u.id !== currentUserId);
    const skippedSelf = toDelete.length < selected.length;

    if (toDelete.length === 0) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }

    const label =
      toDelete.length === 1
        ? (toDelete[0].full_name ?? toDelete[0].email)
        : `${toDelete.length} usuarios`;

    toast.warning(`¿Eliminar ${label}?`, {
      description: `Esta acción no se puede deshacer.${skippedSelf ? " Tu cuenta fue excluida de la selección." : ""}`,
      duration: 6000,
      action: {
        label: "Eliminar",
        onClick: () => {
          const ids = toDelete.map((u) => u.id);
          toast.promise(
            (async () => {
              await deleteUsers(ids);
              setData((curr) => curr.filter((u) => !ids.includes(u.id)));
              return toDelete.length;
            })(),
            {
              loading: `Eliminando ${toDelete.length} usuario${toDelete.length !== 1 ? "s" : ""}...`,
              success: (n: number) => {
                log({ action: "eliminar_masivo_usuarios", entity: "usuario", detail: `Eliminó ${n} usuario${n !== 1 ? "s" : ""}` });
                return `${n} usuario${n !== 1 ? "s" : ""} eliminado${n !== 1 ? "s" : ""} correctamente`;
              },
              error:   (e: any) => e instanceof Error ? e.message : "Error al eliminar",
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  /* ── Asignar rol en masa ───────────────────────────────────────────── */
  const handleBulkRoleUpdate = (selected: UsuarioConRol[], newRole: UserRole) => {
    const ids        = selected.map((u) => u.id);
    const savedRoles = selected.map((u) => ({ id: u.id, role: u.role }));

    // Actualización optimista
    setData((curr) => curr.map((u) => ids.includes(u.id) ? { ...u, role: newRole } : u));

    toast.promise(
      (async () => {
        try {
          await updateUsersRole(ids, newRole);
          return selected.length;
        } catch (e) {
          // Revertir si falla
          setData((curr) =>
            curr.map((u) => {
              const saved = savedRoles.find((s) => s.id === u.id);
              return saved ? { ...u, role: saved.role } : u;
            })
          );
          throw e;
        }
      })(),
      {
        loading: "Actualizando roles...",
        success: (n: number) => {
          log({ action: "cambiar_rol_masivo", entity: "usuario", detail: `${n} usuario${n !== 1 ? "s" : ""} asignados a "${newRole}"` });
          return `${n} usuario${n !== 1 ? "s" : ""} actualizado${n !== 1 ? "s" : ""} a "${newRole}"`;
        },
        error:   (e: any) => e instanceof Error ? e.message : "Error al actualizar roles",
      }
    );
  };

  /* ── Cambiar rol ───────────────────────────────────────────────────── */
  const handleUpdate = async (rowIndex: number, columnId: string, value: any) => {
    if (columnId !== "role") return;

    const user = data[rowIndex];
    if (!user) return;

    const prevRole = user.role;

    // Actualización optimista
    setData((prev) =>
      prev.map((u, i) => (i === rowIndex ? { ...u, role: value } : u))
    );

    try {
      await updateUserRole(user.id, value as UserRole);
      log({ action: "cambiar_rol", entity: "usuario", entityId: user.id, detail: `Rol de ${user.full_name ?? user.email} cambiado a "${value}"` });
      toast.success(`Rol de ${user.full_name ?? user.email} actualizado a "${value}"`);
    } catch {
      // Revertir si falla
      setData((prev) =>
        prev.map((u, i) => (i === rowIndex ? { ...u, role: prevRole } : u))
      );
      toast.error("Error al actualizar el rol");
    }
  };

  return (
    <DataTable<UsuarioConRol>
      data={data}
      columns={columns}
      editableColumns={[
        {
          key:        "role",
          type:       "select",
          searchable: true,
          options:    ROLE_OPTIONS,
          labelKey:   "label",
          valueKey:   "value",
        },
      ]}
      onUpdate={handleUpdate}
      onBulkDelete={handleBulkDelete}
      bulkActions={(rows) => [
        { label: "→ Viewer",  onClick: (sel) => handleBulkRoleUpdate(sel, "viewer"),  variant: "outline" },
        { label: "→ Manager", onClick: (sel) => handleBulkRoleUpdate(sel, "manager"), variant: "outline" },
        { label: "→ Admin",   onClick: (sel) => handleBulkRoleUpdate(sel, "admin"),   variant: "outline" },
      ]}
      rowActions={(row) => [
        {
          label:   "Eliminar",
          onClick: () => handleDelete(row),
          variant: "danger",
        },
      ]}
      pageSize={20}
    />
  );
}
