"use client";

/**
 * useSupabaseTable
 * ────────────────
 * Hook unificado para tablas conectadas a Supabase.
 * Elige el modo según el volumen de datos esperado:
 *
 *   mode: "client"  → todos los datos en memoria, paginación/filtro en el navegador.
 *                     Ideal para tablas pequeñas (< ~5.000 filas).
 *                     Requiere pasar `initialData` desde un Server Component.
 *
 *   mode: "server"  → solo la página actual en memoria, todo en Postgres.
 *                     Ideal para tablas grandes (miles / millones de filas).
 *                     No requiere fetch previo en el servidor.
 *
 * Uso:
 * ─────
 *   // Modo cliente (datos cargados en el servidor)
 *   const { props, setData } = useSupabaseTable<Producto>({
 *     mode: "client",
 *     tableName: "productos",
 *     initialData,          // ← viene del Server Component
 *     onEdit: (row) => ...,
 *   });
 *
 *   // Modo servidor (hook hace su propio fetch)
 *   const { props, refetch } = useSupabaseTable<Producto>({
 *     mode: "server",
 *     tableName: "productos",
 *     select: "id, nombre, precio, sku, stock",
 *     pageSize: 20,
 *     onEdit: (row) => ...,
 *   });
 *
 *   // Ambos modos: el mismo spread en DataTable
 *   <DataTable columns={columns} editableColumns={["precio"]} {...props} />
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { toast } from "sonner";

/* ============================
   TIPOS
============================ */
type RowAction<T> = {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger" | "outline";
};

type BaseOptions<T extends Record<string, any>> = {
  tableName: string;
  onEdit?: (row: T) => void;
  deleteLabel?: (row: T) => string;
};

/** Opciones exclusivas del modo cliente. */
export type ClientOptions<T extends Record<string, any>> = BaseOptions<T> & {
  mode: "client";
  /** Datos pre-cargados desde el Server Component. */
  initialData: T[];
};

/** Opciones exclusivas del modo servidor. */
export type ServerOptions<T extends Record<string, any>> = BaseOptions<T> & {
  mode: "server";
  /** Columnas a seleccionar (por defecto "*"). Limitar mejora rendimiento. */
  select?: string;
  /** Registros por página (por defecto 20). */
  pageSize?: number;
  /** Ordenamiento por defecto al cargar la tabla. */
  defaultSort?: { column: string; ascending?: boolean };
};

export type UseSupabaseTableOptions<T extends Record<string, any>> =
  | ClientOptions<T>
  | ServerOptions<T>;

