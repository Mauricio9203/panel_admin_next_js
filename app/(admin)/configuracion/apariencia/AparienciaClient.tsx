"use client";

import { useState, useTransition } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import type { ThemePreset } from "@/config/themePresets";
import type { PanelTheme } from "@/config/theme";
import { DEFAULT_THEME } from "@/config/theme";
import { saveTheme } from "./actions";

/* ─────────────────────────────────────────────────────────────────────────────
   OPCIONES DE RADIO
───────────────────────────────────────────────────────────────────────────── */
const RADIUS_OPTIONS = [
  { value: "0.25rem", label: "Cuadrado" },
  { value: "0.5rem",  label: "Suave"    },
  { value: "0.75rem", label: "Medio"    },
  { value: "1.5rem",  label: "Amplio"   },
  { value: "2rem",    label: "Circular" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER — inyecta un <style> con ambas reglas (:root y .dark)
   igual que ThemeVars hace en el servidor.
   Usar un <style> tag en lugar de element.style.setProperty evita que
   los estilos inline (mayor especificidad) congelen los vars al cambiar
   de modo claro/oscuro.
───────────────────────────────────────────────────────────────────────────── */
function applyThemePreview(theme: PanelTheme) {
  const { light: l, dark: d, radius } = theme;

  const css = `
    :root {
      --radius:                      ${radius};
      --primary:                     ${l.primary};
      --primary-foreground:          ${l.primaryForeground};
      --background:                  ${l.background};
      --foreground:                  ${l.foreground};
      --card:                        ${l.card};
      --card-foreground:             ${l.cardForeground};
      --popover:                     ${l.popover};
      --popover-foreground:          ${l.popoverForeground};
      --secondary:                   ${l.secondary};
      --secondary-foreground:        ${l.secondaryForeground};
      --muted:                       ${l.muted};
      --muted-foreground:            ${l.mutedForeground};
      --accent:                      ${l.accent};
      --accent-foreground:           ${l.accentForeground};
      --destructive:                 ${l.destructive};
      --border:                      ${l.border};
      --input:                       ${l.input};
      --ring:                        ${l.ring};
      --sidebar:                     ${l.sidebar};
      --sidebar-foreground:          ${l.sidebarForeground};
      --sidebar-primary:             ${l.sidebarPrimary};
      --sidebar-primary-foreground:  ${l.sidebarPrimaryForeground};
      --sidebar-accent:              ${l.sidebarAccent};
      --sidebar-accent-foreground:   ${l.sidebarAccentForeground};
      --sidebar-border:              ${l.sidebarBorder};
      --sidebar-ring:                ${l.sidebarRing};
      --scrollbar-bg:                ${l.scrollbarBg};
      --scrollbar-thumb:             ${l.scrollbarThumb};
      --scrollbar-thumb-hover:       ${l.scrollbarThumbHover};
    }
    .dark {
      --primary:                     ${d.primary};
      --primary-foreground:          ${d.primaryForeground};
      --background:                  ${d.background};
      --foreground:                  ${d.foreground};
      --card:                        ${d.card};
      --card-foreground:             ${d.cardForeground};
      --popover:                     ${d.popover};
      --popover-foreground:          ${d.popoverForeground};
      --secondary:                   ${d.secondary};
      --secondary-foreground:        ${d.secondaryForeground};
      --muted:                       ${d.muted};
      --muted-foreground:            ${d.mutedForeground};
      --accent:                      ${d.accent};
      --accent-foreground:           ${d.accentForeground};
      --destructive:                 ${d.destructive};
      --border:                      ${d.border};
      --input:                       ${d.input};
      --ring:                        ${d.ring};
      --sidebar:                     ${d.sidebar};
      --sidebar-foreground:          ${d.sidebarForeground};
      --sidebar-primary:             ${d.sidebarPrimary};
      --sidebar-primary-foreground:  ${d.sidebarPrimaryForeground};
      --sidebar-accent:              ${d.sidebarAccent};
      --sidebar-accent-foreground:   ${d.sidebarAccentForeground};
      --sidebar-border:              ${d.sidebarBorder};
      --sidebar-ring:                ${d.sidebarRing};
      --scrollbar-bg:                ${d.scrollbarBg};
      --scrollbar-thumb:             ${d.scrollbarThumb};
      --scrollbar-thumb-hover:       ${d.scrollbarThumbHover};
    }
  `;

  // Actualiza directamente el elemento de ThemeVars (está en <body>, después
  // de cualquier <style> en <head>). Si por alguna razón no existe, lo crea
  // al final de <body> para garantizar que sobrescribe los estilos base.
  let el = document.getElementById("panel-theme-vars");
  if (!el) {
    el = document.createElement("style");
    el.id = "panel-theme-vars";
    document.body.insertBefore(el, document.body.firstChild);
  }
  el.textContent = css;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MINI PREVIEW — muestra un mockup del panel con los colores del preset
───────────────────────────────────────────────────────────────────────────── */
function MiniPreview({
  preview,
}: {
  preview: ThemePreset["preview"];
}) {
  return (
    <div className="flex gap-1.5 mb-3">
      {/* Light */}
      <div
        className="flex-1 rounded-lg overflow-hidden border border-black/5"
        style={{ height: 52 }}
      >
        <div className="flex h-full">
          <div className="w-8 h-full" style={{ background: preview.sidebarLight }}>
            <div className="mt-2 mx-1.5 space-y-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-sm h-1"
                  style={{
                    background: i === 1 ? preview.primary : `${preview.primary}40`,
                    width: i === 1 ? "100%" : "70%",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white/90 p-1.5 space-y-1">
            <div className="h-1.5 rounded-full bg-slate-200 w-3/4" />
            <div className="h-1 rounded-full bg-slate-100 w-full" />
            <div className="h-1 rounded-full bg-slate-100 w-5/6" />
            <div
              className="h-2 rounded w-1/2 mt-0.5"
              style={{ background: preview.primary }}
            />
          </div>
        </div>
      </div>

      {/* Dark */}
      <div
        className="flex-1 rounded-lg overflow-hidden border border-white/5"
        style={{ height: 52 }}
      >
        <div className="flex h-full">
          <div className="w-8 h-full" style={{ background: preview.sidebarDark }}>
            <div className="mt-2 mx-1.5 space-y-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-sm h-1"
                  style={{
                    background: i === 1 ? preview.primaryDark : `${preview.primaryDark}50`,
                    width: i === 1 ? "100%" : "70%",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 p-1.5 space-y-1" style={{ background: "#1a1a2e" }}>
            <div className="h-1.5 rounded-full w-3/4" style={{ background: "#ffffff20" }} />
            <div className="h-1 rounded-full w-full" style={{ background: "#ffffff12" }} />
            <div className="h-1 rounded-full w-5/6" style={{ background: "#ffffff12" }} />
            <div
              className="h-2 rounded w-1/2 mt-0.5"
              style={{ background: preview.primaryDark }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────────────────── */
type Props = {
  presets:       ThemePreset[];
  activePresetId: string;
  currentRadius:  string;
  currentTheme:   PanelTheme;
};

export default function AparienciaClient({
  presets,
  activePresetId,
  currentRadius,
  currentTheme,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const [selectedPresetId, setSelectedPresetId] = useState(activePresetId);
  const [selectedRadius,   setSelectedRadius]   = useState(currentRadius);
  const [previewTheme,     setPreviewTheme]     = useState(currentTheme);

  const hasChanges =
    selectedPresetId !== activePresetId ||
    selectedRadius   !== currentRadius;

  /* ── Seleccionar preset ── */
  const handleSelectPreset = (preset: ThemePreset) => {
    const newTheme = { ...preset.theme, radius: selectedRadius };
    setSelectedPresetId(preset.id);
    setPreviewTheme(newTheme);
    applyThemePreview(newTheme);
  };

  /* ── Cambiar radio ── */
  const handleSelectRadius = (radius: string) => {
    const preset = presets.find((p) => p.id === selectedPresetId);
    if (!preset) return;
    const newTheme = { ...preset.theme, radius };
    setSelectedRadius(radius);
    setPreviewTheme(newTheme);
    applyThemePreview(newTheme);
  };

  /* ── Guardar ── */
  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveTheme(previewTheme);
        // Hard reload: garantiza que el servidor sirva el tema recién guardado
        // sin riesgo de datos stale en el cache del cliente.
        window.location.reload();
      } catch (e: any) {
        toast.error(e?.message ?? "Error al guardar el tema");
      }
    });
  };

  /* ── Restaurar defaults ── */
  const handleReset = () => {
    const defaultPreset = presets.find((p) => p.id === "violet")!;
    const defaultTheme  = { ...DEFAULT_THEME };
    setSelectedPresetId("violet");
    setSelectedRadius(DEFAULT_THEME.radius);
    setPreviewTheme(defaultTheme);
    applyThemePreview(defaultTheme);
    toast.info("Tema restaurado — guarda para aplicar");
  };

  return (
    <div className="flex flex-col gap-8">

      {/* ── PRESETS ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Tema de color
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona un tema para previsualizar los cambios en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {/* Check de selección */}
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: preset.preview.primary }}
                  >
                    <Check size={11} className="text-white" />
                  </div>
                )}

                {/* Mini mockup */}
                <MiniPreview preview={preset.preview} />

                {/* Nombre */}
                <p className="text-[13px] font-semibold text-foreground">
                  {preset.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {preset.description}
                </p>

                {/* Swatches de color */}
                <div className="flex gap-1.5 mt-2.5">
                  <div
                    className="w-5 h-2.5 rounded-full"
                    title="Light primary"
                    style={{ background: preset.preview.primary }}
                  />
                  <div
                    className="w-5 h-2.5 rounded-full"
                    title="Dark primary"
                    style={{ background: preset.preview.primaryDark }}
                  />
                  <div
                    className="w-5 h-2.5 rounded-full border border-black/5"
                    title="Sidebar light"
                    style={{ background: preset.preview.sidebarLight }}
                  />
                  <div
                    className="w-5 h-2.5 rounded-full border border-white/10"
                    title="Sidebar dark"
                    style={{ background: preset.preview.sidebarDark }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── RADIO DE BORDES ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Bordes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Controla qué tan redondeados son los elementos del panel.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((opt) => {
            const isActive = opt.value === selectedRadius;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectRadius(opt.value)}
                className={`px-4 py-2 text-[12px] font-medium border transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40"
                }`}
                style={{ borderRadius: opt.value }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── ACCIONES ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-xl border border-border text-muted-foreground hover:bg-muted/50 transition-all disabled:opacity-50"
        >
          <RotateCcw size={13} />
          Restaurar defaults
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-black uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <Save size={13} />
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>

        {hasChanges && !isPending && (
          <p className="text-[11px] text-muted-foreground/70 ml-1">
            Tienes cambios sin guardar
          </p>
        )}
      </div>
    </div>
  );
}
