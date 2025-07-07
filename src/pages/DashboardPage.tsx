import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProjectInfoCard from '../components/ProjectInfoCard';
import TodoCard from '../components/TodoCard';
import ViewerArea from '../components/ViewerArea';
import { useProjects } from '../hooks/useProjects';
import { useLocation } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const location = useLocation();
  const selectedProjectId = location.state?.selectedProjectId;
  
  const {
    currentProject,
    todos,
    navigation,
    handleEditProject,
    handleAddTodo,
    handleSearchTodos
  } = useProjects({ selectedProjectId });

  const sidebarComponent = (
    <Sidebar 
      navigationItems={navigation}
    />
  );

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