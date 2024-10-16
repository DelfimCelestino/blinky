export interface Project {
  id: string;
  name: string;
  progress: number;
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  manager: string;
  createdAt: number;
  lastUpdated: number;
}
