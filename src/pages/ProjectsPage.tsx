import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import SearchBox from '../components/common/SearchBox';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css';

function ProjectsPage() {
  const { projects, navigation, projectSearchQuery, handleSearchProjects } = useProjects();
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    navigate('/dashboard', { state: { selectedProjectId: parseInt(projectId) } });
  };

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="projects-page">
        <header className="projects-page__header">
          <div>
            <h1>Projects</h1>
            <p className="text-secondary">Manage and overview all construction projects</p>
          </div>
          <button className="btn btn--primary">
            <span className="material-symbols-outlined">add</span>
            New Project
          </button>
        </header>
        
        <div className="projects-page__content">
          <div className="projects-page__filters">
            <SearchBox
              placeholder="Cerca progetti per nome..."
              value={projectSearchQuery}
              onChange={handleSearchProjects}
              className="projects-search-box"
            />
            <div className="filter-group">
              <label>Status:</label>
              <select className="filter-select">
                <option>All Projects</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select className="filter-select">
                <option>Recent</option>
                <option>Name</option>
                <option>Progress</option>
                <option>Deadline</option>
              </select>
            </div>
          </div>

          <div className="projects-page__grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-card__header">
                  <div className="project-avatar">{project.avatar}</div>
                  <div className="project-status project-status--active">{project.status}</div>
                </div>
                <h3 className="project-card__title">{project.name}</h3>
                <p className="project-card__description">
                  {project.description}
                </p>
                <div className="project-card__progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="project-card__footer">
                  <span className="project-date">Due: {new Date(project.finishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  <div className="project-actions">
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Logic to edit the project
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Logic to view the details
                      }}
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProjectsPage; 