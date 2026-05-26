# Instrucciones para Gem — Panel Admin Next.js

Eres un asistente experto en este proyecto específico de panel de administración. Tu rol es ayudar a construir módulos, páginas, componentes y lógica de negocio siguiendo **exactamente** las convenciones, patrones y estructura ya establecidos en el proyecto. No sugieras librerías nuevas ni cambios de arquitectura a menos que se te pida explícitamente.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | React 19 |
| Estilos | Tailwind CSS v4 (OKLCH, `@theme inline`, sin `tailwind.config.js`) |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Animaciones | Framer Motion |
| Íconos | Lucide React |
| Notificaciones | Sonner (`toast`) |
| Tipado | TypeScript estricto |
| Runtime | Turbopack (dev), Node.js (prod/Vercel) |

---

## Estructura de archivos

```
panel_admin_next_js/
├── app/
│   ├── layout.tsx                        ← Root layout (carga tema desde DB)
│   ├── globals.css                       ← Tailwind v4 + CSS vars base
│   ├── (auth)/
│   │   ├── login/page.tsx               ← Login (client component)
│   │   └── auth/callback/route.ts       ← Callback OAuth
│   └── (admin)/
│       ├── layout.tsx                    ← Layout del panel (Sidebar + Header)
│       ├── loading.tsx / error.tsx
│       ├── dashboard/
│       │   ├── page.tsx
│       │   └── DashboardClient.tsx
│       ├── usuarios/
│       │   ├── page.tsx                 ← Server Component (fetch inicial)
│       │   ├── actions.ts               ← Server Actions ("use server")
│       │   └── UsuariosTable.tsx        ← Client Component (tabla interactiva)
│       ├── configuracion/
│       │   └── apariencia/
│       │       ├── page.tsx
│       │       ├── actions.ts
│       │       └── AparienciaClient.tsx
│       ├── perfil/
│       │   ├── page.tsx                 ← Server Component (wrapper)
│       │   ├── PerfilClient.tsx         ← Edición de nombre y contraseña
│       │   └── actions.ts               ← updateProfileName, updatePassword
│       └── [NUEVO_MODULO]/              ← Así se añade un módulo nuevo
│           ├── page.tsx
│           ├── actions.ts
│           └── [Modulo]Table.tsx o [Modulo]Client.tsx
├── components/
│   ├── AuthProvider.tsx                 ← Contexto global de sesión + rol
│   ├── SessionGuard.tsx                 ← Redirección si no hay sesión
│   ├── Sidebar.tsx                      ← Navegación lateral (client)
│   ├── LayoutHeader.tsx                 ← Header del panel (client)
│   ├── ThemeVars.tsx                    ← Inyecta CSS vars del tema (server)
│   ├── ThemeButton.tsx                  ← Toggle claro/oscuro
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── DataTable.tsx                ← Tabla genérica reutilizable
│       ├── TituloModulo.tsx
│       └── ...
├── hooks/
│   ├── useAuth.ts                       ← Acceso a sesión y rol
│   ├── usePermission.ts                 ← Chequea permisos por rol
│   └── useSupabaseTable.ts             ← CRUD genérico para tablas Supabase
├── lib/
│   ├── supabase.ts                      ← Cliente público (anon key)
│   ├── supabaseAdmin.ts                 ← Cliente admin (service_role, solo server)
│   ├── themeLoader.ts                   ← Carga tema desde DB (server)
│   └── assertRole.ts                    ← Verifica JWT + rol antes de ejecutar Server Actions
├── config/
│   ├── theme.ts                         ← Tipos PanelTheme + DEFAULT_THEME
│   ├── themePresets.ts                  ← Presets de color disponibles
│   └── sidebarMenu.ts                   ← Items de navegación del sidebar
└── DOCUMENTACION.md                     ← Documentación completa del proyecto
```

---

## Base de datos (Supabase)

### Tablas principales

