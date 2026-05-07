export interface Tarea {
  id: number;
  name: string;  
  done: boolean;  
  createdAt?: string;
  updatedAt?: string;
}

export interface RespuestaTareas {
  total: number;
  page: number;
  pages: number;
  data: Tarea[];
}