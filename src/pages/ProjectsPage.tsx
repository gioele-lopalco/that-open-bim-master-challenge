import React, { useState, useEffect } from 'react';
import type { Project } from '../models/Project';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { loadProjects, saveProjects, exportProjectsToJSON, importProjectsFromJSON, downloadJSON } from '../utils/storage';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Load projects on mount
  useEffect(() => {
    const loadedProjects = loadProjects();
    setProjects(loadedProjects);
    setHasLoaded(true); // Mark as loaded to enable future auto-save
  }, []);

  // Save projects when they change (but not the initial empty array)
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    // Only save if we've already loaded data at least once
    if (hasLoaded) {
      saveProjects(projects);
    }
  }, [projects, hasLoaded]);

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleSubmitProject = (project: Project) => {
    if (editingProject) {
      // Aggiorna progetto esistente
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
      // Crea nuovo progetto
      setProjects(prev => [...prev, project]);
    }
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleExportAll = () => {
    if (projects.length === 0) {
      alert('No projects to export');
      return;
    }
    
    const jsonData = exportProjectsToJSON(projects);
    const filename = `progetti-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(jsonData, filename);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const importedProjects = importProjectsFromJSON(jsonString);
        
        if (importedProjects.length === 0) {
          alert('No valid projects found in file');
          return;
        }

        // Gestisci progetti duplicati
        setProjects(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProjects: Project[] = [];
          const updatedProjects = [...prev];

          importedProjects.forEach(imported => {
            if (existingIds.has(imported.id)) {
              // Aggiorna progetto esistente
              const index = updatedProjects.findIndex(p => p.id === imported.id);
              if (index >= 0) {
                updatedProjects[index] = imported;
              }
            } else {
              // Aggiungi nuovo progetto
              newProjects.push(imported);
            }
          });

          return [...updatedProjects, ...newProjects];
        });

        alert(`Successfully imported ${importedProjects.length} projects!`);
      } catch (error) {
        alert('Error importing file. Make sure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectStats = {
    total: projects.length,
    totalTodos: projects.reduce((sum, p) => sum + p.todos.length, 0),
    completedTodos: projects.reduce((sum, p) => sum + p.todos.filter(t => t.status === 'done').length, 0)
  };

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div className="projects-page__title">
          <h1>My Projects</h1>
          <p className="projects-page__stats">
            {projectStats.total} projects • {projectStats.completedTodos}/{projectStats.totalTodos} ToDos completed
          </p>
        </div>
        
        <div className="projects-page__actions">
          <button 
            className="btn btn--primary"
            onClick={handleCreateProject}
          >
            ➕ New Project
          </button>
          
          <button 
            className="btn btn--secondary"
            onClick={handleExportAll}
            disabled={projects.length === 0}
            title="Export all projects"
          >
                          📤 Export
          </button>
          
          <label className="btn btn--secondary file-input-label">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="projects-page__search">
          <input
            type="text"
            className="form-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal__content">
            <ProjectForm
              project={editingProject}
              onSubmit={handleSubmitProject}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      <div className="projects-page__content">
        {filteredProjects.length === 0 ? (
          <div className="projects-page__empty">
            {projects.length === 0 ? (
              <>
                <h2>No projects yet</h2>
                <p>Start by creating your first project!</p>
                <button 
                  className="btn btn--primary"
                  onClick={handleCreateProject}
                >
                  ➕ Create first project
                </button>
              </>
            ) : (
              <>
                <h2>No projects found</h2>
                <p>Try modifying the search term</p>
              </>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 