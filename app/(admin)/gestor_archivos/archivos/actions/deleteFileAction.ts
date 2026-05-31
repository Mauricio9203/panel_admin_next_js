"use server";

import { r2Client, BUCKET_NAME } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function deleteFileAction(id: string, url_r2: string) {
  try {
    // 1. Extraer la 'key' de la URL
    // Ejemplo URL: https://pub-xxx.r2.dev/uuid-archivo.pdf -> key es "uuid-archivo.pdf"
    const urlParts = url_r2.split("/");
    const key = urlParts[urlParts.length - 1];

    if (!key) throw new Error("No se pudo determinar la clave del archivo");

    // 2. Borrar en Cloudflare R2
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    // 3. Borrar en Supabase
    const { error } = await supabaseAdmin
      .from("documentos")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error eliminando archivo:", error);
    return { success: false, error: error.message };
  }
}