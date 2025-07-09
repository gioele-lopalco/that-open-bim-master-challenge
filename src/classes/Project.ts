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