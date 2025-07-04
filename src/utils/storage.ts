import type { Project } from '../models/Project';

const STORAGE_KEY = 'projects-data';

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
};

export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export const exportProjectsToJSON = (projects: Project[]): string => {
  return JSON.stringify(projects, null, 2);
};

export const importProjectsFromJSON = (jsonString: string): Project[] => {
  try {
    const imported = JSON.parse(jsonString);
    if (Array.isArray(imported)) {
      return imported.map(project => ({
        ...project,
        isImported: true,
        updatedAt: new Date().toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error('Import error:', error);
    return [];
  }
};

export const downloadJSON = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
}; 