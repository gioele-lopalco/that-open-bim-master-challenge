export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateProjectName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return {
      isValid: false,
      error: 'Project name is required'
    };
  }
  
  if (name.trim().length < 5) {
    return {
      isValid: false,
      error: 'Project name must be at least 5 characters long'
    };
  }
  
  return { isValid: true };
};

export const validateToDoTitle = (title: string): ValidationResult => {
  if (!title.trim()) {
    return {
      isValid: false,
      error: 'ToDo title is required'
    };
  }
  
  if (title.trim().length < 3) {
    return {
      isValid: false,
      error: 'ToDo title must be at least 3 characters long'
    };
  }
  
  return { isValid: true };
}; 