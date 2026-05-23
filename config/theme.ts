/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TEMA DEL PANEL — Fuente única de verdad
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Todos los colores, radios y valores visuales del panel se definen aquí.
 * El componente <ThemeVars /> los inyecta como CSS custom properties, lo que
 * hace que Tailwind y todos los componentes los consuman automáticamente.
 *
 * ── MIGRACIÓN A BASE DE DATOS ────────────────────────────────────────────────
 * Cuando quieras cargar el tema desde Supabase:
 *
 *  1. Crea la tabla en Supabase:
 *       CREATE TABLE public.theme_config (
 *         id      int  PRIMARY KEY DEFAULT 1,          -- solo 1 fila
 *         theme   jsonb NOT NULL DEFAULT '{}'::jsonb,
 *         CHECK (id = 1)                               -- garantiza fila única
 *       );
 *       INSERT INTO public.theme_config (id, theme) VALUES (1, '{}'::jsonb);
 *
 *  2. En app/layout.tsx reemplaza la importación estática por:
 *       import { supabaseAdmin } from "@/lib/supabaseAdmin";
 *       const { data } = await supabaseAdmin
 *         .from("theme_config")
 *         .select("theme")
 *         .single();
 *       const theme = (data?.theme as PanelTheme) ?? DEFAULT_THEME;
 *
 *  3. Pasa el tema cargado: <ThemeVars theme={theme} />
 *
 * Todo lo demás (componentes, CSS, Tailwind) funciona exactamente igual.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Tipado ─────────────────────────────────────────────────────────────────── */

/** Conjunto de variables para un modo (light o dark). */
export type ThemeScale = {
  /* ── Color de marca ── */
  primary:                  string;
  primaryForeground:        string;

  /* ── Página ── */
  background:               string;
  foreground:               string;

  /* ── Superficies ── */
  card:                     string;
  cardForeground:           string;
  popover:                  string;
  popoverForeground:        string;

  /* ── Semánticos ── */
  secondary:                string;
  secondaryForeground:      string;
  muted:                    string;
  mutedForeground:          string;
  accent:                   string;
  accentForeground:         string;
  destructive:              string;

  /* ── Bordes e inputs ── */
  border:                   string;
  input:                    string;
  ring:                     string;

  /* ── Sidebar ── */
  sidebar:                  string;
  sidebarForeground:        string;
  sidebarPrimary:           string;
  sidebarPrimaryForeground: string;
  sidebarAccent:            string;
  sidebarAccentForeground:  string;
  sidebarBorder:            string;
  sidebarRing:              string;

  /* ── Scrollbar ── */
  scrollbarBg:              string;
  scrollbarThumb:           string;
  scrollbarThumbHover:      string;
};

export type PanelTheme = {
  light:  ThemeScale;
  dark:   ThemeScale;
  /** Radio de bordes base (ej: "1.5rem"). El resto se calcula proporcional. */
  radius: string;
};

/* ── Tema por defecto ────────────────────────────────────────────────────────
   Valores OKLCH — mismo espacio de color que usa Tailwind v4.
   Para convertir hex a OKLCH: https://oklch.com
   ─────────────────────────────────────────────────────────────────────────── */
export const DEFAULT_THEME: PanelTheme = {
  radius: "1.5rem",

  light: {
    /* Marca: morado */
    primary:                  "oklch(0.55 0.28 295)",
    primaryForeground:        "oklch(0.985 0 0)",

    /* Página */
    background:               "oklch(1 0 0)",
    foreground:               "oklch(0.145 0 0)",

    /* Superficies con glassmorphism */
    card:                     "oklch(1 0 0 / 80%)",
    cardForeground:           "oklch(0.145 0 0)",
    popover:                  "oklch(1 0 0 / 85%)",
    popoverForeground:        "oklch(0.145 0 0)",

    /* Semánticos */
    secondary:                "oklch(0.97 0.015 295)",
    secondaryForeground:      "oklch(0.205 0.05 295)",
    muted:                    "oklch(0.97 0 0)",
    mutedForeground:          "oklch(0.556 0 0)",
    accent:                   "oklch(0.94 0.06 295)",
    accentForeground:         "oklch(0.205 0 0)",
    destructive:              "oklch(0.577 0.245 27.325)",

    /* Bordes */
    border:                   "oklch(0.922 0 0)",
    input:                    "oklch(0.922 0 0)",
    ring:                     "oklch(0.55 0.28 295 / 40%)",

    /* Sidebar */
    sidebar:                  "oklch(0.985 0 0)",
    sidebarForeground:        "oklch(0.145 0 0)",
    sidebarPrimary:           "oklch(0.55 0.28 295)",
    sidebarPrimaryForeground: "oklch(0.985 0 0)",
    sidebarAccent:            "oklch(0.97 0 0)",
    sidebarAccentForeground:  "oklch(0.205 0 0)",
    sidebarBorder:            "oklch(0.922 0 0)",
    sidebarRing:              "oklch(0.708 0 0)",

    /* Scrollbar */
    scrollbarBg:              "#f5f0ff",
    scrollbarThumb:           "#9333ea",
    scrollbarThumbHover:      "#7e22ce",
  },

  dark: {
    /* Marca: morado (ligeramente más claro en dark) */
    primary:                  "oklch(0.72 0.22 295)",
    primaryForeground:        "oklch(0.1 0 0)",

    /* Página — fondo oscuro morado */
    background:               "oklch(0.12 0.025 295)",
    foreground:               "oklch(0.985 0 0)",

    /* Superficies */
    card:                     "oklch(0.18 0.035 295 / 80%)",
    cardForeground:           "oklch(0.985 0 0)",
    popover:                  "oklch(0.18 0.035 295 / 90%)",
    popoverForeground:        "oklch(0.985 0 0)",

    /* Semánticos */
    secondary:                "oklch(0.25 0.055 295)",
    secondaryForeground:      "oklch(0.985 0 0)",
    muted:                    "oklch(0.25 0.025 295)",
    mutedForeground:          "oklch(0.7 0 0)",
    accent:                   "oklch(0.3 0.09 295)",
    accentForeground:         "oklch(0.985 0 0)",
    destructive:              "oklch(0.396 0.141 25.723)",

    /* Bordes */
    border:                   "oklch(1 0 0 / 12%)",
    input:                    "oklch(1 0 0 / 15%)",
    ring:                     "oklch(0.72 0.22 295 / 50%)",

    /* Sidebar */
    sidebar:                  "oklch(0.15 0.025 295)",
    sidebarForeground:        "oklch(0.985 0 0)",
    sidebarPrimary:           "oklch(0.55 0.28 295)",
    sidebarPrimaryForeground: "oklch(0.985 0 0)",
    sidebarAccent:            "oklch(0.25 0.055 295)",
    sidebarAccentForeground:  "oklch(0.985 0 0)",
    sidebarBorder:            "oklch(1 0 0 / 10%)",
    sidebarRing:              "oklch(0.72 0.22 295)",

    /* Scrollbar */
    scrollbarBg:              "#160e26",
    scrollbarThumb:           "#c084fc",
    scrollbarThumbHover:      "#d8b4fe",
  },
};
