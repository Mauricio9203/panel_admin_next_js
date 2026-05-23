import { loadTheme } from "@/lib/themeLoader";
import { THEME_PRESETS } from "@/config/themePresets";
import { DEFAULT_THEME } from "@/config/theme";
import AparienciaClient from "./AparienciaClient";
import TituloModulo from "@/components/ui/TituloModulo";


export default async function AparienciaPage() {
  const currentTheme = await loadTheme();

  /* Detecta qué preset está activo comparando el primary del light mode */
  const activePresetId =
    THEME_PRESETS.find(
      (p) => p.theme.light.primary === currentTheme.light.primary
    )?.id ?? "violet";

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl">
      <div>
      <TituloModulo titulo="Apariencia" variant="violet" />
        <p className="text-sm text-muted-foreground mt-1">
          Personaliza los colores y el estilo visual del panel.
          Los cambios se aplican a todos los usuarios.
        </p>
      </div>

      <AparienciaClient
        presets={THEME_PRESETS}
        activePresetId={activePresetId}
        currentRadius={currentTheme.radius}
        currentTheme={currentTheme}
      />
    </div>
  );
}
