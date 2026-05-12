import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@test.com" && credentials?.password === "1234") {
          return { id: "1", name: "Usuario Desarrollador", email: "admin@test.com" };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // 1. Duración máxima de la sesión (24 horas)
    maxAge: 12 * 60 * 60, 
    // 2. Cada cuánto tiempo NextAuth actualiza la sesión en la base de datos/cookie
    // Por ejemplo, si el usuario entra a las 12h, y navega a las 13h, 
    // su tiempo de expiración se extiende otras 24h desde ese momento.
    updateAge: 1 * 60 * 60, 
  },
  pages: {
    signIn: '/login',
  },
  // Opcional: añade callbacks para manejar el token si necesitas más datos
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };