"use client";

import { Project } from "@/types/types";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface UniversalContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

const MyUniversalContext = createContext<UniversalContextType | undefined>(
  undefined
);

export const UniversalProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

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

  const value: UniversalContextType = {
    projects,
    setProjects,
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
