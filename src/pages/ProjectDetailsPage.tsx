import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Project } from '../models/Project';
import type { ToDo, ToDoStatus } from '../models/ToDo';
import { ToDoItem } from '../components/ToDoItem';
import { ToDoForm } from '../components/ToDoForm';
import { ProjectForm } from '../components/ProjectForm';
import { loadProjects, saveProjects, exportProjectsToJSON, downloadJSON } from '../utils/storage';
import { hexToRgba, lightenColor } from '../utils/colorUtils';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ToDo | undefined>();
  const [todoFilter, setTodoFilter] = useState<'all' | ToDoStatus>('all');

  useEffect(() => {
    const loadedProjects = loadProjects();
    setProjects(loadedProjects);
    
    const foundProject = loadedProjects.find(p => p.id === id);
    if (!foundProject) {
      navigate('/');
      return;
    }
    setProject(foundProject);
  }, [id, navigate]);

  useEffect(() => {
    // Save projects only if there are projects and they're loaded
    if (projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setProject(updatedProject);
  };

  const handleCreateTodo = () => {
    setEditingTodo(undefined);
    setShowTodoForm(true);
  };

  const handleEditTodo = (todo: ToDo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleDeleteTodo = (todoId: string) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      todos: project.todos.filter(t => t.id !== todoId),
      updatedAt: new Date().toISOString()
    };
    updateProject(updatedProject);
  };

  const handleSubmitTodo = (todo: ToDo) => {
    if (!project) return;
    
    let updatedTodos;
    if (editingTodo) {
      // Aggiorna ToDo esistente
      updatedTodos = project.todos.map(t => t.id === todo.id ? todo : t);
    } else {
      // Crea nuovo ToDo
      updatedTodos = [...project.todos, todo];
    }
    
    const updatedProject = {
      ...project,
      todos: updatedTodos,
      updatedAt: new Date().toISOString()
    };
    updateProject(updatedProject);
    setShowTodoForm(false);
    setEditingTodo(undefined);
  };

  const handleTodoStatusChange = (todoId: string, newStatus: ToDoStatus) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      todos: project.todos.map(t => 
        t.id === todoId ? { ...t, status: newStatus } : t
      ),
      updatedAt: new Date().toISOString()
    };
    updateProject(updatedProject);
  };

  const handleEditProject = () => {
    setShowProjectForm(true);
  };

  const handleSubmitProject = (updatedProject: Project) => {
    updateProject(updatedProject);
    setShowProjectForm(false);
  };

  const handleExportProject = () => {
    if (!project) return;
    
    const jsonData = exportProjectsToJSON([project]);
    const filename = `progetto-${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(jsonData, filename);
  };

  if (!project) {
    return (
      <div className="project-details__loading">
        <p>Loading project...</p>
      </div>
    );
  }

  const filteredTodos = project.todos.filter(todo => 
    todoFilter === 'all' || todo.status === todoFilter
  );

  const todoStats = {
    total: project.todos.length,
    todo: project.todos.filter(t => t.status === 'todo').length,
    inProgress: project.todos.filter(t => t.status === 'in-progress').length,
    done: project.todos.filter(t => t.status === 'done').length
  };

  const completionPercentage = todoStats.total > 0 
    ? Math.round((todoStats.done / todoStats.total) * 100) 
    : 0;

  return (
    <div className="project-details">
      {/* Header del progetto */}
      <div 
        className="project-details__header"
        style={{
          background: `linear-gradient(135deg, ${lightenColor(project.color, 90)} 0%, ${hexToRgba(project.color, 0.1)} 100%)`,
          borderLeft: `6px solid ${project.color}`
        }}
      >
        <div className="project-details__header-content">
          <div className="project-details__back">
            <Link to="/" className="btn btn--ghost">
              ← Back to projects
            </Link>
          </div>
          
          <div className="project-details__title-section">
            <div 
              className="project-details__icon"
              style={{
                backgroundColor: project.color,
                color: 'white'
              }}
            >
              {project.icon}
            </div>
            
            <div className="project-details__info">
              <h1 className="project-details__title">{project.name}</h1>
              {project.description && (
                <p className="project-details__description">{project.description}</p>
              )}
              
              <div className="project-details__meta">
                <span>📅 Due date: {new Date(project.dueDate).toLocaleDateString('en-US')}</span>
                {project.isImported && <span className="badge">📥 Imported</span>}
              </div>
            </div>
          </div>
          
          <div className="project-details__actions">
            <button 
              className="btn btn--secondary"
              onClick={handleEditProject}
              title="Edit project"
            >
                              ✏️ Edit
            </button>
            <button 
              className="btn btn--secondary"
              onClick={handleExportProject}
              title="Export project"
            >
                              📤 Export
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="project-details__progress">
          <div className="progress-bar">
            <div 
              className="progress-bar__fill"
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: project.color
              }}
            />
          </div>
          <span className="progress-text">
            {completionPercentage}% completed ({todoStats.done}/{todoStats.total} ToDos)
          </span>
        </div>
      </div>

      {/* Statistiche ToDo */}
      <div className="project-details__stats">
        <div className="todo-stats">
          <div className="todo-stat todo-stat--todo">
            <span className="todo-stat__count">{todoStats.todo}</span>
            <span className="todo-stat__label">To Do</span>
          </div>
          <div className="todo-stat todo-stat--in-progress">
            <span className="todo-stat__count">{todoStats.inProgress}</span>
            <span className="todo-stat__label">In Progress</span>
          </div>
          <div className="todo-stat todo-stat--done">
            <span className="todo-stat__count">{todoStats.done}</span>
            <span className="todo-stat__label">Completed</span>
          </div>
        </div>
      </div>

      {/* Controlli ToDo */}
      <div className="project-details__controls">
        <div className="project-details__filters">
          <button 
            className={`filter-btn ${todoFilter === 'all' ? 'filter-btn--active' : ''}`}
            onClick={() => setTodoFilter('all')}
          >
            All ({todoStats.total})
          </button>
          <button 
            className={`filter-btn ${todoFilter === 'todo' ? 'filter-btn--active' : ''}`}
            onClick={() => setTodoFilter('todo')}
          >
            To Do ({todoStats.todo})
          </button>
          <button 
            className={`filter-btn ${todoFilter === 'in-progress' ? 'filter-btn--active' : ''}`}
            onClick={() => setTodoFilter('in-progress')}
          >
            In Progress ({todoStats.inProgress})
          </button>
          <button 
            className={`filter-btn ${todoFilter === 'done' ? 'filter-btn--active' : ''}`}
            onClick={() => setTodoFilter('done')}
          >
            Completed ({todoStats.done})
          </button>
        </div>
        
        <button 
          className="btn btn--primary"
          onClick={handleCreateTodo}
        >
          ➕ New ToDo
        </button>
      </div>

      {/* Lista ToDos */}
      <div className="project-details__todos">
        {filteredTodos.length === 0 ? (
          <div className="project-details__empty">
            {project.todos.length === 0 ? (
              <>
                <h3>No ToDos yet</h3>
                <p>Start by adding the first ToDo to the project!</p>
                <button 
                  className="btn btn--primary"
                  onClick={handleCreateTodo}
                >
                  ➕ Add first ToDo
                </button>
              </>
            ) : (
              <>
                <h3>No ToDos for this filter</h3>
                <p>Try changing the filter or add a new ToDo</p>
              </>
            )}
          </div>
        ) : (
          <div className="todos-list">
            {filteredTodos.map(todo => (
              <ToDoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
                onStatusChange={handleTodoStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modali */}
      {showTodoForm && (
        <div className="modal">
          <div className="modal__content">
            <ToDoForm
              todo={editingTodo}
              onSubmit={handleSubmitTodo}
              onCancel={() => {
                setShowTodoForm(false);
                setEditingTodo(undefined);
              }}
            />
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="modal">
          <div className="modal__content">
            <ProjectForm
              project={project}
              onSubmit={handleSubmitProject}
              onCancel={() => setShowProjectForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 