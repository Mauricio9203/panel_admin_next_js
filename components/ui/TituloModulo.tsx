type TituloModuloProps = {
  titulo: string;
  variant?: "default" | "violet";
};

export default function TituloModulo({ titulo, variant = "default" }: TituloModuloProps) {
  const lineStyle = variant === "violet" ? "bg-gradient-to-r from-violet-500/30 via-neutral-200 dark:via-neutral-800 to-transparent" : "bg-neutral-200 dark:bg-neutral-800 opacity-60";

  return (
    <div className="space-y-1">
      {/* Título */}
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{titulo}</h2>

      {/* Línea separadora */}
      <div className={`h-px w-full ${lineStyle}`} />
    </div>
  );
}
