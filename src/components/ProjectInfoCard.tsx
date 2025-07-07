import React from 'react';
import type { Project } from '../types/Project';
import Avatar from './common/Avatar';
import ProgressBar from './common/ProgressBar';
import './ProjectInfoCard.css';

interface ProjectInfoCardProps {
  project: Project;
  onEdit?: () => void;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project, onEdit }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="project-info-card">
      <div className="project-info-card__header">
        <Avatar 
          initials={project.avatar}
          backgroundColor="#ca8134"
        />
        <button className="btn btn-outline" onClick={onEdit}>
          Edit
        </button>
      </div>

      <div className="project-info-card__content">
        <div className="project-info-card__info">
          <h3>{project.name}</h3>
          <p className="text-secondary">{project.description}</p>
        </div>

        <div className="project-info-card__details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">{project.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cost</span>
              <span className="detail-value">{formatCurrency(project.cost)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span className="detail-value">{project.role}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Finish Date</span>
              <span className="detail-value">{formatDate(project.finishDate)}</span>
            </div>
          </div>
        </div>

        <div className="project-info-card__progress">
          <ProgressBar progress={project.progress} />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard; 