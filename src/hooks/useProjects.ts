import { useState } from 'react';
import type { TodoItem, NavigationItem } from '../classes/Project';
import { TodoStatus, TodoPriority } from '../classes/Project';

const mockTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Make anything here as you want, even something longer.',
    description: 'Complete the construction documentation and review process',
    status: TodoStatus.TODO,
    priority: TodoPriority.HIGH,
    projectId: 'mock-project-1',
    assignedTo: 'John Doe',
    icon: 'build'
  },
  {
    id: '2',
    title: 'Review architectural drawings and specifications',
    description: 'Ensure all drawings meet current building standards',
    status: TodoStatus.IN_PROGRESS,
    priority: TodoPriority.MEDIUM,
    projectId: 'mock-project-1',
    assignedTo: 'Jane Smith',
    icon: 'architecture'
  },
  {
    id: '3',
    title: 'Coordinate with electrical team for installation',
    status: TodoStatus.TODO,
    priority: TodoPriority.MEDIUM,
    projectId: 'mock-project-1',
    assignedTo: 'Mike Johnson',
    icon: 'electrical_services'
  },
  {
    id: '4',
    title: 'Schedule safety inspection for next week',
    status: TodoStatus.DONE,
    priority: TodoPriority.LOW,
    projectId: 'mock-project-1',
    assignedTo: 'Sarah Wilson',
    icon: 'security'
  }
];

const mockNavigation: NavigationItem[] = [
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
      title: 'New task added from dashboard',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      projectId: 'mock-project-1',
      icon: 'add_task'
    };
    
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleSearchTodos = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    todos: filteredTodos,
    navigation: mockNavigation,
    searchQuery,
    handleAddTodo,
    handleSearchTodos
  };
}; 