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
        // Usuario de prueba para validar que todo funcione
        // Puedes cambiar estos valores por los que prefieras
        if (credentials?.email === "admin@test.com" && credentials?.password === "1234") {
          return { id: "1", name: "Usuario Desarrollador", email: "admin@test.com" };
        }
        return null;
      }
    })
  ],
  // Usamos la variable que ya agregaste al .env.local
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login', // Aquí es donde crearemos tu login personalizado
  }
});

export { handler as GET, handler as POST };