import React, { useState } from 'react';
import type { TodoItem } from '../classes/Project';
import { TodoStatus, TodoPriority } from '../classes/Project';
import { useModelSelection } from '../contexts/ModelSelectionContext';
import './TodoCard.css';

interface TodoCardProps {
  todos: TodoItem[];
  onAddTodo?: () => void;
  onSearchChange?: (query: string) => void;
  onToggleStatus?: (todoId: string, currentStatus: TodoStatus) => void;
  onManageTasks?: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todos, onAddTodo, onSearchChange, onToggleStatus, onManageTasks }) => {
  const { highlightElements } = useModelSelection();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleTodoClick = async (todo: TodoItem) => {
    if (todo.linkedElements && todo.linkedElements.length > 0) {
      try {
        await highlightElements(todo.linkedElements);
        console.log('🔗 Highlighting elements for todo:', todo.title, todo.linkedElements);
      } catch (error) {
        console.error('❌ Error highlighting elements:', error);
      }
    } else {
      console.log('ℹ️ Todo has no linked elements:', todo.title);
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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



  return (
    <div className="todo-card">
      <div className="todo-card__header">
        <h3>To-Do</h3>
        <div className="todo-card__actions">
          <div className="search-container">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search To-Do's by name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button className="btn-icon" onClick={onAddTodo}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="todo-card__content">
        {filteredTodos.length > 0 ? (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`todo-item todo-item--${todo.status.toLowerCase().replace(' ', '-')} ${todo.linkedElements && todo.linkedElements.length > 0 ? 'todo-item--linked' : ''}`}
                onClick={() => handleTodoClick(todo)}
                style={{ cursor: todo.linkedElements && todo.linkedElements.length > 0 ? 'pointer' : 'default' }}
                title={todo.linkedElements && todo.linkedElements.length > 0 ? `Clicca per evidenziare ${todo.linkedElements.length} elemento/i collegato/i` : undefined}
              >
                <div className="todo-item__header">
                  <button 
                    className="todo-status-btn-simple"
                    onClick={() => onToggleStatus?.(todo.id, todo.status)}
                    title={`Status: ${todo.status}`}
                  >
                    <span className="material-symbols-outlined">
                      {statusIcons[todo.status]}
                    </span>
                  </button>
                  
                  <div 
                    className="todo-priority-dot" 
                    style={{ backgroundColor: priorityColors[todo.priority] }}
                    title={`Priority: ${todo.priority}`}
                  />
                </div>
                
                <div className="todo-item__content">
                  <div className="todo-item__main">
                    <span className="material-symbols-outlined todo-item__icon">
                      {todo.icon || 'task'}
                    </span>
                    <div className="todo-item__info">
                      <div className="todo-item__title-row">
                        <p className="todo-item__title">{todo.title}</p>
                        {todo.linkedElements && todo.linkedElements.length > 0 && (
                          <span 
                            className="todo-linked-indicator"
                            title={`${todo.linkedElements.length} elemento/i BIM collegato/i`}
                          >
                            <span className="material-symbols-outlined">link</span>
                          </span>
                        )}
                      </div>
                      {todo.description && (
                        <p className="todo-item__description">{todo.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="todo-item__meta">
                  {todo.assignedTo && (
                    <span className="todo-item__assignee">{todo.assignedTo}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="todo-empty">
            <p className="text-secondary">No tasks found</p>
          </div>
        )}
      </div>

      <div className="todo-card__footer">
        <button className="btn btn-primary btn-manage-tasks" onClick={onManageTasks}>
          <span className="material-symbols-outlined">task</span>
          Manage Tasks
        </button>
      </div>
    </div>
  );
};

export default TodoCard; 