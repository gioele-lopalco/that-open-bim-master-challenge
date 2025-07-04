import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ToDo, ToDoStatus } from '../models/ToDo';
import { DEFAULT_TODO_STATUS, TODO_STATUS_LABELS } from '../models/ToDo';
import { validateToDoTitle } from '../utils/validation';

interface ToDoFormProps {
  todo?: ToDo;
  onSubmit: (todo: ToDo) => void;
  onCancel: () => void;
}

export const ToDoForm: React.FC<ToDoFormProps> = ({
  todo,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    status: todo?.status || DEFAULT_TODO_STATUS
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    const titleValidation = validateToDoTitle(formData.title);
    if (!titleValidation.isValid) {
      setErrors({ title: titleValidation.error! });
      return;
    }
    
    setIsSubmitting(true);
    
    const now = new Date().toISOString();
    const todoData: ToDo = {
      id: todo?.id || uuidv4(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status as ToDoStatus,
      createdAt: todo?.createdAt || now
    };
    
    onSubmit(todoData);
    setIsSubmitting(false);
  };

  return (
    <div className="todo-form">
      <div className="todo-form__header">
        <h3>{todo ? 'Edit ToDo' : 'New ToDo'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="todo-form__form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-input ${errors.title ? 'form-input--error' : ''}`}
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter ToDo title (min. 3 characters)"
            required
          />
          {errors.title && (
            <div className="form-error">{errors.title}</div>
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
            placeholder="Detailed ToDo description (optional)"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleInputChange}
          >
            {Object.entries(TODO_STATUS_LABELS).map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="todo-form__actions">
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
            {isSubmitting ? 'Saving...' : (todo ? 'Update' : 'Create ToDo')}
          </button>
        </div>
      </form>
    </div>
  );
}; 