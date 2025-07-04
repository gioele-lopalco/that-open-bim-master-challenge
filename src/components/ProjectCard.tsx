import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../models/Project';
import { hexToRgba, lightenColor } from '../utils/colorUtils';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  const completedTodos = project.todos.filter(todo => todo.status === 'done').length;
  const totalTodos = project.todos.length;
  
  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    } catch {
      return 'No due date';
    }
  };

  return (
    <div 
      className="project-card"
      style={{
        backgroundColor: lightenColor(project.color, 95),
        borderLeft: `4px solid ${project.color}`,
        boxShadow: `0 2px 8px ${hexToRgba(project.color, 0.2)}`
      }}
      onClick={handleCardClick}
    >
      <div className="project-card__header">
        <div 
          className="project-card__icon"
          style={{
            backgroundColor: project.color,
            color: 'white'
          }}
        >
          {project.icon}
        </div>
        <div className="project-card__actions">
          {onEdit && (
            <button
              className="btn btn--small btn--secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              title="Edit project"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn--small btn--danger"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this project?')) {
                  onDelete(project.id);
                }
              }}
              title="Delete project"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="project-card__content">
        <h3 className="project-card__title">{project.name}</h3>
        {project.description && (
          <p className="project-card__description">{project.description}</p>
        )}
        
        <div className="project-card__info">
          <div className="project-card__todos">
            <span className="project-card__todos-count">
              {completedTodos}/{totalTodos} ToDos completed
            </span>
          </div>
          
          <div className="project-card__due-date">
            📅 {formatDate(project.dueDate)}
          </div>
        </div>
        
        {project.isImported && (
          <div className="project-card__badge">
            📥 Imported
          </div>
        )}
      </div>
    </div>
  );
}; 