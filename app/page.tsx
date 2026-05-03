import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="h-screen bg-white p-6">
      {/* Título */}
      <h1 className="text-md font-bold text-violet-800 -mt-2 mb-2">Mi Módulo</h1>
      <div className="w-full h-px bg-violet-200 mb-4" />
      <Card className="w-1/2">
        <h2 className="text-lg font-semibold text-violet-800 mb-2">Tarjeta de Información</h2>
      </Card>
    </div>
  );
}
