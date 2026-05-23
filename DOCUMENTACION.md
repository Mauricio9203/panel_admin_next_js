# Panel Admin — Documentación Completa

> Guía paso a paso para instalar, configurar y extender el panel admin desde cero.

---

## Índice

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Instalación inicial](#2-instalación-inicial)
3. [Configuración de Supabase](#3-configuración-de-supabase)
   - 3.1 Crear el proyecto
   - 3.2 Tablas SQL
   - 3.3 Row Level Security (RLS)
   - 3.4 Trigger de auto-registro
   - 3.5 Configuración de Auth
4. [Configuración de Google OAuth](#4-configuración-de-google-oauth)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Estructura del proyecto](#6-estructura-del-proyecto)
7. [Sistema de autenticación](#7-sistema-de-autenticación)
8. [Sistema de permisos (RBAC)](#8-sistema-de-permisos-rbac)
9. [DataTable — Guía completa](#9-datatable--guía-completa)
10. [Cómo crear un módulo nuevo](#10-cómo-crear-un-módulo-nuevo)
11. [Log de auditoría](#11-log-de-auditoría)
12. [Gestión de usuarios](#12-gestión-de-usuarios)
13. [Referencia rápida de hooks](#13-referencia-rápida-de-hooks)

---

## 1. Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 15+ (App Router) | Framework principal |
| React | 19+ | UI |
| TypeScript | 5+ | Tipado |
| Supabase | 2+ | Base de datos + Auth |
| Tailwind CSS | 3+ | Estilos |
| TanStack Table | 8+ | Tablas |
| Framer Motion | 11+ | Animaciones |
| Sonner | — | Toasts |
| next-themes | — | Dark/light mode |
| lucide-react | — | Iconos |
| xlsx | — | Exportación Excel |
| @radix-ui/react-portal | — | Portales (select en tablas) |

---

## 2. Instalación inicial

### 2.1 Clonar e instalar dependencias

```bash
git clone <tu-repositorio>
cd panel_admin_next_js
npm install
```

### 2.2 Crear archivo de entorno

Crea un archivo `.env.local` en la raíz del proyecto (ver [sección 5](#5-variables-de-entorno) para el contenido completo).

### 2.3 Levantar el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.

---

## 3. Configuración de Supabase

### 3.1 Crear el proyecto

1. Ve a [supabase.com](https://supabase.com) e inicia sesión.
2. Haz clic en **New project**.
3. Elige un nombre, contraseña de base de datos y región.
4. Espera a que el proyecto termine de inicializarse (~1-2 minutos).
5. Ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **nunca expongas esta clave en el cliente**

---

### 3.2 Tablas SQL

Ve a **SQL Editor** en el dashboard de Supabase y ejecuta los siguientes scripts **en orden**.

---

#### Tabla `profiles`

Almacena el rol y datos adicionales de cada usuario autenticado.

```sql
CREATE TABLE public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'viewer'
                          CHECK (role IN ('admin', 'manager', 'viewer')),
  full_name   text,
  avatar_url  text,
  updated_at  timestamptz DEFAULT now()
);
```

---

#### Tabla `audit_log`

Registra todas las acciones relevantes del panel.

```sql
CREATE TABLE public.audit_log (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email  text        NOT NULL,
  action      text        NOT NULL,
  entity      text        NOT NULL,
  entity_id   text,
  detail      text,
  created_at  timestamptz DEFAULT now() NOT NULL
);
```

---

#### Tabla de ejemplo: `productos`

Si vas a usar el módulo de productos incluido, crea también esta tabla:

```sql
CREATE TABLE public.productos (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre      text        NOT NULL,
  precio      numeric     NOT NULL DEFAULT 0,
  categoria   text,
  stock       integer     NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Datos de prueba (opcional)
INSERT INTO public.productos (nombre, precio, categoria, stock) VALUES
  ('Laptop Pro',     1299.99, 'Electrónica',  15),
  ('Mouse Inalámbrico', 29.99, 'Accesorios', 120),
  ('Teclado Mecánico',  89.99, 'Accesorios',  45),
  ('Monitor 4K',      499.99, 'Electrónica',   8),
  ('Auriculares BT',   79.99, 'Audio',         60);
```

---

### 3.3 Row Level Security (RLS)

Ejecuta cada bloque por separado en el SQL Editor.

#### RLS para `profiles`

```sql
-- Activar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios autenticados pueden leer su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Los usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

> Las operaciones de admin (leer todos los perfiles, cambiar roles, eliminar usuarios)
> se realizan desde el servidor con la `service_role` key que **bypasea** RLS.
> Por eso no necesitamos políticas de admin en esta tabla.

---

#### RLS para `audit_log`

```sql
-- Activar RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer el log
CREATE POLICY "Admins can view audit logs"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Usuarios autenticados pueden insertar sus propias entradas
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

#### RLS para `productos` (si la usas)

```sql
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Todos los autenticados pueden leer
CREATE POLICY "Authenticated can read productos"
  ON public.productos FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins y managers pueden modificar
CREATE POLICY "Admins and managers can modify productos"
  ON public.productos FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );
```

---

### 3.4 Trigger de auto-registro

Cuando un usuario se registra (Google u email), este trigger crea automáticamente su fila en `profiles` con rol `viewer`.

**Paso 1 — Crear la función** (ejecutar solo este bloque):

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Paso 2 — Crear el trigger** (ejecutar en un bloque separado):

```sql
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

> ⚠️ **Importante:** ejecuta ambos bloques por separado en el SQL Editor.
> Si los pones juntos, Supabase lanzará un error de sintaxis.

---

### 3.5 Configuración de Auth en Supabase

#### URL de redirección

Ve a **Authentication → URL Configuration** y configura:

| Campo | Valor |
|---|---|
| Site URL | `http://localhost:3000` (desarrollo) / tu dominio en producción |
| Redirect URLs | `http://localhost:3000/**` |

> En producción agrega también `https://tudominio.com/**`

#### Habilitar confirmación de email (opcional)

Ve a **Authentication → Email Templates** para personalizar los correos de confirmación y recuperación de contraseña.

Si quieres desactivar la confirmación de email durante desarrollo:
**Authentication → Providers → Email** → desactiva **Confirm email**.

---

## 4. Configuración de Google OAuth

### 4.1 Crear proyecto en Google Cloud Console

1. Ve a [console.cloud.google.com](https://console.cloud.google.com).
2. Haz clic en el selector de proyectos (parte superior) → **New Project**.
3. Ponle un nombre y haz clic en **Create**.

### 4.2 Habilitar la API de Google

1. En el menú lateral, ve a **APIs & Services → Library**.
2. Busca **"Google+ API"** o **"Google Identity"** y habilítala.

### 4.3 Configurar la pantalla de consentimiento OAuth

1. Ve a **APIs & Services → OAuth consent screen**.
2. Selecciona **External** → **Create**.
3. Completa los campos obligatorios:
   - **App name**: el nombre de tu panel
   - **User support email**: tu email
   - **Developer contact**: tu email
4. En **Scopes**, agrega: `email`, `profile`, `openid`.
5. Guarda y continúa hasta el final.

### 4.4 Crear credenciales OAuth 2.0

1. Ve a **APIs & Services → Credentials**.
2. Haz clic en **Create Credentials → OAuth client ID**.
3. Selecciona **Web application**.
4. En **Authorized redirect URIs**, agrega la URI de callback de Supabase:

```
https://TU_PROJECT_REF.supabase.co/auth/v1/callback
```

> Reemplaza `TU_PROJECT_REF` con el ID de tu proyecto Supabase.
> Lo encuentras en **Project Settings → General → Reference ID**.

5. Haz clic en **Create**.
6. Copia el **Client ID** y el **Client Secret** que aparecen.

### 4.5 Conectar Google con Supabase

1. Ve a tu proyecto Supabase → **Authentication → Providers → Google**.
2. Activa el toggle **Enable Google provider**.
3. Pega el **Client ID** y **Client Secret** de Google Cloud.
4. Guarda los cambios.

### 4.6 Verificar el flujo

Levanta el servidor de desarrollo y haz clic en "Continuar con Google" en `/login`. Debería redirigirte a Google y volver al dashboard.

---

## 5. Variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# ─── Supabase ───────────────────────────────────────────────
# URL pública del proyecto (visible en el cliente)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co

# Clave anónima (visible en el cliente — solo permisos limitados)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clave de servicio (SOLO servidor — nunca expongas con NEXT_PUBLIC_)
# Tiene acceso total a la base de datos, bypasea RLS
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca** agregues `NEXT_PUBLIC_` al `SUPABASE_SERVICE_ROLE_KEY`.
> Esta clave solo debe usarse en Server Actions o Server Components.

---

## 6. Estructura del proyecto

```
panel_admin_next_js/
│
├── app/
│   ├── (admin)/                    # Rutas protegidas del panel
│   │   ├── layout.tsx              # Layout con sidebar y header
│   │   ├── error.tsx               # Error boundary del área admin
│   │   ├── not-found.tsx           # 404 dentro del área admin
│   │   ├── dashboard/
│   │   ├── usuarios/               # Módulo de gestión de usuarios
│   │   ├── auditoria/              # Log de auditoría
│   │   └── tablas/                 # Módulos de ejemplo con DataTable
│   │
│   ├── (auth)/                     # Rutas públicas de autenticación
│   │   └── login/
│   │       └── page.tsx            # Login + registro + recuperar contraseña
│   │
│   ├── auth/
│   │   ├── callback/               # Callback de OAuth (Google)
│   │   └── update-password/        # Página de nueva contraseña (reset)
│   │
│   ├── api/                        # API Routes de Next.js (si las necesitas)
│   ├── globals.css
│   ├── layout.tsx                  # Root layout (providers globales)
│   ├── not-found.tsx               # 404 global (sin sidebar)
│   └── page.tsx                    # Redirige a /dashboard o /login
│
├── components/
│   ├── AuthProvider.tsx            # Contexto de sesión y rol
│   ├── SessionGuard.tsx            # Protección de rutas + inactividad
│   ├── Sidebar.tsx                 # Navegación lateral
│   ├── LayoutHeader.tsx            # Header superior
│   ├── ToasterProvider.tsx         # Proveedor de toasts (Sonner)
│   └── ui/
│       ├── DataTable.tsx           # Componente principal de tabla
│       ├── DataTable/
│       │   ├── DataTableBody.tsx   # Cuerpo + EditableCell
│       │   ├── DataTableHeader.tsx
│       │   ├── DataTableFilter.tsx
│       │   ├── DataTablePagination.tsx
│       │   ├── DataTableToolbar.tsx
│       │   ├── DataTableRowActions.tsx
│       │   ├── DataTablePortal.tsx
│       │   ├── InlineCellSelect.tsx # Select con búsqueda para celdas
│       │   └── useDataTable.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── SearchableSelect.tsx    # Select con búsqueda (para formularios)
│       └── ...
│
├── config/
│   ├── sidebarMenu.jsx             # Definición del menú lateral
│   └── permissions.ts             # Mapa de permisos por rol
│
├── hooks/
│   ├── useAuditLog.ts             # Hook para registrar acciones
│   ├── usePermission.ts           # Hook para verificar permisos
│   ├── useSupabaseTable.ts        # Hook CRUD para tablas Supabase
│   ├── useServerTable.ts          # Hook para tablas server-side
│   └── useIdleTimer.ts            # Timer de inactividad
│
├── lib/
│   ├── supabase.ts                # Cliente Supabase (browser)
│   └── supabaseAdmin.ts           # Cliente Supabase (server, service role)
│
└── .env.local                     # Variables de entorno (no commitear)
```

---

## 7. Sistema de autenticación

### Flujos disponibles

| Flujo | Descripción |
|---|---|
| Google OAuth | Clic en "Continuar con Google" → redirect → callback → dashboard |
| Email/Password | Registro con confirmación de email + inicio de sesión |
| Recuperar contraseña | Email con enlace → `/auth/update-password` → nueva contraseña |

### Cómo funciona internamente

1. **`AuthProvider`** (`components/AuthProvider.tsx`): envuelve toda la app. Escucha cambios de sesión con `supabase.auth.onAuthStateChange`. Al detectar sesión activa, lee el rol desde `profiles`.

2. **`SessionGuard`** (`components/SessionGuard.tsx`): revisa en cada cambio de ruta si hay sesión activa. Si no hay sesión y la ruta no es pública, redirige a `/login`. También gestiona el cierre automático por inactividad (15 min con modal de aviso).

3. **Rutas públicas**: definidas en `SessionGuard.tsx`:
   ```ts
   const PUBLIC_PATHS = ["/login", "/auth"];
   ```
   Cualquier ruta que empiece con estos prefijos no requiere sesión.

4. **Callback de OAuth** (`app/auth/callback/page.tsx`): intercambia el `code` de la URL por una sesión real usando `supabase.auth.exchangeCodeForSession(code)`. Luego redirige al dashboard.

5. **Reset de contraseña** (`app/auth/update-password/page.tsx`): el enlace del correo llega con un `code`. La página lo intercambia por sesión, muestra el formulario y llama a `supabase.auth.updateUser({ password })`.

### Obtener la sesión y el rol en cualquier componente

```tsx
import { useAuth } from "@/components/AuthProvider";

function MiComponente() {
  const { session, role, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!session) return null;

  return <p>Hola, {session.user.email} — rol: {role}</p>;
}
```

---

## 8. Sistema de permisos (RBAC)

El panel tiene tres niveles de control de acceso:

### Nivel 1 — Módulos (qué páginas ve cada rol)

Configurado en `config/sidebarMenu.jsx`. Cada ítem tiene un array `roles` que define quién puede verlo:

```jsx
// config/sidebarMenu.jsx
export const menuItems = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    icon:  LayoutDashboard,
    roles: ["admin", "manager", "viewer"], // todos lo ven
  },
  {
    label: "Usuarios",
    href:  "/usuarios",
    icon:  Users,
    roles: ["admin"],                      // solo admins
  },
  {
    label: "Reportes",
    href:  "/reportes",
    icon:  BarChart,
    roles: ["admin", "manager"],           // admins y managers
  },
];
```

El `Sidebar` filtra automáticamente los ítems según el rol del usuario logueado.

### Nivel 2 — Submódulos (secciones dentro de una página)

Usa directamente el rol del contexto:

```tsx
const { role } = useAuth();

return (
  <div>
    {role === "admin" && <SeccionSoloAdmin />}
    {(role === "admin" || role === "manager") && <SeccionAdminManager />}
  </div>
);
```

### Nivel 3 — Acciones (crear, editar, eliminar, exportar)

Configurado en `config/permissions.ts`:

```ts
// config/permissions.ts
export type Action = "crear" | "editar" | "eliminar" | "exportar";

export const PERMISSIONS: Record<UserRole, Action[]> = {
  admin:   ["crear", "editar", "eliminar", "exportar"],
  manager: ["crear", "editar", "exportar"],
  viewer:  [],
};
```

Para usarlo en un componente, usa el hook `usePermission`:

```tsx
import { usePermission } from "@/hooks/usePermission";

function MiTabla() {
  const canCrear    = usePermission("crear");
  const canEditar   = usePermission("editar");
  const canEliminar = usePermission("eliminar");
  const canExportar = usePermission("exportar");

  return (
    <DataTable
      // Pasa canEditar como editableColumns solo si tiene permiso
      editableColumns={canEditar ? ["nombre", "precio"] : []}
      tableActions={[
        canCrear    && { label: "Nuevo", onClick: handleNuevo },
        canExportar && { label: "Exportar", onClick: handleExportar },
      ].filter(Boolean)}
    />
  );
}
```

### Agregar un nuevo rol

1. Edita `components/AuthProvider.tsx` y agrega el nuevo rol al tipo:
   ```ts
   export type UserRole = "admin" | "manager" | "viewer" | "supervisor";
   ```

2. Edita `config/permissions.ts` y agrega sus permisos:
   ```ts
   export const PERMISSIONS: Record<UserRole, Action[]> = {
     admin:      ["crear", "editar", "eliminar", "exportar"],
     manager:    ["crear", "editar", "exportar"],
     supervisor: ["editar", "exportar"],
     viewer:     [],
   };
   ```

3. Actualiza el `CHECK` constraint en Supabase:
   ```sql
   ALTER TABLE public.profiles
   DROP CONSTRAINT profiles_role_check;

   ALTER TABLE public.profiles
   ADD CONSTRAINT profiles_role_check
   CHECK (role IN ('admin', 'manager', 'supervisor', 'viewer'));
   ```

4. Actualiza la pantalla de usuarios (`UsuariosTable.tsx`) para incluir la nueva opción en el select.

---

## 9. DataTable — Guía completa

El `DataTable` es el componente central para mostrar y editar datos. Soporta dos modos:
- **Client-side**: datos ya cargados en el cliente (tablas pequeñas/medianas).
- **Server-side**: paginación, filtros y ordenamiento manejados por Supabase (tablas grandes).

### 9.1 Props disponibles

```ts
<DataTable<TData>
  // ── Obligatorios ──────────────────────────────────────────────
  data={filas}                    // TData[] — arreglo de datos
  columns={columnas}              // ColumnDef<TData>[] — definición de columnas

  // ── Edición inline ────────────────────────────────────────────
  editableColumns={[...]}         // columnas editables (ver 9.3)
  onUpdate={handleUpdate}         // (rowIndex, columnId, value) => void

  // ── Acciones de fila ──────────────────────────────────────────
  rowActions={(row) => [...]}     // acciones del menú por fila (ver 9.4)
  onRowClick={(row) => ...}       // clic en fila completa

  // ── Acciones masivas ──────────────────────────────────────────
  bulkActions={(rows) => [...]}   // botones cuando hay filas seleccionadas
  onBulkDelete={(rows) => ...}    // botón rojo de eliminar selección

  // ── Toolbar ───────────────────────────────────────────────────
  tableActions={[...]}            // botones en la barra superior (ver 9.5)

  // ── Paginación y estado ───────────────────────────────────────
  pageSize={10}                   // filas por página (default: 10)
  loading={false}                 // muestra skeleton mientras carga

  // ── Server-side (usar con useServerTable) ─────────────────────
  serverSide={true}
  pageCount={totalPages}
  totalCount={totalRows}
  fetchAllRows={fetchTodo}        // async () => TData[] para exportar todo
  pagination={pagination}
  onPaginationChange={setPagination}
  sorting={sorting}
  onSortingChange={setSorting}
  columnFilters={filters}
  onColumnFiltersChange={setFilters}
/>
```

---

### 9.2 Definir columnas

```ts
import { ColumnDef } from "@tanstack/react-table";

type Producto = {
  id:       number;
  nombre:   string;
  precio:   number;
  categoria: string;
};

const columns: ColumnDef<Producto>[] = [
  {
    accessorKey: "nombre",
    header:      "Nombre",
  },
  {
    accessorKey: "precio",
    header:      "Precio",
    cell: ({ row }) => (
      <span>${row.getValue<number>("precio").toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "categoria",
    header:      "Categoría",
  },
];
```

---

### 9.3 Columnas editables (`editableColumns`)

Convierte una celda en un campo editable. Hay tres variantes:

#### Texto libre

```ts
editableColumns={["nombre", "precio"]}
```

Renderiza un `<input>` que guarda al perder el foco o al presionar Enter.

#### Select con opciones fijas (pocos ítems)

Para listas cortas y fijas (roles, estados, categorías predefinidas).
Usa el `<select>` nativo del navegador — más compacto y sin overhead.

```ts
editableColumns={[
  {
    key:      "estado",
    type:     "select",
    options:  [
      { value: "activo",   label: "Activo"   },
      { value: "inactivo", label: "Inactivo" },
      { value: "pendiente", label: "Pendiente" },
    ],
    valueKey: "value",
    labelKey: "label",
  },
]}
```

#### Select con búsqueda (muchos ítems / claves foráneas)

Para listas largas (categorías, países, clientes, etc.) donde el usuario
necesita filtrar para encontrar la opción. Usa un dropdown con portal y
buscador integrado que nunca se corta por el `overflow` de la tabla.

```ts
editableColumns={[
  {
    key:        "categoria_id",
    type:       "select",
    searchable: true,           // ← activa el dropdown con búsqueda
    options:    categorias,     // [{ id: "uuid", nombre: "Electrónica" }, ...]
    valueKey:   "id",
    labelKey:   "nombre",
  },
]}
```

#### Recibir los cambios con `onUpdate`

```ts
const handleUpdate = async (rowIndex: number, columnId: string, value: any) => {
  const item = data[rowIndex];

  // Actualización optimista
  setData(prev => prev.map((row, i) => i === rowIndex ? { ...row, [columnId]: value } : row));

  const { error } = await supabase
    .from("productos")
    .update({ [columnId]: value })
    .eq("id", item.id);

  if (error) {
    // Revertir si falla
    setData(prev => prev.map((row, i) => i === rowIndex ? { ...row, [columnId]: item[columnId] } : row));
    toast.error("Error al guardar");
  }
};
```

---

### 9.4 Acciones de fila (`rowActions`)

Cada fila puede tener un menú de acciones (botón `⋯` al final de la fila):

```ts
rowActions={(row) => [
  {
    label:   "Ver detalle",
    onClick: () => router.push(`/productos/${row.id}`),
    variant: "default",   // "default" | "danger" | "outline"
  },
  {
    label:   "Editar",
    onClick: () => setEditando(row),
    variant: "outline",
  },
  {
    label:   "Eliminar",
    onClick: () => handleEliminar(row),
    variant: "danger",
  },
]}
```

---

### 9.5 Acciones de toolbar (`tableActions`)

Botones que aparecen en la barra superior de la tabla:

```ts
tableActions={[
  {
    label:   "Nuevo producto",
    icon:    Plus,
    onClick: () => setModalAbierto(true),
    variant: "primary",   // "primary" | "outline" | "ghost"
  },
  {
    label:    "Exportar Excel",
    icon:     Download,
    onClick:  handleExportar,
    variant:  "outline",
  },
]}
```

---

### 9.6 Acciones masivas (`bulkActions` + `onBulkDelete`)

Cuando el usuario selecciona filas, aparece una barra con las acciones masivas:

```ts
// Botones custom (aparecen a la izquierda de la barra)
bulkActions={(rows) => [
  {
    label:   "Activar",
    onClick: (sel) => handleActivarMasivo(sel),
    variant: "default",
  },
  {
    label:   "→ Premium",
    onClick: (sel) => handleCambiarPlan(sel, "premium"),
    variant: "outline",
  },
]}

// Botón rojo de eliminar (aparece a la derecha, con contador)
onBulkDelete={(rows) => handleEliminarMasivo(rows)}
```

---

### 9.7 Modo client-side con `useSupabaseTable`

Para tablas medianas que cargan todos los datos de una vez:

```tsx
// hooks/useSupabaseTable.ts ya está implementado
// Úsalo así:

import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { DataTable } from "@/components/ui/DataTable";

export default function ProductosTable({ initialData }) {
  const {
    data,
    loading,
    tableActions,
    rowActions,
    onBulkDelete,
    ...props
  } = useSupabaseTable({
    tableName:    "productos",
    initialData,
    columns,
    editableColumns: ["nombre", "precio"],
    canDelete:    true,    // muestra el botón de eliminar
    onNew:        () => setModalAbierto(true),
    canExport:    true,
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      tableActions={tableActions}
      rowActions={rowActions}
      onBulkDelete={onBulkDelete}
      {...props}
    />
  );
}
```

---

### 9.8 Modo server-side con `useServerTable`

Para tablas grandes donde la paginación y filtros se hacen en Supabase:

```tsx
import { useServerTable } from "@/hooks/useServerTable";
import { DataTable } from "@/components/ui/DataTable";

export default function ProductosServerTable() {
  const { data, loading, ...tableProps } = useServerTable({
    tableName: "productos",
    columns,
    pageSize:  20,
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      {...tableProps}  // inyecta automáticamente serverSide, pagination, sorting, etc.
    />
  );
}
```

---

## 10. Cómo crear un módulo nuevo

Sigue estos pasos para agregar un módulo completo al panel. Como ejemplo crearemos un módulo de "Clientes".

### Paso 1 — Crear la tabla en Supabase

```sql
CREATE TABLE public.clientes (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre      text        NOT NULL,
  email       text        UNIQUE NOT NULL,
  telefono    text,
  plan        text        DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  activo      boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read clientes"
  ON public.clientes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can modify clientes"
  ON public.clientes FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );
```

### Paso 2 — Agregar al menú lateral

Edita `config/sidebarMenu.jsx`:

```jsx
import { Users, LayoutDashboard, UserCheck } from "lucide-react"; // agrega UserCheck

export const menuItems = [
  // ...ítems existentes...
  {
    label: "Clientes",
    href:  "/clientes",
    icon:  UserCheck,
    roles: ["admin", "manager"], // quién puede verlo
  },
];
```

### Paso 3 — Crear la carpeta y los archivos

```
app/(admin)/clientes/
  ├── page.tsx           ← Server Component (carga datos)
  └── ClientesTable.tsx  ← Client Component (tabla interactiva)
```

### Paso 4 — Server Component (`page.tsx`)

```tsx
// app/(admin)/clientes/page.tsx
import { supabase } from "@/lib/supabase";
import ClientesTable from "./ClientesTable";

export const dynamic = "force-dynamic"; // siempre datos frescos

export type Cliente = {
  id:         number;
  nombre:     string;
  email:      string;
  telefono:   string | null;
  plan:       string;
  activo:     boolean;
  created_at: string;
};

export default async function ClientesPage() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Clientes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestión de clientes de la plataforma
        </p>
      </div>
      <ClientesTable initialData={data ?? []} />
    </div>
  );
}
```

### Paso 5 — Client Component (`ClientesTable.tsx`)

```tsx
// app/(admin)/clientes/ClientesTable.tsx
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { usePermission } from "@/hooks/usePermission";
import { useAuditLog } from "@/hooks/useAuditLog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Cliente } from "./page";

const PLAN_OPTIONS = [
  { value: "free",       label: "Free"       },
  { value: "pro",        label: "Pro"        },
  { value: "enterprise", label: "Enterprise" },
];

const columns: ColumnDef<Cliente>[] = [
  { accessorKey: "nombre",   header: "Nombre"   },
  { accessorKey: "email",    header: "Email"    },
  { accessorKey: "telefono", header: "Teléfono" },
  { accessorKey: "plan",     header: "Plan"     },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => (
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
        row.getValue("activo")
          ? "bg-green-500/10 text-green-600"
          : "bg-red-500/10 text-red-500"
      }`}>
        {row.getValue("activo") ? "Activo" : "Inactivo"}
      </span>
    ),
  },
];

export default function ClientesTable({ initialData }: { initialData: Cliente[] }) {
  const [data, setData] = useState(initialData);
  const { log } = useAuditLog();

  // Permisos
  const canEditar   = usePermission("editar");
  const canEliminar = usePermission("eliminar");

  /* ── Actualizar celda ── */
  const handleUpdate = async (rowIndex: number, columnId: string, value: any) => {
    const item = data[rowIndex];
    setData(prev => prev.map((r, i) => i === rowIndex ? { ...r, [columnId]: value } : r));

    const { error } = await supabase
      .from("clientes")
      .update({ [columnId]: value })
      .eq("id", item.id);

    if (error) {
      setData(prev => prev.map((r, i) => i === rowIndex ? { ...r, [columnId]: item[columnId as keyof Cliente] } : r));
      toast.error("Error al guardar");
      return;
    }

    log({ action: "editar", entity: "cliente", entityId: String(item.id), detail: `Campo "${columnId}" actualizado` });
  };

  /* ── Eliminar ── */
  const handleDelete = (cliente: Cliente) => {
    toast.warning(`¿Eliminar a ${cliente.nombre}?`, {
      action: {
        label: "Eliminar",
        onClick: async () => {
          const { error } = await supabase.from("clientes").delete().eq("id", cliente.id);
          if (error) { toast.error("Error al eliminar"); return; }
          setData(prev => prev.filter(r => r.id !== cliente.id));
          log({ action: "eliminar", entity: "cliente", entityId: String(cliente.id), detail: cliente.nombre });
          toast.success("Cliente eliminado");
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  return (
    <DataTable<Cliente>
      data={data}
      columns={columns}
      editableColumns={canEditar ? [
        "nombre",
        "telefono",
        {
          key:      "plan",
          type:     "select",
          options:  PLAN_OPTIONS,
          valueKey: "value",
          labelKey: "label",
        },
      ] : []}
      onUpdate={handleUpdate}
      rowActions={canEliminar ? (row) => [
        { label: "Eliminar", onClick: () => handleDelete(row), variant: "danger" },
      ] : undefined}
      onBulkDelete={canEliminar ? (rows) => {
        // Implementar eliminación masiva si se necesita
      } : undefined}
      pageSize={20}
    />
  );
}
```

### Paso 6 — Verificar permisos en la ruta (opcional)

Si quieres proteger la ruta a nivel de servidor además del sidebar, agrega en `page.tsx`:

```tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

// Al inicio del Server Component:
const cookieStore = cookies();
const supabaseServer = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: { get: (name) => cookieStore.get(name)?.value } }
);

const { data: { user } } = await supabaseServer.auth.getUser();
if (!user) redirect("/login");

const { data: profile } = await supabaseServer
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (!profile || !["admin", "manager"].includes(profile.role)) {
  redirect("/dashboard");
}
```

---

## 11. Log de auditoría

El hook `useAuditLog` permite registrar cualquier acción del usuario en la tabla `audit_log`. Es fire-and-forget: si falla, no interrumpe el flujo.

### Uso básico

```tsx
import { useAuditLog } from "@/hooks/useAuditLog";

function MiComponente() {
  const { log } = useAuditLog();

  const handleAccion = async () => {
    // Hacer la acción...
    await supabase.from("productos").insert({ nombre: "Nuevo" });

    // Registrar en el log
    log({
      action:   "crear",           // string libre, descriptivo
      entity:   "producto",        // nombre de la entidad afectada
      entityId: String(nuevoId),   // id del registro (opcional)
      detail:   "Creó el producto 'Laptop Pro'", // descripción (opcional)
    });
  };
}
```

### Convenciones de nomenclatura recomendadas

| `action` | Cuándo usarlo |
|---|---|
| `crear` | Se crea un registro nuevo |
| `editar` | Se modifica un campo |
| `eliminar` | Se elimina un registro |
| `eliminar_masivo` | Eliminación de múltiples registros |
| `exportar` | Se exporta a Excel |
| `cambiar_rol` | Cambio de rol de usuario |
| `cambiar_rol_masivo` | Cambio de rol en masa |
| `eliminar_usuario` | Se elimina una cuenta |

### Ver el log

Solo los usuarios con rol `admin` pueden acceder a `/auditoria`. La tabla muestra las últimas 500 acciones con filtros por tipo y colores por categoría.

---

## 12. Gestión de usuarios

El módulo `/usuarios` permite a los administradores:

- Ver todos los usuarios registrados (Google + email)
- Cambiar el rol de un usuario inline (select en la tabla)
- Eliminar usuarios individuales o en masa
- Asignar un rol a múltiples usuarios a la vez

### Cómo funciona técnicamente

Las operaciones de usuarios usan **Server Actions** (`app/(admin)/usuarios/actions.ts`) con el cliente `supabaseAdmin` (service role), ya que la API de administración de Supabase (`auth.admin.*`) requiere la clave de servicio y no puede ejecutarse en el cliente.

```ts
// app/(admin)/usuarios/actions.ts
"use server";

// Estas funciones solo se pueden llamar desde el servidor
export async function updateUserRole(userId: string, newRole: UserRole) { ... }
export async function deleteUser(userId: string) { ... }
export async function deleteUsers(userIds: string[]) { ... }
export async function updateUsersRole(userIds: string[], newRole: UserRole) { ... }
```

### Agregar columnas al listado de usuarios

Edita `app/(admin)/usuarios/UsuariosTable.tsx` y agrega tu columna al array `columns`:

```ts
{
  accessorKey: "telefono",
  header: "Teléfono",
  cell: ({ row }) => row.getValue("telefono") ?? "—",
},
```

Para que el dato exista, asegúrate de haberlo agregado a la tabla `profiles` en Supabase y de incluirlo en la query de `app/(admin)/usuarios/page.tsx`.

---

## 13. Referencia rápida de hooks

### `useAuth()`

```ts
const { session, role, loading } = useAuth();
// session: Session | null
// role: "admin" | "manager" | "viewer" | null
// loading: boolean
```

### `usePermission(action)`

```ts
const canCrear    = usePermission("crear");    // boolean
const canEditar   = usePermission("editar");   // boolean
const canEliminar = usePermission("eliminar"); // boolean
const canExportar = usePermission("exportar"); // boolean
```

### `useAuditLog()`

```ts
const { log } = useAuditLog();

log({
  action:   string,         // obligatorio
  entity:   string,         // obligatorio
  entityId: string,         // opcional
  detail:   string,         // opcional
});
```

### `useSupabaseTable(options)`

```ts
const { data, loading, tableActions, rowActions, onBulkDelete, ...props } =
  useSupabaseTable({
    tableName:       "mi_tabla",
    initialData:     datos,
    columns,
    editableColumns: ["campo1", "campo2"],
    canDelete:       true,
    onNew:           () => setModalAbierto(true),
    canExport:       true,
  });
```

### `useServerTable(options)`

```ts
const { data, loading, ...tableProps } = useServerTable({
  tableName: "mi_tabla",
  columns,
  pageSize:  20,
});

// Usa spread en DataTable:
<DataTable data={data} columns={columns} loading={loading} {...tableProps} />
```

---

## Checklist de puesta en marcha

- [ ] Proyecto Supabase creado
- [ ] Tabla `profiles` creada con SQL
- [ ] Tabla `audit_log` creada con SQL
- [ ] RLS activado y políticas aplicadas
- [ ] Trigger de auto-registro creado (dos bloques separados)
- [ ] Google OAuth configurado en Google Cloud Console
- [ ] Google OAuth habilitado en Supabase → Authentication → Providers
- [ ] URL de redirección configurada en Supabase (`http://localhost:3000/**`)
- [ ] Archivo `.env.local` creado con las tres variables
- [ ] `npm install` ejecutado
- [ ] `npm run dev` corriendo sin errores
- [ ] Login con Google funciona
- [ ] Login con email/password funciona
- [ ] Al registrarse, el usuario aparece en `profiles` con rol `viewer`

---

*Panel Admin — M. Garrido · 2026*
