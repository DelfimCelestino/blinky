"use client";

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
import { Slider } from "@/components/ui/slider";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  name: string;
  progress: number;
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  manager: string;
  createdAt: number;
  lastUpdated: number;
}

const AddProjectButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "Não Iniciado" | "Em Andamento" | "Concluído"
  >("Não Iniciado");
  const [progress, setProgress] = useState(0);
  const [manager, setManager] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const handleStatusChange = (value: string) => {
    setStatus(value as "Não Iniciado" | "Em Andamento" | "Concluído");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      progress,
      status,
      manager,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setName("");
    setStatus("Não Iniciado");
    setProgress(0);
    setManager("");
    setOpen(false);

    toast({
      title: "Projeto adicionado",
      description: "Seu novo projeto foi adicionado com sucesso.",
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Adicionar Novo Projeto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">Gerente do Projeto</Label>
            <Input
              id="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={handleStatusChange} defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">Progresso</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="progress"
                min={0}
                max={100}
                step={1}
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                className="flex-grow"
              />
              <span>{progress}%</span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Adicionar Projeto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectButton;
