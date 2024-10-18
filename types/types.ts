export interface Project {
  id: string;
  name: string;
  progress: number;
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  type: "Side Project" | "Freelancer" | "CLT";
  manager: string;
  createdAt: Date;
  lastUpdated: Date;
}
