import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProjectTasksList from '../components/ProjectTasksList';
import { useProjects } from '../hooks/useProjects';
import type { IProject } from '../classes/Project';
import { ProjectsManager } from '../classes/ProjectsManager';
import './ProjectDetailsPage.css';

function ProjectDetailsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { navigation } = useProjects();
  
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectsManager] = useState(() => new ProjectsManager());

  useEffect(() => {
    const loadProject = async () => {
          if (!projectId) {
      setError('Invalid project ID');
      setLoading(false);
      return;
    }

      try {
        setLoading(true);
        setError(null);
        
        const projectData = await projectsManager.getProjectById(projectId);
        
        if (!projectData) {
          setError('Project not found');
          return;
        }
        
        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Error loading project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projectsManager]);

  const handleBackToProjects = () => {
    navigate('/dashboard');
  };

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  if (loading) {
    return (
      <Layout sidebar={sidebarComponent}>
        <div className="project-details-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
            <p>Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout sidebar={sidebarComponent}>
        <div className="project-details-page">
          <div className="error-container">
            <div className="error-icon">
              <span className="material-symbols-outlined">error</span>
            </div>
            <h2>Error</h2>
            <p>{error || 'Project not found'}</p>
            <button 
              className="btn btn--primary" 
              onClick={handleBackToProjects}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Projects
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="project-details-page">
        <div className="project-details-header">
          <div className="header-navigation">
            <button 
              className="btn-back" 
              onClick={handleBackToProjects}
              title="Back to projects"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="breadcrumb">
              <span 
                className="breadcrumb-item breadcrumb-item--clickable"
                onClick={() => navigate('/dashboard')}
              >
                Projects
              </span>
              <span className="breadcrumb-separator">/</span>
              <span 
                className="breadcrumb-item breadcrumb-item--clickable"
                onClick={() => navigate(`/project/${projectId}`)}
              >
                {project.name}
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item breadcrumb-item--current">Detail</span>
            </div>
          </div>
          
          <div className="project-summary">
            <div className="project-info">
              <h1 className="project-title">{project.name}</h1>
              <p className="project-description">{project.description}</p>
            </div>
            
            <div className="project-stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon--progress">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{project.progress}%</div>
                  <div className="stat-label">Progresso</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className={`stat-icon stat-icon--status stat-icon--${project.status.toLowerCase()}`}>
                  <span className="material-symbols-outlined">
                    {project.status === 'Active' ? 'play_circle' : 
                     project.status === 'Completed' ? 'check_circle' : 
                     project.status === 'Pending' ? 'schedule' : 'pause_circle'}
                  </span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{project.status}</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon stat-icon--cost">
                  <span className="material-symbols-outlined">euro</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">€{project.cost.toLocaleString()}</div>
                  <div className="stat-label">Budget</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon stat-icon--date">
                  <span className="material-symbols-outlined">event</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {new Date(project.finishDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="stat-label">Scadenza</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="project-details-content">
          <ProjectTasksList 
            projectId={projectId!} 
            projectName={project.name}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ProjectDetailsPage; 