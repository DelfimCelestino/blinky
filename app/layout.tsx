import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import PWAInstallPrompt from "@/components/pwa-install";
import Header from "@/components/header";
import { UniversalProvider } from "@/context/Universal-context-provider";
import Script from "next/script";
import { Suspense } from "react";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdate";

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
  other: {
    "google-adsense-account": "ca-pub-4787090241107157",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4787090241107157"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={roboto_condensed.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UniversalProvider>
            <Header />
            <Suspense>
              <main className="py-16">
                {children} <ServiceWorkerUpdater />
              </main>
            </Suspense>
          </UniversalProvider>
        </ThemeProvider>
        <PWAInstallPrompt />
        <Toaster />
      </body>
    </html>
  );
}
