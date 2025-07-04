import type { ToDo } from './ToDo';

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  dueDate: string;
  todos: ToDo[];
  createdAt: string;
  updatedAt: string;
  isImported?: boolean;
}

export const PROJECT_COLORS = [
  '#3B82F6', // blu
  '#EF4444', // rosso
  '#10B981', // verde
  '#F59E0B', // arancione
  '#8B5CF6', // viola
  '#EC4899'  // rosa
];

export const getRandomColor = (): string => {
  return PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
};

export const generateProjectIcon = (name: string): string => {
  return name.substring(0, 2).toUpperCase();
};

export const getDefaultDueDate = (): string => {
  return new Date().toISOString();
}; 