/* ============================
   HOOK
============================ */
export function useSupabaseTable<T extends Record<string, any>>(
  options: UseSupabaseTableOptions<T>
) {
  const { tableName, onEdit, deleteLabel = () => "este registro" } = options;
  const isServer  = options.mode === "server";
  const serverOpts = isServer ? (options as ServerOptions<T>) : null;
  const clientOpts = !isServer ? (options as ClientOptions<T>) : null;

  /* ──────────────────────────────────────────────
     ESTADO — declarado siempre (Reglas de Hooks)
  ────────────────────────────────────────────── */
  const [data,       setData]       = useState<T[]>(clientOpts?.initialData ?? []);
  const [loading,    setLoading]    = useState(isServer); // server arranca cargando
  const [totalCount, setTotalCount] = useState(0);

  // Estado de tabla controlado (solo meaningful en server mode)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: serverOpts?.pageSize ?? 20,
  });
  const [sorting, setSorting] = useState<SortingState>(
    serverOpts?.defaultSort
      ? [{ id: serverOpts.defaultSort.column, desc: !(serverOpts.defaultSort.ascending ?? true) }]
      : []
  );
  const [columnFilters,    setColumnFilters]    = useState<ColumnFiltersState>([]);
  const [debouncedFilters, setDebouncedFilters] = useState<ColumnFiltersState>([]);
  const [fetchKey,         setFetchKey]         = useState(0);

  /* ──────────────────────────
     REFS para valores estables
  ────────────────────────── */
  const tableNameRef   = useRef(tableName);
  const selectRef      = useRef(serverOpts?.select ?? "*");
  const defaultSortRef = useRef(serverOpts?.defaultSort);
  tableNameRef.current   = tableName;
  selectRef.current      = serverOpts?.select ?? "*";
  defaultSortRef.current = serverOpts?.defaultSort;

  // Refs para leer filtros/sort actuales dentro de callbacks estables
  const filtersRef = useRef(debouncedFilters);
  const sortingRef = useRef(sorting);
  filtersRef.current = debouncedFilters;
  sortingRef.current = sorting;

  /* ──────────────────────────────
     DEBOUNCE DE FILTROS (server)
  ────────────────────────────── */
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isServer) return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      setDebouncedFilters(columnFilters);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
      setDebouncedFilters(columnFilters);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ──────────────────────────────
     FETCH PRINCIPAL (server)
  ────────────────────────────── */
  useEffect(() => {
    if (!isServer) return;

    let cancelled = false;

    const doFetch = async () => {
      setLoading(true);

      const { pageIndex, pageSize } = pagination;
      const from = pageIndex * pageSize;
      const to   = from + pageSize - 1;

      let query = supabase
        .from(tableNameRef.current)
        .select(selectRef.current, { count: "exact" })
        .range(from, to);

      debouncedFilters.forEach((filter) => {
        const value = String(filter.value).trim();
        if (value) query = (query as any).filter(`${filter.id}::text`, "ilike", `%${value}%`);
      });

      if (sorting.length > 0) {
        sorting.forEach((sort) => query = query.order(sort.id, { ascending: !sort.desc }));
      } else if (defaultSortRef.current) {
        query = query.order(defaultSortRef.current.column, {
          ascending: defaultSortRef.current.ascending ?? true,
        });
      }

      const { data: rows, count, error } = await query;

      if (cancelled) return;

      if (error) {
        toast.error(`Error al cargar datos: ${error.message}`);
      } else {
        setData(((rows as unknown) as T[]) ?? []);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    };

    doFetch();
    return () => { cancelled = true; };
  }, [pagination, sorting, debouncedFilters, fetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize));

  /* ──────────────────────
     REFETCH (server only)
  ────────────────────── */
  const refetch = useCallback(() => {
    if (isServer) setFetchKey((k) => k + 1);
  }, [isServer]);

  /* ──────────────────────────────────────
     EXPORTACIÓN COMPLETA (server only)
  ────────────────────────────────────── */
  const fetchAllForExport = useCallback(async (): Promise<any[]> => {
    let query = supabase.from(tableNameRef.current).select(selectRef.current);

    filtersRef.current.forEach((filter) => {
      const value = String(filter.value).trim();
      if (value) query = (query as any).filter(`${filter.id}::text`, "ilike", `%${value}%`);
    });

    if (sortingRef.current.length > 0) {
      sortingRef.current.forEach((sort) => query = query.order(sort.id, { ascending: !sort.desc }));
    } else if (defaultSortRef.current) {
      query = query.order(defaultSortRef.current.column, {
        ascending: defaultSortRef.current.ascending ?? true,
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data as unknown) as any[]) ?? [];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─────────────────────────────────
     EDICIÓN INLINE (optimista, ambos)
  ───────────────────────────────── */
  const handleUpdate = async (rowIndex: number, columnId: string, value: any) => {
    const row = data[rowIndex];
    if (!row) return;
    const prevValue = row[columnId as keyof T];

    setData((prev) => prev.map((r, i) => (i === rowIndex ? { ...r, [columnId]: value } : r)));

    const { error } = await supabase
      .from(tableNameRef.current)
      .update({ [columnId]: value })
      .eq("id", row.id);

    if (error) {
      setData((prev) => prev.map((r, i) => (i === rowIndex ? { ...r, [columnId]: prevValue } : r)));
      toast.error("Error al guardar");
    } else {
      toast.success("Guardado");
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     DELETE INDIVIDUAL
     - client: filtra localmente (instantáneo, no necesita refetch)
     - server:  refetch (el conteo total cambió, hay que recalcular páginas)
  ───────────────────────────────────────────────────────────────────────────── */
  const handleDelete = (row: T) => {
    toast.warning(`¿Eliminar ${deleteLabel(row)}?`, {
      description: "Esta acción no se puede deshacer.",
      duration: 5000,
      action: {
        label: "Eliminar",
        onClick: () => {
          toast.promise(
            (async () => {
              const { error } = await supabase
                .from(tableNameRef.current)
                .delete()
                .eq("id", row.id);
              if (error) throw error;
            })(),
            {
              loading: "Eliminando...",
              success: () => {
                if (isServer) {
                  refetch();
                } else {
                  setData((prev) => prev.filter((r) => r.id !== row.id));
                }
                return "Eliminado correctamente";
              },
              error: (e) => (e instanceof Error ? e.message : "Error al eliminar"),
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  /* ─────────────────────────────────────────────────────────
     BULK DELETE
     - client: filtra localmente
     - server:  refetch
  ───────────────────────────────────────────────────────── */
  const handleBulkDelete = (rows: T[]) => {
    const n = rows.length;
    toast.warning(`¿Eliminar ${n} registro${n !== 1 ? "s" : ""}?`, {
      description: "Esta acción no se puede deshacer.",
      duration: 5000,
      action: {
        label: "Eliminar",
        onClick: () => {
          const ids = rows.map((r) => r.id);
          toast.promise(
            (async () => {
              const { error } = await supabase
                .from(tableNameRef.current)
                .delete()
                .in("id", ids);
              if (error) throw error;
              return ids.length;
            })(),
            {
              loading: `Eliminando ${n} registros...`,
              success: (deleted) => {
                if (isServer) {
                  refetch();
                } else {
                  const idSet = new Set(ids);
                  setData((prev) => prev.filter((r) => !idSet.has(r.id)));
                }
                return `${deleted} registro${deleted !== 1 ? "s" : ""} eliminado${deleted !== 1 ? "s" : ""}`;
              },
              error: (e) => (e instanceof Error ? e.message : "Error al eliminar"),
            }
          );
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  /* ──────────────────────
     ACCIONES DE FILA
  ────────────────────── */
  const rowActions = (row: T): RowAction<T>[] => [
    ...(onEdit ? [{ label: "Editar", onClick: () => onEdit(row), variant: "outline" as const }] : []),
    { label: "Eliminar", onClick: () => handleDelete(row), variant: "danger" as const },
  ];

  /* ──────────────────────────────────────────────────
     RETORNO
     props es idéntico para ambos modos — mismo spread
  ────────────────────────────────────────────────── */
  return {
    data,
    setData,
    totalCount,
    loading,
    /** Solo útil en mode: "server". En client es no-op. */
    refetch,
    props: {
      data,
      loading,
      onUpdate:     handleUpdate,
      onBulkDelete: handleBulkDelete,
      rowActions,
      // Props server-side (solo se incluyen cuando corresponde)
      ...(isServer && {
        serverSide:            true as const,
        pageCount,
        totalCount,
        fetchAllRows:          fetchAllForExport,
        pagination,
        onPaginationChange:    (p: { pageIndex: number; pageSize: number }) => setPagination(p),
        sorting,
        onSortingChange:       (s: SortingState) => setSorting(s),
        columnFilters,
        onColumnFiltersChange: (f: ColumnFiltersState) => setColumnFilters(f),
      }),
    },
  };
}
