import React from 'react';
import type { ToDo, ToDoStatus } from '../models/ToDo';
import { TODO_STATUS_LABELS } from '../models/ToDo';
import { getTodoStatusColor, getTodoStatusTextColor } from '../utils/colorUtils';

interface ToDoItemProps {
  todo: ToDo;
  onEdit?: (todo: ToDo) => void;
  onDelete?: (todoId: string) => void;
  onStatusChange?: (todoId: string, newStatus: ToDoStatus) => void;
}

export const ToDoItem: React.FC<ToDoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const backgroundColor = getTodoStatusColor(todo.status);
  const textColor = getTodoStatusTextColor(todo.status);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusIcon = (status: ToDoStatus) => {
    switch (status) {
      case 'todo':
        return '⭕';
      case 'in-progress':
        return '🔄';
      case 'done':
        return '✅';
      default:
        return '⭕';
    }
  };

  const getNextStatus = (currentStatus: ToDoStatus): ToDoStatus => {
    switch (currentStatus) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'done';
      case 'done':
        return 'todo';
      default:
        return 'todo';
    }
  };

  const handleStatusClick = () => {
    if (onStatusChange) {
      const nextStatus = getNextStatus(todo.status);
      onStatusChange(todo.id, nextStatus);
    }
  };

  return (
    <div
      className="todo-item"
      style={{
        backgroundColor,
        color: textColor,
        borderLeft: `4px solid ${textColor}`
      }}
    >
      <div className="todo-item__header">
        <button
          className="todo-item__status-btn"
          onClick={handleStatusClick}
          title={`Change status: ${TODO_STATUS_LABELS[getNextStatus(todo.status)]}`}
          style={{ color: textColor }}
        >
          {getStatusIcon(todo.status)}
        </button>
        
        <div className="todo-item__status-label">
          {TODO_STATUS_LABELS[todo.status]}
        </div>
        
        <div className="todo-item__actions">
          {onEdit && (
            <button
              className="btn btn--small btn--ghost"
              onClick={() => onEdit(todo)}
              title="Edit ToDo"
              style={{ color: textColor }}
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn--small btn--ghost"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this ToDo?')) {
                  onDelete(todo.id);
                }
              }}
              title="Delete ToDo"
              style={{ color: textColor }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="todo-item__content">
        <h4 className="todo-item__title">{todo.title}</h4>
        {todo.description && (
          <p className="todo-item__description">{todo.description}</p>
        )}
        
        <div className="todo-item__meta">
          <small>Created on: {formatDate(todo.createdAt)}</small>
        </div>
      </div>
    </div>
  );
}; 