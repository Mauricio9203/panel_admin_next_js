"use client";

import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { toast } from "sonner";

// Componentes del sistema de diseño
import NormalInput from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Package, DollarSign, Hash } from "lucide-react";

type Producto = {
  id: string;
  created_at: string;
  nombre: string;
  precio: number;
  sku: string | null;
  stock: number;
};

interface FormProductoProps {
  productoEdicion?: Producto | null;
  /** Recibe el registro creado/editado. En modo server-side puedes ignorar el argumento y llamar refetch(). */
  onExito: (record: Producto) => void;
}

export function FormProducto({ productoEdicion, onExito }: FormProductoProps) {
  const { createRecord, updateRecord, loading } = useCrud<Producto>("productos");

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    sku: "",
    stock: "",
  });

  // --- ESTADO DE ERRORES LOCALES (Validación de campos) ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productoEdicion) {
      setFormData({
        nombre: productoEdicion.nombre,
        precio: productoEdicion.precio.toString(),
        sku: productoEdicion.sku || "",
        stock: productoEdicion.stock.toString(),
      });
    }
  }, [productoEdicion]);

  // --- LÓGICA DE VALIDACIÓN ---
  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre del producto es obligatorio";

    if (!formData.precio) {
      nuevosErrores.precio = "El precio es obligatorio";
    } else if (Number(formData.precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.stock) {
      nuevosErrores.stock = "El stock inicial es obligatorio";
    } else if (Number(formData.stock) < 0) {
      nuevosErrores.stock = "El stock no puede ser un número negativo";
    }

    setErrors(nuevosErrores);

    // Si hay errores en los campos, lanzamos un toast de advertencia rápido
    if (Object.keys(nuevosErrores).length > 0) {
      toast.error("Por favor, revisa los campos obligatorios del formulario.");
    }

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const datosProcesados = {
      nombre: formData.nombre.trim(),
      precio: Number(formData.precio),
      sku: formData.sku.trim() || null,
      stock: Number(formData.stock),
    };

    // Función interna que ejecuta la petición y controla la promesa
    const guardarDatos = async () => {
      let resultado;
      if (productoEdicion?.id) {
        resultado = await updateRecord(productoEdicion.id, datosProcesados);
      } else {
        resultado = await createRecord(datosProcesados);
      }

      // Si el hook devuelve null, significa que Supabase falló (ej: RLS o SKU duplicado)
      if (!resultado) {
        throw new Error("No se pudo guardar en la base de datos.");
      }

      return resultado;
    };

    // 🔥 LA MAGIA DE SONNER: Registra la promesa para cambiar el estado del toast dinámicamente
    toast.promise(guardarDatos(), {
      loading: productoEdicion ? "Actualizando producto..." : "Creando producto...",
      success: (record) => {
        setErrors({});
        setTimeout(() => onExito(record as Producto), 300);
        return productoEdicion ? "¡Producto actualizado con éxito!" : "¡Producto creado con éxito!";
      },
      error: (err) => {
        return err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* INPUT: Nombre */}
      <NormalInput label="Nombre del Producto" icon={Package} placeholder="Ej: Teclado Mecánico Custom 60%" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} error={errors.nombre} disabled={loading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* INPUT: Precio */}
        <NormalInput label="Precio (CLP)" type="number" icon={DollarSign} placeholder="0" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} error={errors.precio} disabled={loading} />

        {/* INPUT: Stock */}
        <NormalInput label="Stock Disponible" type="number" icon={Hash} placeholder="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} error={errors.stock} disabled={loading} />
      </div>

      {/* INPUT: SKU */}
      <NormalInput label="Código SKU (Opcional)" type="text" icon={Hash} placeholder="Ej: TEC-60-BLACK" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} error={errors.sku} disabled={loading} />

      {/* --- FOOTER DEL FORMULARIO --- */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button type="submit" disabled={loading} variant={productoEdicion ? "success" : "primary"} size="md" className="w-full sm:w-auto px-8 font-semibold">
          {loading ? "Guardando..." : productoEdicion ? "Actualizar" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}
