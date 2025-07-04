export type ToDoStatus = 'todo' | 'in-progress' | 'done';

export interface ToDo {
  id: string;
  title: string;
  description: string;
  status: ToDoStatus;
  createdAt: string;
}

export const DEFAULT_TODO_STATUS: ToDoStatus = 'todo';

export const TODO_STATUS_LABELS: Record<ToDoStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Completed'
};

export const TODO_STATUS_COLORS: Record<ToDoStatus, string> = {
  'todo': '#f3f4f6',     // grigio chiaro
  'in-progress': '#fbbf24', // giallo
  'done': '#10b981'      // verde
}; 