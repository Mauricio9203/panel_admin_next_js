"use client";

import { useState, useCallback } from "react";
import { useCrud } from "@/hooks/useCrud";
import { toast } from "sonner";
import { RefreshCw, Files, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { GlassDropzone } from "@/components/ui/GlassDropzone"; 
import { uploadFileAction } from "./actions/uploadFileAction";

export function FormSubidaMasiva({ onExito }: { onExito: () => void }) {
  const { createRecord } = useCrud("documentos");

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0 });
  const [isAlive, setIsAlive] = useState(true);

  const forceReset = useCallback(() => {
    setFiles([]);
    setIsUploading(false);
    setCurrentProgress({ current: 0, total: 0 });
    setIsAlive(false);
    setTimeout(() => setIsAlive(true), 10);
  }, []);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setCurrentProgress({ current: 0, total: files.length });
    
    const toastId = toast.loading(`Iniciando subida de ${files.length} archivos...`);
    let subidosOk = 0;
    let errores = 0;

    for (const file of files) {
      try {
        toast.loading(`Subiendo (${subidosOk + errores + 1}/${files.length}): ${file.name}`, { id: toastId });
        
        const formData = new FormData();
        formData.append("file", file);
        
        // 1. Subir a R2 (Server Action)
        const uploadResult = await uploadFileAction(formData);
        if (!uploadResult.success) throw new Error(uploadResult.error);

        // 2. Registrar en Base de Datos (Supabase)
        await createRecord({
          nombre: file.name,
          url_r2: uploadResult.url,
          size: file.size,
          mime_type: file.type,
        });

        subidosOk++;
      } catch (error) {
        console.error(`Error subiendo ${file.name}:`, error);
        errores++;
      } finally {
        setCurrentProgress(prev => ({ ...prev, current: subidosOk + errores }));
      }
    }

    if (errores === 0) {
      toast.success(`¡Éxito! Se subieron los ${subidosOk} archivos.`, { id: toastId });
      forceReset();
      // El componente padre (la tabla) recibirá esta señal y hará el refetch por nosotros
      setTimeout(() => onExito(), 500);
    } else {
      toast.warning(`Subida finalizada: ${subidosOk} exitosos, ${errores} fallidos.`, { id: toastId });
      setIsUploading(false);
      // Opcional: Llamamos a onExito aunque hubiera errores para ver lo que sí se subió
      onExito(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Files className="text-violet-500" size={18} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Subida Múltiple ({files.length} seleccionados)
            </h2>
          </div>
          <button 
            type="button" 
            onClick={forceReset}
            className="text-[10px] text-slate-400 hover:text-violet-500 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={10} /> Limpiar todo
          </button>
        </div>
        
        <div className="min-h-[150px]">
          {isAlive ? (
            <GlassDropzone 
              label="Arrastra varios archivos o haz clic aquí" 
              accept=".pdf,.png,.jpg,.jpeg,.csv" 
              multiple={true}
              onFilesChange={handleFilesChange} 
            />
          ) : (
            <div className="w-full h-[150px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 animate-pulse" />
          )}
        </div>
      </div>

      {files.length > 0 && !isUploading && (
        <div className="max-h-32 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-lg p-2 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
          {files.map((f, i) => (
            <div key={i} className="text-[11px] flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="submit"
          disabled={isUploading || files.length === 0}
          variant="primary"
          className="w-full font-bold relative"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Subiendo {currentProgress.current} de {currentProgress.total}...
            </span>
          ) : (
            `Subir ${files.length} archivos`
          )}
        </Button>
      </div>
    </form>
  );
}