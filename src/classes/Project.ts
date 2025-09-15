export const TodoStatus = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled'
} as const;

export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];

export const TodoPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
} as const;

export type TodoPriority = typeof TodoPriority[keyof typeof TodoPriority];

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  updatedAt?: Date;
  assignedTo?: string;
  projectId: string;
  icon?: string;
  // Aggiunti per il collegamento al modello BIM
  linkedElements?: ModelElement[];
}

export interface ModelElement {
  modelId: string;
  elementId: string;
  elementName?: string;
  elementType?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  onClick?: () => void;
}

export const ProjectStatus = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const UserRole = {
  ENGINEER: 'Engineer',
  ARCHITECT: 'Architect',
  PROJECT_MANAGER: 'Project Manager',
  SUPERVISOR: 'Supervisor',
  DEVELOPER: 'Developer'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface IProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  cost: number;
  userRole: UserRole;
  finishDate: Date;
  progress: number;
}

// Type alias for compatibility
export type Project = IProject; 