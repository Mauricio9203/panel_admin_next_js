import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "next-themes";
import SessionGuard from "@/components/SessionGuard";
import ToasterProvider from "@/components/ToasterProvider";
import ThemeVars from "@/components/ThemeVars";
import { loadTheme } from "@/lib/themeLoader";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await loadTheme();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Inyecta las CSS custom properties del tema activo */}
        <ThemeVars theme={theme} />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionGuard>{children}</SessionGuard>
            <ToasterProvider />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
