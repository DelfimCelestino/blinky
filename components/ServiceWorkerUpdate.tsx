"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DownloadIcon } from "lucide-react";

const ServiceWorkerUpdater: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          checkForUpdates(registration);

          // Check for updates every 5 minutes
          setInterval(() => checkForUpdates(registration), 5 * 60 * 1000);
        });
    }
  }, []);

  const checkForUpdates = async (registration: ServiceWorkerRegistration) => {
    try {
      await registration.update();
      if (registration.waiting) {
        const currentVersion = await getCurrentVersion();
        const newVersion = await getNewVersion(registration.waiting);

        if (newVersion > currentVersion) {
          setUpdateAvailable(true);
        }
      }
    } catch (error) {
      console.error("Error checking for service worker updates:", error);
    }
  };

  const getCurrentVersion = (): Promise<number> => {
    return new Promise((resolve) => {
      navigator.serviceWorker.controller?.postMessage({ type: "GET_VERSION" }, [
        new MessageChannel().port2,
      ]);
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (typeof event.data === "number") {
          resolve(event.data);
        }
      });
    });
  };

  const getNewVersion = (worker: ServiceWorker): Promise<number> => {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (typeof event.data === "number") {
          resolve(event.data);
        }
      };
      worker.postMessage({ type: "GET_VERSION" }, [messageChannel.port2]);
    });
  };

  const updateServiceWorker = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
    toast({
      title: "Aplicação atualizada",
      description: "A nova versão foi instalada com sucesso.",
    });
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <Button
      onClick={updateServiceWorker}
      className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Atualizar aplicação <DownloadIcon className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default ServiceWorkerUpdater;
