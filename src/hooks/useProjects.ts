import { useState, useEffect } from 'react';
import type { Project, TodoItem, NavigationItem } from '../types/Project';

// Mock data per tutti i progetti
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Construction Project 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 2542000,
    role: 'Engineer',
    finishDate: '2024-12-01',
    progress: 65,
    avatar: 'P1'
  },
  {
    id: '2',
    name: 'Construction Project 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 3100000,
    role: 'Project Manager',
    finishDate: '2024-12-01',
    progress: 70,
    avatar: 'P2'
  },
  {
    id: '3',
    name: 'Construction Project 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 2800000,
    role: 'Architect',
    finishDate: '2024-12-01',
    progress: 75,
    avatar: 'P3'
  },
  {
    id: '4',
    name: 'Construction Project 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 4200000,
    role: 'Engineer',
    finishDate: '2024-12-01',
    progress: 80,
    avatar: 'P4'
  },
  {
    id: '5',
    name: 'Construction Project 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 3500000,
    role: 'Supervisor',
    finishDate: '2024-12-01',
    progress: 85,
    avatar: 'P5'
  },
  {
    id: '6',
    name: 'Construction Project 6',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Active',
    cost: 5100000,
    role: 'Project Manager',
    finishDate: '2024-12-01',
    progress: 90,
    avatar: 'P6'
  }
];

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

interface UseProjectsProps {
  selectedProjectId?: number;
}

export const useProjects = (props?: UseProjectsProps) => {
  const [currentProject, setCurrentProject] = useState<Project>(mockProjects[0]);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  // Update the current project when selectedProjectId changes
  useEffect(() => {
    if (props?.selectedProjectId !== undefined) {
      const selectedProject = mockProjects.find(p => p.id === props.selectedProjectId!.toString());
      if (selectedProject) {
        setCurrentProject(selectedProject);
      }
    }
  }, [props?.selectedProjectId]);

  const handleEditProject = () => {
    // Simulate project edit
    setCurrentProject(prev => ({
      ...prev,
      progress: Math.min(100, prev.progress + 5)
    }));
  };

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

  const handleSearchProjects = (query: string) => {
    setProjectSearchQuery(query);
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  return {
    currentProject,
    projects: filteredProjects,
    todos: filteredTodos,
    navigation: mockNavigation,
    searchQuery,
    projectSearchQuery,
    handleEditProject,
    handleAddTodo,
    handleSearchTodos,
    handleSearchProjects,
    setCurrentProject
  };
}; 