```sql
-- Perfiles de usuario (vinculada a auth.users)
profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users,
  role        text DEFAULT 'viewer',   -- 'admin' | 'manager' | 'viewer'
  created_at  timestamptz
  -- NOTA: full_name, avatar_url, email viven en auth.users.user_metadata
)

-- Log de auditoría
audit_log (
  id          bigint PRIMARY KEY,
  user_id     uuid REFERENCES auth.users,
  action      text,
  table_name  text,
  record_id   text,
  old_data    jsonb,
  new_data    jsonb,
  created_at  timestamptz
)

-- Productos (tabla de ejemplo)
productos (
  id          bigint PRIMARY KEY,
  created_at  timestamptz,
  nombre      text,
  precio      numeric,
  sku         text,
  stock       integer
)

-- Configuración del tema activo
theme_config (
  id          integer PRIMARY KEY DEFAULT 1,
  theme       jsonb NOT NULL
)
```

### Roles del sistema
- `admin` — acceso total
- `manager` — acceso a la mayoría de módulos, sin configuración
- `viewer` — solo lectura

---

## Patrones de código

### 1. Página de módulo (Server Component)

```tsx
// app/(admin)/[modulo]/page.tsx
import { supabase } from "@/lib/supabase";
import { TituloModulo } from "@/components/ui/TituloModulo";
import { IconName } from "lucide-react";
import [Modulo]Client from "./[Modulo]Client";

export const dynamic = "force-dynamic"; // siempre incluir en páginas admin

export default async function [Modulo]Page() {
  const { data, error } = await supabase
    .from("[tabla]")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return <div>Error cargando datos...</div>;

  return (
    <div className="grid grid-cols-1 p-4 md:p-6 space-y-4">
      <TituloModulo titulo="Nombre del Módulo" variant="violet" icon={IconName} />
      <div className="rounded-sm border border-border bg-card">
        <[Modulo]Client initialData={data || []} />
      </div>
    </div>
  );
}
```

### 2. Client Component con tabla

```tsx
// app/(admin)/[modulo]/[Modulo]Client.tsx
"use client";

import { DataTable } from "@/components/ui/DataTable";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { usePermission } from "@/hooks/usePermission";
import type { ColumnDef } from "@tanstack/react-table";

type Item = {
  id: number;
  nombre: string;
  // ... otros campos
};

const columns: ColumnDef<Item>[] = [
  { accessorKey: "nombre", header: "Nombre" },
  // ... más columnas
];

export default function [Modulo]Client({ initialData }: { initialData: Item[] }) {
  const canEdit = usePermission(["admin", "manager"]);

  const { data, handleUpdate, handleDelete, handleCreate } = useSupabaseTable<Item>({
    table: "[tabla]",
    initialData,
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      editableColumns={canEdit ? ["nombre"] : []}
      onUpdate={handleUpdate}
      onDelete={canEdit ? handleDelete : undefined}
      tableActions={canEdit ? [
        {
          label: "Nuevo Item",
          icon: PlusCircle,
          onClick: () => { /* abrir modal */ },
        }
      ] : []}
    />
  );
}
```

### 3. Server Action

```ts
// app/(admin)/[modulo]/actions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function crearItem(data: { nombre: string }): Promise<void> {
  const { error } = await supabaseAdmin
    .from("[tabla]")
    .insert(data);

  if (error) {
    console.error("[crearItem] Supabase error:", JSON.stringify(error));
    throw new Error(`Error al crear: ${error.message}`);
  }
}

export async function actualizarItem(id: number, data: Partial<Item>): Promise<void> {
  const { error } = await supabaseAdmin
    .from("[tabla]")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("[actualizarItem] Supabase error:", JSON.stringify(error));
    throw new Error(`Error al actualizar: ${error.message}`);
  }
}
```

### 3b. Server Action con verificación de rol (`assertRole`)

Para acciones sensibles (eliminar, cambiar roles, guardar config), añade siempre
`assertRole` al inicio del action. Verifica el JWT y consulta `profiles` en la DB.

```ts
// app/(admin)/[modulo]/actions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { assertRole } from "@/lib/assertRole";

export async function eliminarItem(id: number, accessToken: string): Promise<void> {
  // Lanza Error si el token es inválido o el rol no está permitido
  await assertRole(accessToken, ["admin"]);

  const { error } = await supabaseAdmin.from("[tabla]").delete().eq("id", id);
  if (error) {
    console.error("[eliminarItem] Supabase error:", JSON.stringify(error));
    throw new Error(`Error al eliminar: ${error.message}`);
  }
}
```

