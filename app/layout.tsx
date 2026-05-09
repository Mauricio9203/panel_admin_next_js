import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Panel de administración industrial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className={`${inter.className} h-full antialiased`} suppressHydrationWarning={true}>
        {/* AuthProvider envuelve toda la app para gestionar la sesión global */}
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme" disableTransitionOnChange>
            {/* 
               IMPORTANTE: Aquí inyectamos {children} directamente. 
               Ya NO envolvemos con <Layout>, permitiendo que cada 
               Route Group determine su propia estructura visual.
            */}
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
