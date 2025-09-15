import React, { useState, useEffect } from 'react';
import type { TodoItem } from '../classes/Project';
import { TodoStatus, TodoPriority } from '../classes/Project';
import { useModelSelection } from '../contexts/ModelSelectionContext';
import './ToDoForm.css';

interface ToDoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todoData: Omit<TodoItem, 'id' | 'updatedAt'>) => Promise<void>;
  initialData?: TodoItem | null;
  projectId: string;
}

const ToDoForm: React.FC<ToDoFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  projectId 
}) => {
  const { selectedElements, clearSelection } = useModelSelection();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TodoStatus.TODO as TodoStatus,
    priority: TodoPriority.MEDIUM as TodoPriority,
    assignedTo: '',
    icon: 'task'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo || '',
        icon: initialData.icon || 'task'
      });
    } else {
      // Reset form when opening for new todo
      setFormData({
        title: '',
        description: '',
        status: TodoStatus.TODO as TodoStatus,
        priority: TodoPriority.MEDIUM as TodoPriority,
        assignedTo: '',
        icon: 'task'
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setFormData(prev => ({ ...prev, status: value as TodoStatus }));
    } else if (name === 'priority') {
      setFormData(prev => ({ ...prev, priority: value as TodoPriority }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    
    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo.trim() || undefined,
        projectId,
        icon: formData.icon,
        // Includi gli elementi selezionati solo se non stiamo modificando un todo esistente
        linkedElements: !initialData && selectedElements.length > 0 ? selectedElements : initialData?.linkedElements
      };

      await onSubmit(todoData);
      
      // Pulisci la selezione solo se abbiamo creato un nuovo todo
      if (!initialData && selectedElements.length > 0) {
        clearSelection();
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting todo:', error);
      alert('Error saving task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityColors = {
    [TodoPriority.LOW]: '#10b981',
    [TodoPriority.MEDIUM]: '#f59e0b', 
    [TodoPriority.HIGH]: '#ef4444',
    [TodoPriority.URGENT]: '#dc2626'
  };

  const statusIcons = {
    [TodoStatus.TODO]: 'radio_button_unchecked',
    [TodoStatus.IN_PROGRESS]: 'schedule',
    [TodoStatus.DONE]: 'check_circle',
    [TodoStatus.CANCELLED]: 'cancel'
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed task description..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Mostra gli elementi collegati */}
          {(selectedElements.length > 0 && !initialData) || (initialData?.linkedElements && initialData.linkedElements.length > 0) ? (
            <div className="form-group">
              <label>Elementi BIM collegati</label>
              <div className="linked-elements">
                {(selectedElements.length > 0 && !initialData ? selectedElements : initialData?.linkedElements || []).map((element, index) => (
                  <div key={`${element.modelId}-${element.elementId}-${index}`} className="linked-element">
                    <span className="material-symbols-outlined">construction</span>
                    <div className="element-info">
                      <div className="element-name">{element.elementName}</div>
                      <div className="element-details">{element.elementType} - ID: {element.elementId}</div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedElements.length > 0 && !initialData && (
                <small className="help-text">
                  <span className="material-symbols-outlined">info</span>
                  Questi elementi sono stati selezionati nel viewer BIM e verranno collegati a questo task.
                </small>
              )}
            </div>
          ) : (
            !initialData && (
              <div className="form-group">
                <label>Elementi BIM collegati</label>
                <div className="no-selection">
                  <span className="material-symbols-outlined">info</span>
                  <span>Nessun elemento selezionato nel viewer. Seleziona elementi nel modello BIM per collegarli a questo task.</span>
                </div>
              </div>
            )
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <div className="select-wrapper">
                <span className="material-symbols-outlined select-icon">
                  {statusIcons[formData.status]}
                </span>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {Object.values(TodoStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <div className="select-wrapper">
                <div 
                  className="priority-indicator"
                  style={{ backgroundColor: priorityColors[formData.priority] }}
                />
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  {Object.values(TodoPriority).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo">Assigned to</label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                placeholder="Person's name..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="Material Symbols icon name..."
              disabled={isSubmitting}
            />
            <small className="form-help">
              Use Material Symbols icon names (e.g: task, build, architecture)
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn--secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToDoForm; 