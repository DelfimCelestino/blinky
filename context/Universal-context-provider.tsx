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
  ) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
}

const MyUniversalContext = createContext<UniversalContextType | undefined>(
  undefined
);

export const UniversalProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar projetos
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Erro ${response.status}: Falha ao buscar projetos.`
        );
      }
      const data = await response.json();
      setProjects(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao buscar projetos";
      console.error("Erro ao buscar projetos:", message);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os projetos. Verifique a conexão ou o servidor.",
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
    async (newProject: Omit<Project, "id" | "createdAt" | "lastUpdated">) => {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Erro ${response.status}: Falha ao adicionar o projeto.`
          );
        }

        const addedProject = await response.json();
        setProjects((prevProjects) => [...prevProjects, addedProject]);

        toast({
          title: "Projeto adicionado",
          description: "Seu novo projeto foi adicionado com sucesso.",
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao adicionar projeto";
        console.error("Erro ao adicionar projeto:", message);
        toast({
          title: "Erro",
          description: `Não foi possível adicionar o projeto: ${message}`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Função para atualizar projeto
  const updateProject = useCallback(
    async (updatedProject: Project) => {
      try {
        const response = await fetch(`/api/projects/${updatedProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProject),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Erro ${response.status}: Falha ao atualizar o projeto.`
          );
        }

        const updated = await response.json();
        setProjects((prevProjects) =>
          prevProjects.map((p) => (p.id === updated.id ? updated : p))
        );

        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso.",
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao atualizar projeto";
        console.error("Erro ao atualizar projeto:", message);
        toast({
          title: "Erro",
          description: `Não foi possível atualizar o projeto: ${message}`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Função para excluir projeto
  const deleteProject = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Erro ${response.status}: Falha ao excluir o projeto.`
          );
        }

        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));

        toast({
          title: "Projeto excluído",
          description: "O projeto foi removido com sucesso.",
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao excluir projeto";
        console.error("Erro ao excluir projeto:", message);
        toast({
          title: "Erro",
          description: `Não foi possível excluir o projeto: ${message}`,
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
