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
            ${isViolet ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}
          `}
        >
          <Icon size={16} />
        </div>

        {/* TITULO */}
        <h2
          className={`
            text-base font-semibold tracking-tight
            ${isViolet ? "text-neutral-900 dark:text-white" : "text-neutral-900 dark:text-neutral-100"}
          `}
        >
          {titulo}
        </h2>
      </div>

      {/* LINEA DECORATIVA */}
      <div className="relative">
        <div
          className={`
            h-px w-full
            ${isViolet ? "bg-gradient-to-r from-violet-500 via-violet-500/30 to-transparent" : "bg-neutral-200 dark:bg-neutral-800"}
          `}
        />

        {/* ACCENT */}
        <div
          className={`
            absolute top-0 left-0 h-px w-16
            ${isViolet ? "bg-violet-500" : "bg-neutral-400 dark:bg-neutral-500"}
          `}
        />
      </div>
    </div>
  );
}
