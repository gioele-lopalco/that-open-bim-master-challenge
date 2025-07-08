import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProjectInfoCard from '../components/ProjectInfoCard';
import TodoCard from '../components/TodoCard';
import ViewerArea from '../components/ViewerArea';
import { useProjects } from '../hooks/useProjects';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Project } from '../types/Project';
import { getProjectByIdFromFirebase, getProjectsFromFirebase } from '../utils/projectUtils';
import './DashboardPage.css';

function DashboardPage() {
  const location = useLocation();
  const selectedProjectId = location.state?.selectedProjectId;
  
  console.log('DashboardPage selectedProjectId:', selectedProjectId);
  
  const {
    todos,
    navigation,
    handleAddTodo,
    handleSearchTodos
  } = useProjects();

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProjectById = async (projectId: string) => {
    try {
      console.log('Loading project with ID:', projectId);
      const project = await getProjectByIdFromFirebase(projectId);
      console.log('Project found:', project);
      setCurrentProject(project);
    } catch (error) {
      console.error('Error retrieving project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectById(selectedProjectId);
    } else {
      // If there's no selectedProjectId, load the first available project
      loadFirstAvailableProject();
    }
  }, [selectedProjectId]);

  const loadFirstAvailableProject = async () => {
    try {
      const projects = await getProjectsFromFirebase();
      if (projects.length > 0) {
        console.log('Loading first available project:', projects[0]);
        setCurrentProject(projects[0]);
      }
    } catch (error) {
      console.error('Error loading first project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = () => {
    if (currentProject) {
      // Simula l'aggiornamento del progresso
      setCurrentProject(prev => prev ? ({
        ...prev,
        progress: Math.min(100, prev.progress + 5)
      }) : null);
    }
  };

  const sidebarComponent = (
    <Sidebar 
      navigationItems={navigation}
    />
  );

  if (loading) {
    return (
      <Layout sidebar={sidebarComponent}>
        <div className="dashboard-page">
          <div className="loading-state">
            <p>Caricamento progetto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentProject) {
    return (
      <Layout sidebar={sidebarComponent}>
        <div className="dashboard-page">
          <div className="error-state">
            <p>Progetto non trovato</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="dashboard-page">
        <header className="dashboard-page__header">
          <div>
            <h1>{currentProject.name}</h1>
            <p className="text-secondary">{currentProject.description}</p>
          </div>
        </header>
        
        <div className="dashboard-page__content">
          <div className="dashboard-page__left-panel">
            <ProjectInfoCard 
              project={currentProject}
              onEdit={handleEditProject}
            />
            <TodoCard 
              todos={todos}
              onAddTodo={handleAddTodo}
              onSearchChange={handleSearchTodos}
            />
          </div>
          
          <div className="dashboard-page__right-panel">
            <ViewerArea />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage; 