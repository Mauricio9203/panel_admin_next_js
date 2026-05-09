import type { NextConfig } from "next";

const nextConfig = {
  // En algunas versiones de Next 15/16 se movió a la raíz o se cambió el nombre
  // Si 'experimental' falla, intenta definirlo así:
  allowedDevOrigins: ['172.26.208.1', '192.168.4.44'],
  
  experimental: {
    // otras opciones
  },
} as NextConfig; 

export default nextConfig;