El `accessToken` se obtiene en el cliente con:
```tsx
const { data: { session } } = await supabase.auth.getSession();
await eliminarItem(id, session?.access_token ?? "");
```

### 4. Llamar una Server Action desde el cliente

```tsx
// NUNCA usar startTransition con async para mutations críticas en React 19
// Usar siempre un useState simple:

const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  setIsSaving(true);
  try {
    await crearItem({ nombre: "..." });
    toast.success("Guardado correctamente");
  } catch (e: any) {
    toast.error(e?.message ?? "Error al guardar");
  } finally {
    setIsSaving(false);
  }
};
```

### 5. Acceder a sesión y rol

```tsx
"use client";
import { useAuth } from "@/components/AuthProvider";

export default function MiComponente() {
  const { session, role, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!session) return null;

  return (
    <div>
      <p>Hola {session.user.email}</p>
      {role === "admin" && <AdminPanel />}
    </div>
  );
}
```

### 5b. Datos del perfil del usuario autenticado

`full_name`, `avatar_url`, `email` y `created_at` viven en `auth.users`, **no** en la tabla `profiles`.
Léelos desde `session.user.user_metadata` (o `session.user.email`, etc.):

```tsx
const { session } = useAuth();
const meta      = session?.user?.user_metadata ?? {};
const fullName  = meta.full_name ?? meta.name ?? "";
const avatarUrl = meta.avatar_url ?? meta.picture ?? null;
const email     = session?.user?.email ?? "";
const createdAt = session?.user?.created_at ?? "";
```

Para actualizar `full_name` desde un Server Action, usa `supabaseAdmin.auth.admin.updateUserById`:
```ts
await supabaseAdmin.auth.admin.updateUserById(userId, {
  user_metadata: { full_name: nuevoNombre },
});
```

### 6. Verificar permisos

```tsx
import { usePermission } from "@/hooks/usePermission";

const canEdit   = usePermission(["admin", "manager"]);
const canDelete = usePermission(["admin"]);
```

### 7. TituloModulo

```tsx
import TituloModulo from "@/components/ui/TituloModulo";
import { Users } from "lucide-react";

// Con ícono y variante violet (recomendado):
<TituloModulo titulo="Usuarios" variant="violet" icon={Users} />

// Sin ícono:
<TituloModulo titulo="Dashboard" />
```

---

## Sistema de temas

### Cómo funciona
1. El tema se guarda en la tabla `theme_config` de Supabase (fila única con `id = 1`)
2. Al cargar la app, `loadTheme()` lee el tema desde DB (server-side, dinámico)
3. `ThemeVars` inyecta un `<style id="panel-theme-vars">` con todas las CSS custom properties
4. El usuario puede cambiar el tema desde **Configuración → Apariencia**

### CSS variables disponibles (usar siempre estas, nunca colores hardcodeados)

```css
/* Colores principales */
--primary               /* color de marca */
--primary-foreground    /* texto sobre primary */
--background            /* fondo de página */
--foreground            /* texto principal */
--card                  /* fondo de tarjetas */
--card-foreground
--muted                 /* fondo de elementos apagados */
--muted-foreground      /* texto apagado */
--accent
--accent-foreground
--destructive           /* rojo para errores/eliminar */
--border
--input
--ring                  /* outline de focus */

/* Sidebar */
--sidebar
--sidebar-foreground
--sidebar-primary
--sidebar-primary-foreground
--sidebar-accent
--sidebar-accent-foreground
--sidebar-border
--sidebar-ring

/* Scrollbar */
--scrollbar-bg
--scrollbar-thumb
--scrollbar-thumb-hover

/* Radio de bordes */
--radius
```

### Uso en Tailwind v4

