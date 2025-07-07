import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import ProjectInfoCard from './components/ProjectInfoCard';
import TodoCard from './components/TodoCard';
import ViewerArea from './components/ViewerArea';
import { useProjects } from './hooks/useProjects';
import './App.css';

function App() {
  const {
    currentProject,
    todos,
    navigation,
    handleNavigationClick,
    handleEditProject,
    handleAddTodo,
    handleSearchTodos
  } = useProjects();

  const sidebarComponent = (
    <Sidebar 
      navigationItems={navigation}
      onNavigationClick={handleNavigationClick}
    />
  );

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="app">
        <header className="app__header">
          <div>
            <h1>{currentProject.name}</h1>
            <p className="text-secondary">{currentProject.description}</p>
          </div>
        </header>
        
        <div className="app__content">
          <div className="app__left-panel">
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
          
          <div className="app__right-panel">
            <ViewerArea />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
