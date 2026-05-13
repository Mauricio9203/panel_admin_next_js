import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "next-themes";
// 1. Importa el componente
import SessionGuard from "@/components/SessionGuard";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* 2. Envuelve el children con el guardia de sesión */}
            <SessionGuard>{children}</SessionGuard>
            <ToasterProvider />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
