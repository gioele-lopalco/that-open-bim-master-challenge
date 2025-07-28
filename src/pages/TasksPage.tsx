import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { useProjects } from '../hooks/useProjects';
import './TasksPage.css';

export function TasksPage() {
  const { navigation } = useProjects();

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  const mockTasks = [
    { id: 1, title: 'Review architectural plans', priority: 'high', status: 'pending', assignee: 'John Doe', due: '2024-01-15' },
    { id: 2, title: 'Site inspection', priority: 'medium', status: 'in-progress', assignee: 'Jane Smith', due: '2024-01-18' },
    { id: 3, title: 'Material procurement', priority: 'low', status: 'completed', assignee: 'Mike Johnson', due: '2024-01-12' },
    { id: 4, title: 'Safety briefing', priority: 'high', status: 'pending', assignee: 'Sarah Wilson', due: '2024-01-20' },
    { id: 5, title: 'Quality control check', priority: 'medium', status: 'in-progress', assignee: 'Tom Brown', due: '2024-01-22' },
  ];

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="tasks-page">
        <header className="tasks-page__header">
          <div>
            <h1>Tasks</h1>
            <p className="text-secondary">Track and manage project tasks and assignments</p>
          </div>
          <button className="btn btn--primary">
            <span className="material-symbols-outlined">add_task</span>
            New Task
          </button>
        </header>
        
        <div className="tasks-page__content">
          <div className="tasks-page__filters">
            <div className="search-box">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search tasks..." />
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option>All Tasks</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="tasks-page__table">
            <div className="table-header">
              <div className="table-cell">Task</div>
              <div className="table-cell">Priority</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Assignee</div>
              <div className="table-cell">Due Date</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {mockTasks.map((task) => (
              <div key={task.id} className="table-row">
                <div className="table-cell">
                  <div className="task-info">
                    <span className="material-symbols-outlined task-icon">task</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`priority-badge priority-badge--${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge status-badge--${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="table-cell">
                  <div className="assignee">
                    <div className="assignee-avatar">{task.assignee.split(' ').map(n => n[0]).join('')}</div>
                    <span>{task.assignee}</span>
                  </div>
                </div>
                <div className="table-cell">{task.due}</div>
                <div className="table-cell">
                  <div className="task-actions">
                    <button className="btn-icon">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="btn-icon">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}