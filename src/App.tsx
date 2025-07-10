import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectOverviewPage />} />
          <Route path="/project/:id/detail" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
