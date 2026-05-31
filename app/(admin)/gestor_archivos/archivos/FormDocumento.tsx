"use client";

import { useState, useCallback } from "react";
import { useCrud } from "@/hooks/useCrud";
import { toast } from "sonner";
import { FileText, UploadCloud, RefreshCw } from "lucide-react";

import NormalInput from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassDropzone } from "@/components/ui/GlassDropzone"; 
import { uploadFileAction } from "./actions/uploadFileAction";

export function FormDocumento({ onExito }: { onExito: (record: any) => void }) {
  const { createRecord } = useCrud("documentos");

  const [files, setFiles] = useState<File[]>([]);
  const [nombrePersonalizado, setNombrePersonalizado] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // 1. Estado para controlar la existencia del componente
  const [isAlive, setIsAlive] = useState(true);

  // 2. Función de reset mejorada: Mata y revive el componente
  const forceReset = useCallback(() => {
    setFiles([]);
    setNombrePersonalizado("");
    setIsAlive(false); 
    
    setTimeout(() => {
      setIsAlive(true);
    }, 10);
  }, []);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);

    // --- AUTO-COMPLETAR NOMBRE ---
    if (newFiles.length > 0) {
      // Si hay un archivo nuevo, ponemos su nombre en el input automáticamente
      setNombrePersonalizado(newFiles[0].name);
    } else {
      // Si se quita el archivo, reseteamos la zona (incluye limpiar nombre)
      forceReset();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);

    const procesoCompleto = async () => {
      const fileToUpload = files[0];
      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const uploadResult = await uploadFileAction(formData);
      if (!uploadResult.success) throw new Error(uploadResult.error);

      const registro = await createRecord({
        // Usamos el nombre del input (que ahora se auto-completa solo)
        nombre: nombrePersonalizado.trim() || fileToUpload.name,
        url_r2: uploadResult.url,
        size: fileToUpload.size,
        mime_type: fileToUpload.type,
      });

      if (!registro) throw new Error("Error al registrar en BD");
      return registro;
    };

    toast.promise(procesoCompleto(), {
      loading: "Subiendo...",
      success: (record) => {
        forceReset();
        setTimeout(() => onExito(record), 300);
        return "¡Subido!";
      },
      error: (err) => {
        setIsUploading(false);
        return err.message || "Error";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UploadCloud className="text-violet-500" size={18} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Documento
            </h2>
          </div>
          <button 
            type="button" 
            onClick={forceReset}
            className="text-[10px] text-slate-400 hover:text-violet-500 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={10} /> Resetear Zona
          </button>
        </div>
        
        <div className="min-h-[120px]">
          {isAlive ? (
            <GlassDropzone 
              label="Arrastra o selecciona un archivo" 
              accept=".pdf,.png,.jpg,.jpeg,.csv" 
              multiple={false} 
              onFilesChange={handleFilesChange} 
            />
          ) : (
            <div className="w-full h-[120px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl animate-pulse bg-slate-50/50 dark:bg-slate-900/50" />
          )}
        </div>
      </div>

      <NormalInput
        label="Nombre del Archivo"
        icon={FileText}
        placeholder="Nombre del archivo"
        value={nombrePersonalizado}
        onChange={(e) => setNombrePersonalizado(e.target.value)}
        disabled={isUploading}
      />

      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="submit"
          disabled={isUploading || files.length === 0}
          variant="primary"
          className="w-full sm:w-auto px-10 font-bold"
        >
          {isUploading ? "Subiendo..." : "Confirmar Subida"}
        </Button>
      </div>
    </form>
  );
}