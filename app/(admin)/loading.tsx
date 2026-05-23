export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Anillo exterior sutil */}
        <div className="w-12 h-12 border-2 border-primary/10 rounded-full"></div>

        {/* Anillo de carga animado */}
        <div className="absolute w-12 h-12 border-t-2 border-primary rounded-full animate-spin"></div>

        {/* Núcleo con pulso */}
        <div className="absolute w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
      </div>

      {/* Texto de carga minimalista */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground animate-pulse">Cargando</span>
        {/* Barra de progreso sutil (decorativa) */}
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-1"></div>
      </div>
    </div>
  );
}
