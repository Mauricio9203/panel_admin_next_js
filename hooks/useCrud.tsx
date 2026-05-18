import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 1. Usamos un "extends" para asegurar que T sea un objeto indexable básico
export function useCrud<T extends Record<string, any>>(tableName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // INSERTAR
  // 2. En lugar de Partial<T>, usamos un objeto cuyas llaves coincidan con el esquema
  const createRecord = async (recordData: Record<keyof T, any> | Partial<T>) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from(tableName)
      .insert(recordData as any) // 3. Forzamos el caspeo a 'any' aquí para calmar el validador estricto de Supabase
      .select();

    setLoading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    return data?.[0] as T;
  };

  // ACTUALIZAR (UPDATE)
  const updateRecord = async (id: string | number, recordData: Partial<T>) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from(tableName)
      .update(recordData as any) // 3. Volvemos a castear a 'any' temporalmente para la query interna
      .eq("id", id)
      .select();

    setLoading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    return data?.[0] as T;
  };

  // ELIMINAR (DELETE)
  const deleteRecord = async (id: string | number) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    setLoading(false);
    if (error) {
      setError(error.message);
      return false;
    }
    return true;
  };

  return { createRecord, updateRecord, deleteRecord, loading, error };
}
