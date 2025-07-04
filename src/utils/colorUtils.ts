import type { ToDoStatus } from '../models/ToDo';

export const getTodoStatusColor = (status: ToDoStatus): string => {
  const colors = {
    'todo': '#f3f4f6',       // grigio chiaro
    'in-progress': '#fbbf24', // giallo
    'done': '#10b981'        // verde
  };
  return colors[status];
};

export const getTodoStatusTextColor = (status: ToDoStatus): string => {
  const textColors = {
    'todo': '#374151',       // grigio scuro
    'in-progress': '#92400e', // marrone scuro
    'done': '#065f46'        // verde scuro
  };
  return textColors[status];
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const lightenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}; 