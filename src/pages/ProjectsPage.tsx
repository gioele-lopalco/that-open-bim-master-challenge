import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import SearchBox from '../components/common/SearchBox';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css';
import { useEffect, useState } from 'react';
import type { IProject } from '../classes/Project';
import { generateProjectAvatar } from '../utils/projectUtils';
import { ProjectsManager } from '../classes/ProjectsManager';
import ProjectFormModal from '../components/ProjectFormModal';
import { deleteProjectFromFirebase, updateProjectInFirebase } from '../utils/projectUtils';

function ProjectsPage() {
  const { navigation } = useProjects();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [projectsManager] = useState(() => new ProjectsManager());
  const navigate = useNavigate();

  const handleSearchProjects = (query: string) => {
    setProjectSearchQuery(query);
  };

  const handleCreateProject = async (projectData: Omit<IProject, 'id'>) => {
    try {
      const newProject = await projectsManager.newProject(projectData);
      console.log('New project created:', newProject);
      
      // Refresh the projects list
      await loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (projectData: Omit<IProject, 'id'>) => {
    try {
      if (!selectedProject) return;
      
      await updateProjectInFirebase(selectedProject.id, projectData);
      
      // Refresh the projects list
      await loadProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await deleteProjectFromFirebase(projectId);
      
      // Refresh the projects list
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Error deleting project');
    }
  };

  const handleOpenModal = (project?: IProject) => {
    if (project) {
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const loadProjects = async () => {
    const projectsList = await projectsManager.list;
    console.log('Projects loaded:', projectsList);
    setProjects(projectsList);
    return projectsList;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await loadProjects();
      console.log(projects);
    };
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="projects-page">
        <header className="projects-page__header">
          <div>
            <h1>My Projects</h1>
            <p className="text-secondary">Manage and monitor your projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <span className="material-symbols-outlined">add</span>
            New Project
          </button>
        </header>
        
        <div className="projects-page__content">
          <div className="projects-page__filters">
            <SearchBox
              placeholder="Search projects by name..."
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
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="project-card__header">
                  <div className="project-avatar">
                    {generateProjectAvatar(project.name)}
                  </div>
                  <span className={`project-status project-status--${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="project-card__title">{project.name}</h3>
                <p className="project-card__description">{project.description}</p>

                <div className="project-card__progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="project-card__footer">
                  <span className="project-date">
                    Due: {new Date(project.finishDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                  <div className="project-actions">
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(project);
                      }}
                      title="Edit project"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      title="Delete project"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        initialData={selectedProject}
      />
    </Layout>
  );
}

export default ProjectsPage; 