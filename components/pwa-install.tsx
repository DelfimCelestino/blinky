/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2 } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsOpen(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as any
    );

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode =
      "standalone" in window.navigator && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      setShowIOSInstall(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as any
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("Usuário aceitou o pedido de instalação");
      } else {
        console.log("Usuário rejeitou o pedido de instalação");
      }
      setDeferredPrompt(null);
    }
    setIsOpen(false);
  };

  const handleIOSInstall = () => {
    alert(
      "Para instalar o app no seu dispositivo iOS:\n1. Toque no botão de Compartilhar no seu navegador.\n2. Role para baixo e toque em 'Adicionar à Tela de Início'.\n3. Dê um nome ao atalho e toque em 'Adicionar'."
    );
  };

  if (!deferredPrompt && !showIOSInstall) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {" "}
              <div className="relative h-10 w-10 lg:h-16 lg:w-20">
                <Image
                  src="/icon.png"
                  alt="logo"
                  fill
                  sizes="(max-width: 1024px) 40px, 80px"
                  className="object-cover"
                  priority
                />
              </div>
              Instale o App
            </DialogTitle>
            <DialogDescription>
              Instale nosso aplicativo para uma experiência melhor e acesso
              offline.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInstall}>Instalar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showIOSInstall && (
        <Button
          className="fixed bottom-4 right-4 z-50"
          onClick={handleIOSInstall}
        >
          <Share2 className="mr-2 h-4 w-4" /> Adicionar à Tela de Início
        </Button>
      )}
    </>
  );
};

export default PWAInstallPrompt;
