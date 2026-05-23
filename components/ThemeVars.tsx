import type { PanelTheme } from "@/config/theme";

/**
 * ThemeVars — Server Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Convierte el objeto PanelTheme en un bloque <style> con CSS custom
 * properties. Al estar en el <body> del documento, sobrescribe los valores
 * del globals.css (que actúan como fallback).
 *
 * No tiene lógica de cliente: se renderiza una vez en el servidor y el HTML
 * resultante llega ya con los estilos aplicados — sin flash ni parpadeo.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function ThemeVars({ theme }: { theme: PanelTheme }) {
  const { light, dark, radius } = theme;

  const css = `
    :root {
      --radius: ${radius};

      --primary:                   ${light.primary};
      --primary-foreground:        ${light.primaryForeground};

      --background:                ${light.background};
      --foreground:                ${light.foreground};

      --card:                      ${light.card};
      --card-foreground:           ${light.cardForeground};
      --popover:                   ${light.popover};
      --popover-foreground:        ${light.popoverForeground};

      --secondary:                 ${light.secondary};
      --secondary-foreground:      ${light.secondaryForeground};
      --muted:                     ${light.muted};
      --muted-foreground:          ${light.mutedForeground};
      --accent:                    ${light.accent};
      --accent-foreground:         ${light.accentForeground};
      --destructive:               ${light.destructive};

      --border:                    ${light.border};
      --input:                     ${light.input};
      --ring:                      ${light.ring};

      --sidebar:                   ${light.sidebar};
      --sidebar-foreground:        ${light.sidebarForeground};
      --sidebar-primary:           ${light.sidebarPrimary};
      --sidebar-primary-foreground:${light.sidebarPrimaryForeground};
      --sidebar-accent:            ${light.sidebarAccent};
      --sidebar-accent-foreground: ${light.sidebarAccentForeground};
      --sidebar-border:            ${light.sidebarBorder};
      --sidebar-ring:              ${light.sidebarRing};

      --scrollbar-bg:              ${light.scrollbarBg};
      --scrollbar-thumb:           ${light.scrollbarThumb};
      --scrollbar-thumb-hover:     ${light.scrollbarThumbHover};
    }

    .dark {
      --primary:                   ${dark.primary};
      --primary-foreground:        ${dark.primaryForeground};

      --background:                ${dark.background};
      --foreground:                ${dark.foreground};

      --card:                      ${dark.card};
      --card-foreground:           ${dark.cardForeground};
      --popover:                   ${dark.popover};
      --popover-foreground:        ${dark.popoverForeground};

      --secondary:                 ${dark.secondary};
      --secondary-foreground:      ${dark.secondaryForeground};
      --muted:                     ${dark.muted};
      --muted-foreground:          ${dark.mutedForeground};
      --accent:                    ${dark.accent};
      --accent-foreground:         ${dark.accentForeground};
      --destructive:               ${dark.destructive};

      --border:                    ${dark.border};
      --input:                     ${dark.input};
      --ring:                      ${dark.ring};

      --sidebar:                   ${dark.sidebar};
      --sidebar-foreground:        ${dark.sidebarForeground};
      --sidebar-primary:           ${dark.sidebarPrimary};
      --sidebar-primary-foreground:${dark.sidebarPrimaryForeground};
      --sidebar-accent:            ${dark.sidebarAccent};
      --sidebar-accent-foreground: ${dark.sidebarAccentForeground};
      --sidebar-border:            ${dark.sidebarBorder};
      --sidebar-ring:              ${dark.sidebarRing};

      --scrollbar-bg:              ${dark.scrollbarBg};
      --scrollbar-thumb:           ${dark.scrollbarThumb};
      --scrollbar-thumb-hover:     ${dark.scrollbarThumbHover};
    }
  `.trim();

  return (
    <style
      id="panel-theme-vars"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