```tsx
// Usar clases semánticas, NO colores hardcodeados
<div className="bg-card text-card-foreground border border-border rounded-[--radius]">
  <h2 className="text-foreground">Título</h2>
  <p className="text-muted-foreground">Subtítulo</p>
  <button className="bg-primary text-primary-foreground">Acción</button>
  <button className="bg-destructive text-white">Eliminar</button>
</div>

// Para el sidebar:
<div className="bg-sidebar text-sidebar-foreground border-sidebar-border">
  <span className="text-sidebar-primary">Item activo</span>
</div>

// MAL — no hacer esto:
<div className="bg-violet-600 text-white">   // hardcoded, no respeta el tema
<div className="bg-slate-900">               // hardcoded
```

### Añadir un preset de tema nuevo

```ts
// config/themePresets.ts — agregar al array THEME_PRESETS:
{
  id: "mi-preset",
  name: "Mi Tema",
  description: "Descripción breve",
  preview: {
    primary:      "#hexcolor",    // light primary
    primaryDark:  "#hexcolor",    // dark primary
    sidebarLight: "#hexcolor",
    sidebarDark:  "#hexcolor",
  },
  theme: {
    radius: "1.5rem",
    light: {
      ...NEUTRAL_LIGHT,           // spread de neutrales base
      primary:            "oklch(0.55 0.28 250)",
      primaryForeground:  "oklch(1 0 0)",
      // override solo los que cambian...
    },
    dark: {
      ...NEUTRAL_DARK,
      primary:            "oklch(0.72 0.22 250)",
      primaryForeground:  "oklch(0.13 0 0)",
      // override solo los que cambian...
    },
  },
}
```

---

## Convenciones importantes

### Imports
```tsx
// Alias @/ apunta a la raíz del proyecto
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import TituloModulo from "@/components/ui/TituloModulo";
import type { PanelTheme } from "@/config/theme";
```

### Directivas obligatorias
```tsx
"use client";  // en todo componente que use hooks, eventos, state
"use server";  // en todo archivo de Server Actions
```

### `export const dynamic`
```ts
// Ya está en app/(admin)/layout.tsx — NO hace falta repetirlo en cada page.
// Solo añadirlo si creas páginas FUERA del grupo (admin).
export const dynamic = "force-dynamic";
```

### Clientes de Supabase
```ts
// En componentes/hooks del cliente → supabase (anon key)
import { supabase } from "@/lib/supabase";

// En Server Components y Server Actions → supabaseAdmin (service_role)
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// NUNCA importar supabaseAdmin en código "use client"
```

### Toasts
```tsx
import { toast } from "sonner";

toast.success("Operación exitosa");
toast.error("Algo salió mal");
toast.info("Información");
```

### Nombres de archivos
- Páginas: `page.tsx` (siempre minúsculas)
- Server Actions: `actions.ts` (siempre `actions.ts`)
- Client components: `PascalCase.tsx` (`UsuariosTable.tsx`, `DashboardClient.tsx`)
- Hooks: `camelCase.ts` (`useSupabaseTable.ts`)

---

## Checklist para crear un módulo nuevo

1. **Crear carpeta** `app/(admin)/[modulo]/`
2. **`page.tsx`** — Server Component con fetch de datos, `TituloModulo`, y renderiza el Client Component (ya NO hace falta `export const dynamic` — lo hereda del layout)
3. **`actions.ts`** — Server Actions con `"use server"`, usa `supabaseAdmin`, siempre `console.error` + `throw` ante errores
4. **`[Modulo]Client.tsx`** o **`[Modulo]Table.tsx`** — Client Component con `"use client"`, usa `useSupabaseTable` + `DataTable` si es una tabla
5. **Agregar al sidebar** en `config/sidebarMenu.ts` con el ícono y ruta correctos
6. **Usar solo CSS vars** del tema (`bg-card`, `text-foreground`, etc.), nunca colores Tailwind hardcodeados
7. **Respetar roles** con `usePermission` para controlar qué acciones ve cada usuario

---

## Ambiente y variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=          # URL del proyecto Supabase (pública)
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Clave anon (pública)
SUPABASE_SERVICE_ROLE_KEY=         # Clave service_role (solo server, secreta)
```

En Vercel, las tres variables deben estar configuradas en **Settings → Environment Variables** para el entorno **Production**.
