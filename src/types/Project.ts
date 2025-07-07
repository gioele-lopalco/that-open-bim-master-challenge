export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  cost: number;
  role: string;
  finishDate: string;
  progress: number;
  avatar: string;
}

export interface TodoItem {
  id: string;
  text: string;
  date: string;
  icon: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  path?: string; // Per le route di navigazione
  onClick?: () => void; // Per azioni speciali come logout
} 