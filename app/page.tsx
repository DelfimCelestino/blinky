"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toogle";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Project {
  id: string;
  name: string;
  progress: number;
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  manager: string;
  createdAt: number;
  lastUpdated: number;
}

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

export default function GerenciadorDeProjetos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "Não Iniciado" | "Em Andamento" | "Concluído"
  >("Não Iniciado");
  const [progress, setProgress] = useState(0);
  const [manager, setManager] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const { toast } = useToast();

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        await navigator.serviceWorker.register("/service-worker.js");
      };

      handleServiceWorker();
    }
  }, []);

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast({
      title: "Projeto excluído",
      description: "O projeto foi removido com sucesso.",
    });
  };

  const updateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id
        ? {
            ...project,
            name: updatedProject.name || project.name,
            manager: updatedProject.manager || project.manager,
            status: updatedProject.status || project.status,
            progress:
              updatedProject.progress !== undefined
                ? updatedProject.progress
                : project.progress,
            lastUpdated: Date.now(),
          }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast({
      title: "Projeto atualizado",
      description: "O projeto foi atualizado com sucesso.",
    });
    setEditingProject(null);
  };

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
      (Date.now() - project.lastUpdated) / (1000 * 60 * 60 * 24)
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
      return "🎉 Parabéns! Concluído";
    } else {
      return "";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (project.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "Todos" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectStats = {
    total: projects.length,
    notStarted: projects.filter((p) => p.status === "Não Iniciado").length,
    inProgress: projects.filter((p) => p.status === "Em Andamento").length,
    completed: projects.filter((p) => p.status === "Concluído").length,
  };

  const projectProgressData = projects.map((project) => ({
    name: project.name,
    progress: project.progress,
  }));

  const projectStatusData = [
    { name: "Não Iniciado", value: projectStats.notStarted },
    { name: "Em Andamento", value: projectStats.inProgress },
    { name: "Concluído", value: projectStats.completed },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ModeToggle />

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
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
          </div>

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
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
                            onClick={() => {
                              setEditingProject(project);
                              setName(project.name);
                              setManager(project.manager);
                              setStatus(project.status);
                              setProgress(project.progress);
                            }}
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
                        <Badge
                          className={`${getStatusColor(
                            project.status
                          )} text-white`}
                        >
                          {project.status}
                        </Badge>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {project.progress}% Concluído
                        </span>
                      </div>
                      <Progress
                        value={project.progress}
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
        </TabsContent>
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progresso dos Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectProgressData}>
                    <CartesianGrid strokeDasharray="3  3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status dos Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {editingProject && (
        <Dialog open={true} onOpenChange={() => setEditingProject(null)}>
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
                    name: formData.get("name") as string,
                    manager: formData.get("manager") as string,
                    status: formData.get("status") as
                      | "Não Iniciado"
                      | "Em Andamento"
                      | "Concluído",
                    progress: parseInt(formData.get("progress") as string),
                  };
                  updateProject(updatedProject);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Projeto</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingProject.name}
                  required
                  className="focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Gerente do Projeto</Label>
                <Input
                  id="edit-manager"
                  name="manager"
                  defaultValue={editingProject.manager}
                  required
                  className="focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingProject.status}>
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
                <Label htmlFor="edit-progress">Progresso</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="edit-progress"
                    name="progress"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={[editingProject.progress]}
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
                Atualizar Projeto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="fixed bottom-4 left-4">
        <span>
          Made with ❤️ by{" "}
          <a href="https://github.com/delfimcelestino">Delfim Celestino</a>
        </span>
      </div>
    </div>
  );
}
