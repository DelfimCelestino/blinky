"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GerenciadorDeProjetos from "@/components/project-manage";
import FinanceDashboard from "@/components/finance-dashboard";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl font-bold">Hello 😊</h1>
        <ModeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

      <div className="fixed bottom-4 left-4 text-sm text-gray-500">
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
