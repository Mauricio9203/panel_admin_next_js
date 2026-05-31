"use server";

import { r2Client, BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No se recibió ningún archivo");

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generamos un nombre único para evitar colisiones en R2
    const fileExtension = file.name.split('.').pop();
    const uniqueKey = `${uuidv4()}.${fileExtension}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Construimos la URL pública (Esto depende de si tienes un dominio en R2 o usas el endpoint)
    // Usualmente: https://<tu-bucket-url>/<key>
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueKey}`;

    return { 
      success: true, 
      url: publicUrl,
      key: uniqueKey 
    };
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return { success: false, error: error.message };
  }
}