// proxy.ts — Next.js 16 middleware
// La autenticación la maneja SessionGuard en el cliente (Supabase usa localStorage).
// Este archivo simplemente deja pasar todas las rutas sin bloquear.
import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tablas/:path*", "/componentes/:path*"],
};
