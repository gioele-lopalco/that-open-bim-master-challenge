import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '../models/Project';
import { generateProjectIcon, getRandomColor, getDefaultDueDate } from '../models/Project';
import { validateProjectName } from '../utils/validation';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    dueDate: project?.dueDate?.split('T')[0] || ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Remove error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameValidation = validateProjectName(formData.name);
    if (!nameValidation.isValid) {
      setErrors({ name: nameValidation.error! });
      return;
    }
    
    setIsSubmitting(true);
    
    const now = new Date().toISOString();
    const projectData: Project = {
      id: project?.id || uuidv4(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      icon: generateProjectIcon(formData.name),
      color: project?.color || getRandomColor(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : getDefaultDueDate(),
      todos: project?.todos || [],
      createdAt: project?.createdAt || now,
      updatedAt: now,
      isImported: project?.isImported
    };
    
    onSubmit(projectData);
    setIsSubmitting(false);
  };

  return (
    <div className="project-form">
      <div className="project-form__header">
        <h2>{project ? 'Edit Project' : 'New Project'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="project-form__form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter project name (min. 5 characters)"
            required
          />
          {errors.name && (
            <div className="form-error">{errors.name}</div>
          )}
          {formData.name.length >= 2 && (
            <div className="form-hint">
              Project icon: <strong>{generateProjectIcon(formData.name)}</strong>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Project description (optional)"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="form-input"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
          <div className="form-hint">
            If not specified, today's date will be used
          </div>
        </div>

        <div className="project-form__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (project ? 'Update' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
}; 