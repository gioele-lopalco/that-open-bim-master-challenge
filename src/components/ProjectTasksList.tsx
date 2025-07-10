import React, { useState, useEffect } from 'react';
import SearchBox from './common/SearchBox';
import ToDoForm from './ToDoForm';
import type { TodoItem } from '../classes/Project';
import { TodoStatus, TodoPriority } from '../classes/Project';
import { 
  getTodosFromFirebase, 
  createTodoInFirebase, 
  updateTodoInFirebase, 
  deleteTodoFromFirebase, 
  updateTodoStatusInFirebase 
} from '../utils/todoUtils';
import './ProjectTasksList.css';

interface ProjectTasksListProps {
  projectId: string;
  projectName: string;
}

interface TodoCardItemProps {
  todo: TodoItem;
  onEdit: (todo: TodoItem) => void;
  onDelete: (todoId: string) => void;
  onToggleStatus: (todoId: string, currentStatus: TodoStatus) => void;
}

const TodoCardItem: React.FC<TodoCardItemProps> = ({ todo, onEdit, onDelete, onToggleStatus }) => {
  const priorityColors = {
    [TodoPriority.LOW]: '#10b981',
    [TodoPriority.MEDIUM]: '#f59e0b', 
    [TodoPriority.HIGH]: '#ef4444',
    [TodoPriority.URGENT]: '#dc2626'
  };

  const statusIcons = {
    [TodoStatus.TODO]: 'radio_button_unchecked',
    [TodoStatus.IN_PROGRESS]: 'schedule',
    [TodoStatus.DONE]: 'check_circle',
    [TodoStatus.CANCELLED]: 'cancel'
  };

  const getNextStatus = (currentStatus: TodoStatus): TodoStatus => {
    switch (currentStatus) {
      case TodoStatus.TODO:
        return TodoStatus.IN_PROGRESS;
      case TodoStatus.IN_PROGRESS:
        return TodoStatus.DONE;
      case TodoStatus.DONE:
        return TodoStatus.TODO;
      case TodoStatus.CANCELLED:
        return TodoStatus.TODO;
      default:
        return TodoStatus.TODO;
    }
  };



  return (
    <div className={`todo-card-item todo-card-item--${todo.status.toLowerCase().replace(' ', '-')}`}>
      <div className="todo-card-item__header">
        <button 
          className="todo-status-btn"
          onClick={() => onToggleStatus(todo.id, todo.status)}
          title={`Cambia status da ${todo.status} a ${getNextStatus(todo.status)}`}
        >
          <span className="material-symbols-outlined">
            {statusIcons[todo.status]}
          </span>
        </button>
        
        <div className="todo-priority-indicator" 
             style={{ backgroundColor: priorityColors[todo.priority] }}
             title={`Priority: ${todo.priority}`}
        />
        
        <div className="todo-actions">
          <button 
            className="btn-icon" 
            onClick={() => onEdit(todo)}
                              title="Edit task"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button 
            className="btn-icon btn-icon--danger" 
            onClick={() => onDelete(todo.id)}
                              title="Delete task"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <div className="todo-card-item__content">
        <div className="todo-header">
          <h4 className="todo-title">{todo.title}</h4>
          <span className={`todo-status-badge todo-status-badge--${todo.status.toLowerCase().replace(' ', '-')}`}>
            {todo.status}
          </span>
        </div>
        
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        <div className="todo-metadata">
          {todo.assignedTo && (
            <div className="todo-meta-item">
              <span className="material-symbols-outlined">person</span>
              <span>{todo.assignedTo}</span>
            </div>
          )}
          
          <div className="todo-meta-item">
            <span className="material-symbols-outlined">flag</span>
            <span>{todo.priority}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectTasksList: React.FC<ProjectTasksListProps> = ({ projectId, projectName }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Load todos from Firebase
  const loadTodos = async () => {
    try {
      setLoading(true);
      const firebaseTodos = await getTodosFromFirebase(projectId);
      setTodos(firebaseTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTodos = () => {
    let filtered = todos;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (todo.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(todo => todo.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

    setFilteredTodos(filtered);
  };

  useEffect(() => {
    loadTodos();
  }, [projectId]);

  useEffect(() => {
    filterTodos();
  }, [todos, searchQuery, statusFilter, priorityFilter]);

  const handleCreateTodo = async (todoData: Omit<TodoItem, 'id' | 'updatedAt'>) => {
    try {
      const newTodo = await createTodoInFirebase(projectId, todoData);
      setTodos(prev => [newTodo, ...prev]);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const handleUpdateTodo = async (todoData: Omit<TodoItem, 'id' | 'updatedAt'>) => {
    try {
      if (!selectedTodo) return;
      
      await updateTodoInFirebase(projectId, selectedTodo.id, todoData);
      
      const updatedTodo: TodoItem = {
        ...selectedTodo,
        ...todoData,
        updatedAt: new Date(),
      };
      
      setTodos(prev => prev.map(todo => 
        todo.id === selectedTodo.id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTodoFromFirebase(projectId, todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Error deleting task');
    }
  };

  const handleToggleStatus = async (todoId: string, currentStatus: TodoStatus) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

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

      const updatedTodo = {
        ...todo,
        status: newStatus,
        updatedAt: new Date(),
      };

      setTodos(prev => prev.map(t => 
        t.id === todoId ? updatedTodo : t
      ));
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleOpenForm = (todo?: TodoItem) => {
    setSelectedTodo(todo || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTodo(null);
  };

  const getTasksStats = () => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === TodoStatus.DONE).length;
    const inProgress = todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length;
    const pending = todos.filter(t => t.status === TodoStatus.TODO).length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTasksStats();

  if (loading) {
    return (
      <div className="project-tasks-list">
        <div className="loading-state">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-tasks-list">
      <div className="project-tasks-header">
        <div className="project-tasks-title">
          <h2>Tasks - {projectName}</h2>
          <div className="tasks-stats">
            <span className="stats-item">
              <span className="stats-number">{stats.total}</span>
              <span className="stats-label">Total</span>
            </span>
            <span className="stats-item">
              <span className="stats-number">{stats.pending}</span>
              <span className="stats-label">To Do</span>
            </span>
            <span className="stats-item">
              <span className="stats-number">{stats.inProgress}</span>
              <span className="stats-label">In Progress</span>
            </span>
            <span className="stats-item">
              <span className="stats-number">{stats.completed}</span>
              <span className="stats-label">Completed</span>
            </span>
          </div>
        </div>
        
        <button 
          className="btn btn--primary"
          onClick={() => handleOpenForm()}
        >
          <span className="material-symbols-outlined">add</span>
          New Task
        </button>
      </div>

      <div className="project-tasks-filters">
        <SearchBox
          placeholder="Search tasks by title, description or assignee..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="tasks-search-box"
        />
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as TodoStatus | 'all')}
            className="filter-select"
          >
            <option value="all">All</option>
            {Object.values(TodoStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Priority:</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value as TodoPriority | 'all')}
            className="filter-select"
          >
            <option value="all">All</option>
            {Object.values(TodoPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="project-tasks-content">
        {filteredTodos.length > 0 ? (
          <div className="todos-grid">
            {filteredTodos.map((todo) => (
              <TodoCardItem
                key={todo.id}
                todo={todo}
                onEdit={handleOpenForm}
                onDelete={handleDeleteTodo}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined">task</span>
            <h3>No tasks found</h3>
            <p>
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Start by creating your first task for this project'
              }
            </p>
            {(!searchQuery && statusFilter === 'all' && priorityFilter === 'all') && (
              <button 
                className="btn btn--primary"
                onClick={() => handleOpenForm()}
              >
                <span className="material-symbols-outlined">add</span>
                Create First Task
              </button>
            )}
          </div>
        )}
      </div>

      <ToDoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedTodo ? handleUpdateTodo : handleCreateTodo}
        initialData={selectedTodo}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectTasksList; 