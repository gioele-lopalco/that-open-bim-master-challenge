import { useState } from 'react';
import type { TodoItem, NavigationItem } from '../types/Project';

const mockTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Make anything here as you want, even something longer.',
    date: 'Fri, 20 sep',
    icon: 'build'
  },
  {
    id: '2',
    text: 'Review architectural drawings and specifications',
    date: 'Mon, 23 sep',
    icon: 'architecture'
  },
  {
    id: '3',
    text: 'Coordinate with electrical team for installation',
    date: 'Wed, 25 sep',
    icon: 'electrical_services'
  },
  {
    id: '4',
    text: 'Schedule safety inspection for next week',
    date: 'Fri, 27 sep',
    icon: 'security'
  }
];

const mockNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'apartment',
    path: '/projects'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'task',
    path: '/tasks'
  },
  {
    id: 'team',
    label: 'Team',
    icon: 'group',
    path: '/team'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'logout',
    onClick: () => {
      // Simulate logout action
      alert('Logout functionality coming soon!');
    }
  }
];

export const useProjects = () => {
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTodo = () => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: 'New task added from dashboard',
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      }),
      icon: 'add_task'
    };
    
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleSearchTodos = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    todos: filteredTodos,
    navigation: mockNavigation,
    searchQuery,
    handleAddTodo,
    handleSearchTodos
  };
}; 