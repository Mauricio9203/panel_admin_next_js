import { LucideIcon, Sparkles } from "lucide-react";

type TituloModuloProps = {
  titulo: string;
  variant?: "default" | "violet";
  icon?: LucideIcon;
};

export default function TituloModulo({ titulo, variant = "default", icon: Icon = Sparkles }: TituloModuloProps) {
  const isViolet = variant === "violet";

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        {/* ICONO */}
        <div
          className={`
            flex items-center justify-center
            w-8 h-8 rounded-lg
            ${isViolet ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
          `}
        >
          <Icon size={16} />
        </div>

        {/* TITULO */}
        <h2
          className="text-base font-semibold tracking-tight text-foreground"
        >
          {titulo}
        </h2>
      </div>

      {/* LINEA DECORATIVA */}
      <div className="relative">
        <div
          className={`
            h-px w-full
            ${isViolet ? "bg-gradient-to-r from-primary via-primary/30 to-transparent" : "bg-border"}
          `}
        />

        {/* ACCENT */}
        <div
          className={`
            absolute top-0 left-0 h-px w-16
            ${isViolet ? "bg-primary" : "bg-muted-foreground/40"}
          `}
        />
      </div>
    </div>
  );
}
