// proxy.ts (o middleware.ts si decides mantener el nombre y solo arreglar la función)
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica personalizada si la necesitas en el futuro
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Retorna true si hay un token (usuario logueado)
    },
    pages: {
      signIn: "/login", // Redirige aquí si no está autorizado
    },
  }
);

export const config = { 
  // Protegemos el dashboard y cualquier ruta bajo (admin)
  matcher: ["/dashboard/:path*", "/tablas/:path*", "/componentes/:path*"] 
};