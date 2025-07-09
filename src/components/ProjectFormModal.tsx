import React, { useState, useEffect } from 'react';
import type { IProject } from '../classes/Project';
import { ProjectStatus, UserRole } from '../classes/Project';
import './ProjectFormModal.css';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Omit<IProject, 'id'>) => Promise<void>;
  initialData?: IProject | null;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: ProjectStatus.ACTIVE as ProjectStatus,
    cost: 0,
    userRole: UserRole.ENGINEER as UserRole,
    finishDate: '',
    progress: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status as ProjectStatus,
        cost: initialData.cost,
        userRole: initialData.userRole as UserRole,
        finishDate: new Date(initialData.finishDate).toISOString().split('T')[0],
        progress: initialData.progress
      });
    } else {
      // Reset form when opening for new project
      setFormData({
        name: '',
        description: '',
        status: ProjectStatus.ACTIVE as ProjectStatus,
        cost: 0,
        userRole: UserRole.ENGINEER as UserRole,
        finishDate: '',
        progress: 0
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'status') {
      setFormData(prev => ({ ...prev, status: value as ProjectStatus }));
    } else if (name === 'userRole') {
      setFormData(prev => ({ ...prev, userRole: value as UserRole }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Il nome del progetto è obbligatorio');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectData: Omit<IProject, 'id'> = {
        ...formData,
        finishDate: formData.finishDate ? new Date(formData.finishDate) : new Date()
      };
      
      await onSubmit(projectData);
      
      // Reset form only if it's a new project
      if (!initialData) {
        setFormData({
          name: '',
          description: '',
          status: ProjectStatus.ACTIVE as ProjectStatus,
          cost: 0,
          userRole: UserRole.ENGINEER as UserRole,
          finishDate: '',
          progress: 0
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Errore durante il salvataggio del progetto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Modifica Progetto' : 'Nuovo Progetto'}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="name">Nome Progetto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Inserisci il nome del progetto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Inserisci la descrizione del progetto"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Stato</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value={ProjectStatus.ACTIVE}>Attivo</option>
                <option value={ProjectStatus.PENDING}>In Attesa</option>
                <option value={ProjectStatus.COMPLETED}>Completato</option>
                <option value={ProjectStatus.ON_HOLD}>In Pausa</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="userRole">Ruolo</label>
              <select
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleInputChange}
              >
                <option value={UserRole.ENGINEER}>Ingegnere</option>
                <option value={UserRole.ARCHITECT}>Architetto</option>
                <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                <option value={UserRole.SUPERVISOR}>Supervisore</option>
                <option value={UserRole.DEVELOPER}>Sviluppatore</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cost">Budget (€)</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="1000"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="progress">Progresso (%)</label>
              <input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="finishDate">Data di Completamento</label>
            <input
              type="date"
              id="finishDate"
              name="finishDate"
              value={formData.finishDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annulla
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvataggio...' : initialData ? 'Salva Modifiche' : 'Crea Progetto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal; 