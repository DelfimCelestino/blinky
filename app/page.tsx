"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GerenciadorDeProjetos from "@/components/project-manage";
import FinanceDashboard from "@/components/finance-dashboard";
import { ModeToggle } from "@/components/mode-toggle";

const goodMorningMessages = [
  "Bom dia! Que seu dia seja produtivo e cheio de conquistas! ☀️",
  "Olá! Pronto para mais um dia de sucesso? 💪",
  "Bom dia! Lembre-se: cada novo dia é uma nova oportunidade! 🌟",
  "Começando o dia com energia positiva! Bom dia! 🌈",
  "Que seu café da manhã venha acompanhado de muita motivação! ☕",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("projects");
  const [goodMorningMessage, setGoodMorningMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "projects" || tab === "finances")) {
      setActiveTab(tab);
    }

    const randomIndex = Math.floor(Math.random() * goodMorningMessages.length);
    setGoodMorningMessage(goodMorningMessages[randomIndex]);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`?tab=${value}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl font-bold">{goodMorningMessage}</h1>
        <ModeToggle />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="finances">Finanças</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <GerenciadorDeProjetos />
        </TabsContent>
        <TabsContent value="finances">
          <FinanceDashboard />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-4 left-4 text-sm text-muted-foreground">
        <span>
          Made with ❤️ by{" "}
          <a href="https://github.com/delfimcelestino" className="underline">
            Delfim Celestino
          </a>
        </span>
      </div>
    </div>
  );
}
