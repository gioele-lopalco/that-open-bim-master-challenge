import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProjectInfoCard from '../components/ProjectInfoCard';
import TodoCard from '../components/TodoCard';
import ViewerArea from '../components/ViewerArea';
import { useProjects } from '../hooks/useProjects';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IProject, TodoItem } from '../classes/Project';
import { TodoStatus } from '../classes/Project';
import { ProjectsManager } from '../classes/ProjectsManager';
import { getTodosFromFirebase, updateTodoStatusInFirebase } from '../utils/todoUtils';
import './ProjectOverviewPage.css';

function ProjectOverviewPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const {
    navigation
  } = useProjects();

  // State for real project todos
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleStatus = async (todoId: string, currentStatus: TodoStatus) => {
    if (!projectId) return;
    
    try {
      const getNextStatus = (status: TodoStatus): TodoStatus => {
        switch (status) {
          case TodoStatus.TODO: return TodoStatus.IN_PROGRESS;
          case TodoStatus.IN_PROGRESS: return TodoStatus.DONE;
          case TodoStatus.DONE: return TodoStatus.TODO;
          case TodoStatus.CANCELLED: return TodoStatus.TODO;
          default: return TodoStatus.TODO;
        }
      };

      const newStatus = getNextStatus(currentStatus);
      await updateTodoStatusInFirebase(projectId, todoId, newStatus);

      // Update local state
      setTodos(prev => prev.map(todo => 
        todo.id === todoId 
          ? { ...todo, status: newStatus, updatedAt: new Date() }
          : todo
      ));
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleManageTasks = () => {
    if (projectId) {
      navigate(`/project/${projectId}/detail`);
    }
  };

  const handleAddTodo = () => {
    // Navigate to detail page for adding todos
    if (projectId) {
      navigate(`/project/${projectId}/detail`);
    }
  };

  const handleSearchTodos = (query: string) => {
    setSearchQuery(query);
  };

  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectsManager] = useState(() => new ProjectsManager());

  const loadProjectById = async (projectId: string) => {
    try {
      console.log('Loading project with ID:', projectId);
      const project = await projectsManager.getProjectById(projectId);
      console.log('Project found:', project);
      setCurrentProject(project);
    } catch (error) {
      console.error('Error retrieving project:', error);
      // If project is not found, redirect to dashboard
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTodos = async (projectId: string) => {
    try {
      const projectTodos = await getTodosFromFirebase(projectId);
      console.log('Todos loaded for project:', projectTodos);
      setTodos(projectTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProjectById(projectId);
      loadProjectTodos(projectId);
    } else {
      // If there's no projectId in URL, redirect to dashboard
      navigate('/dashboard');
    }
  }, [projectId, navigate]);

  const handleEditProject = () => {
    if (currentProject) {
      // Simulate progress update
      setCurrentProject(prev => prev ? ({
        ...prev,
        progress: Math.min(100, prev.progress + 5)
      }) : null);
    }
  };

  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <p>Loading project...</p>
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
            <p>Project not found</p>
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
              todos={filteredTodos}
              onAddTodo={handleAddTodo}
              onSearchChange={handleSearchTodos}
              onToggleStatus={handleToggleStatus}
              onManageTasks={handleManageTasks}
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

export default ProjectOverviewPage; 