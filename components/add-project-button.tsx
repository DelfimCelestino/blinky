"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUniversalContext } from "@/context/Universal-context-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/types";

export const AddProjectButton = () => {
  const { addProject } = useUniversalContext();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "Não Iniciado" | "Em Andamento" | "Concluído"
  >("Não Iniciado");
  const [type, setType] = useState<"Side Project" | "Freelancer" | "CLT">(
    "Side Project"
  );
  const [manager, setManager] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !manager) {
      toast({
        title: "Erro de validação",
        description: "O nome e o gerente do projeto são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const newProject: Omit<Project, "id" | "createdAt" | "lastUpdated"> = {
      name,
      progress,
      status,
      manager,
      type,
    };

    try {
      await addProject(newProject);
      setName("");
      setStatus("Não Iniciado");
      setProgress(0);
      setManager("");
      setType("Side Project");
      setOpen(false);
      toast({
        title: "Projeto adicionado",
        description: "O novo projeto foi adicionado com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manager">Gerente do Projeto</Label>
              <Input
                id="manager"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setStatus(
                    value as "Não Iniciado" | "Em Andamento" | "Concluído"
                  )
                }
                value={status}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Projeto</Label>
              <Select
                onValueChange={(value) =>
                  setType(value as "Side Project" | "Freelancer" | "CLT")
                }
                value={type}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar tipo de projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Side Project">Side Project</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="CLT">CLT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="progress">Progresso (%)</Label>
              <Slider
                id="progress"
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                className="mt-1"
              />
              <div className="text-sm text-gray-500 mt-1">
                Progresso: {progress}%
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
