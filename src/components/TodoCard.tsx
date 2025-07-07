import React, { useState } from 'react';
import type { TodoItem } from '../types/Project';
import './TodoCard.css';

interface TodoCardProps {
  todos: TodoItem[];
  onAddTodo?: () => void;
  onSearchChange?: (query: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todos, onAddTodo, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div key={todo.id} className="todo-item">
                <div className="todo-item__content">
                  <span className="material-symbols-outlined todo-item__icon">
                    {todo.icon}
                  </span>
                  <p className="todo-item__text">{todo.text}</p>
                </div>
                <span className="todo-item__date">{todo.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="todo-empty">
            <p className="text-secondary">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoCard; 