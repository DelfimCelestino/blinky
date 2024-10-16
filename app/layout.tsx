import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import PWAInstallPrompt from "@/components/pwa-install";
import Header from "@/components/header";
import { UniversalProvider } from "@/context/Universal-context-provider";

const roboto_condensed = Roboto_Condensed({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blinky - Gerenciamento de projectos",
  description:
    'Blinky é uma plataforma inovadora de gerenciamento de projetos, desenvolvida para ajudar equipes e indivíduos a organizarem suas tarefas de forma simples, intuitiva e eficiente. Com a presença do nosso mascote, o simpático "Blinky", facilitamos a gestão do seu tempo e a organização de tarefas através de uma interface amigável, visual e prática.',
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon512_rounded.png",
    apple: "/icon512_maskable.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto_condensed.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UniversalProvider>
            <Header />
            <main className="py-16">{children}</main>
          </UniversalProvider>
        </ThemeProvider>
        <PWAInstallPrompt />
        <Toaster />
      </body>
    </html>
  );
}
