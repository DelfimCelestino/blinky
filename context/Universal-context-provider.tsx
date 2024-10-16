"use client";

import { Project } from "@/types/types";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useToast } from "@/hooks/use-toast";

interface UniversalContextType {
  projects: Project[];
  isLoading: boolean;
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "lastUpdated">
  ) => void; // Mudado para void, pois não há async/await no Local Storage
  updateProject: (project: Project) => void; // Mudado para void
  deleteProject: (id: string) => void; // Mudado para void
  fetchProjects: () => void; // Mudado para void
}

const MyUniversalContext = createContext<UniversalContextType | undefined>(
  undefined
);

export const UniversalProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar projetos do Local Storage
  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem("projects") || "[]");
      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar projetos do Local Storage:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        await navigator.serviceWorker.register("/service-worker.js");
      };
      handleServiceWorker();
    }
  }, [fetchProjects]);

  // Função para adicionar projeto
  const addProject = useCallback(
    (newProject: Omit<Project, "id" | "createdAt" | "lastUpdated">) => {
      try {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const addedProject = {
          id: Date.now().toString(), // Gerar um ID único
          ...newProject,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        projects.push(addedProject);
        localStorage.setItem("projects", JSON.stringify(projects));
        setProjects(projects);

        toast({
          title: "Projeto adicionado",
          description: "Seu novo projeto foi adicionado com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao adicionar projeto:", error);
        toast({
          title: "Erro",
          description: `Não foi possível adicionar o projeto: ${error}`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Função para atualizar projeto
  const updateProject = useCallback(
    (updatedProject: Project) => {
      try {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const updatedProjects = projects.map((p: Project) =>
          p.id === updatedProject.id ? { ...updatedProject } : p
        );
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);

        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        toast({
          title: "Erro",
          description: `Não foi possível atualizar o projeto: ${error}`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Função para excluir projeto
  const deleteProject = useCallback(
    (id: string) => {
      try {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const updatedProjects = projects.filter((p: Project) => p.id !== id);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);

        toast({
          title: "Projeto excluído",
          description: "O projeto foi removido com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        toast({
          title: "Erro",
          description: `Não foi possível excluir o projeto: ${error}`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const value: UniversalContextType = {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    fetchProjects,
  };

  return (
    <MyUniversalContext.Provider value={value}>
      {children}
    </MyUniversalContext.Provider>
  );
};

export const useUniversalContext = (): UniversalContextType => {
  const context = useContext(MyUniversalContext);
  if (context === undefined) {
    throw new Error(
      "useUniversalContext must be used within a UniversalProvider"
    );
  }
  return context;
};
