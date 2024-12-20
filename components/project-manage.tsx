"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniversalContext } from "@/context/Universal-context-provider";
import { Project } from "@/types/types";

export default function ProjectManage() {
  const { projects, isLoading, updateProject, deleteProject } =
    useUniversalContext();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Não Iniciado":
        return "bg-red-500";
      case "Em Andamento":
        return "bg-yellow-500";
      case "Concluído":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProjectMessage = (project: Project) => {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(project.lastUpdated).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (project.progress >= 90 && project.progress < 100) {
      return "🚀 Você está quase lá!";
    } else if (daysSinceUpdate > 5) {
      return "😢 Você me abandonou?";
    } else if (project.progress === 0) {
      return "🌱 Começando uma nova jornada!";
    } else if (project.progress <= 80) {
      return "😊 Em andamento, vamos a isso";
    } else if (project.progress === 100) {
      return "🎉 Parabéns! Projeto concluído com sucesso!";
    } else {
      return "";
    }
  };

  const getMotivationalMessage = (completedProjects: number) => {
    if (completedProjects === 0) {
      return "Você ainda não concluiu nenhum projeto. Vamos começar! 💪";
    } else if (completedProjects === 1) {
      return "Parabéns pela sua primeira conclusão! Continue assim! 🌟";
    } else if (completedProjects < 5) {
      return `Incrível! Você já concluiu ${completedProjects} projetos. Está no caminho certo! 🚀`;
    } else {
      return `Uau! ${completedProjects} projetos concluídos! Você é imparável! 🏆`;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.manager?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || project.status === statusFilter;
    const matchesType = typeFilter === "Todos" || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const completedProjects = projects.filter(
    (project) => project.status === "Concluído"
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando projetos...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Pesquisar projetos ou gerentes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Status</SelectItem>
            <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Tipos</SelectItem>
            <SelectItem value="Side Project">Side Project</SelectItem>
            <SelectItem value="Freelancer">Freelancer</SelectItem>
            <SelectItem value="CLT">CLT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        <div className="mb-6">
          <p className="text-xs lg:text-lg text-muted-foreground">
            {getMotivationalMessage(completedProjects)}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm dark:hover:shadow-gray-800">
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(
                    project.status
                  )}`}
                ></div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-semibold truncate text-primary">
                      {project.name}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProject(project)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project.id)}
                        className="hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${getStatusColor(
                          project.status
                        )} text-white`}
                      >
                        {project.status}
                      </Badge>
                      <Badge className="bg-blue-500 text-white">
                        {project.type}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {project.progress}% Concluído
                    </span>
                  </div>
                  <Progress
                    value={project.progress}
                    max={100}
                    color={getStatusColor(project.status)}
                    className="w-full h-2 mb-2 bg-gray-200 dark:bg-gray-700"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Gerente: {project.manager}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {getProjectMessage(project)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <Dialog
        open={!!editingProject}
        onOpenChange={() => setEditingProject(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Editar Projeto
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingProject) {
                const formData = new FormData(e.currentTarget);
                const updatedProject: Project = {
                  ...editingProject,
                  name: (formData.get("name") as string) || "",
                  manager: (formData.get("manager") as string) || "",
                  status:
                    (formData.get("status") as
                      | "Não Iniciado"
                      | "Em Andamento"
                      | "Concluído") || "Não Iniciado",
                  type:
                    (formData.get("type") as
                      | "Side Project"
                      | "Freelancer"
                      | "CLT") || "Side Project",
                  progress:
                    formData.get("progress") !== null
                      ? parseInt(formData.get("progress") as string, 10) || 0
                      : 0,
                };

                updateProject(updatedProject);
                setEditingProject(null);
              }
            }}
          >
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              name="name"
              defaultValue={editingProject?.name}
              required
              className="mb-4"
            />
            <Label htmlFor="manager">Gerente</Label>
            <Input
              id="manager"
              name="manager"
              defaultValue={editingProject?.manager}
              required
              className="mb-4"
            />
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={editingProject?.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="type">Tipo de Projeto</Label>
            <Select name="type" defaultValue={editingProject?.type}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Side Project">Side Project</SelectItem>
                <SelectItem value="Freelancer">Freelancer</SelectItem>
                <SelectItem value="CLT">CLT</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="progress">Progresso</Label>
            <Slider
              id="edit-progress"
              name="progress"
              min={0}
              max={100}
              step={1}
              defaultValue={[editingProject?.progress || 0]}
              className="flex-grow"
            />
            <Button type="submit" className="mt-4">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
