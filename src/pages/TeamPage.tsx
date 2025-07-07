import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { useProjects } from '../hooks/useProjects';
import './TeamPage.css';

function TeamPage() {
  const { navigation } = useProjects();

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  const mockTeamMembers = [
    { id: 1, name: 'John Doe', role: 'Project Manager', email: 'john.doe@company.com', phone: '+1 234 567 8901', status: 'active', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', role: 'Site Engineer', email: 'jane.smith@company.com', phone: '+1 234 567 8902', status: 'active', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', role: 'Architect', email: 'mike.johnson@company.com', phone: '+1 234 567 8903', status: 'busy', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', role: 'Safety Officer', email: 'sarah.wilson@company.com', phone: '+1 234 567 8904', status: 'active', avatar: 'SW' },
    { id: 5, name: 'Tom Brown', role: 'Quality Inspector', email: 'tom.brown@company.com', phone: '+1 234 567 8905', status: 'offline', avatar: 'TB' },
    { id: 6, name: 'Lisa Garcia', role: 'Cost Estimator', email: 'lisa.garcia@company.com', phone: '+1 234 567 8906', status: 'active', avatar: 'LG' },
  ];

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="team-page">
        <header className="team-page__header">
          <div>
            <h1>Team</h1>
            <p className="text-secondary">Manage team members and their roles</p>
          </div>
          <button className="btn btn--primary">
            <span className="material-symbols-outlined">person_add</span>
            Add Member
          </button>
        </header>
        
        <div className="team-page__content">
          <div className="team-page__stats">
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div className="stat-info">
                <h3>12</h3>
                <p>Total Members</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-symbols-outlined">online_prediction</span>
              </div>
              <div className="stat-info">
                <h3>8</h3>
                <p>Active Now</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-symbols-outlined">work</span>
              </div>
              <div className="stat-info">
                <h3>5</h3>
                <p>On Projects</p>
              </div>
            </div>
          </div>

          <div className="team-page__filters">
            <div className="search-box">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search team members..." />
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option>All Roles</option>
                <option>Project Manager</option>
                <option>Engineer</option>
                <option>Architect</option>
                <option>Inspector</option>
              </select>
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Busy</option>
                <option>Offline</option>
              </select>
            </div>
          </div>

          <div className="team-page__grid">
            {mockTeamMembers.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-card__header">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className={`member-status member-status--${member.status}`}></div>
                </div>
                <h3 className="member-card__name">{member.name}</h3>
                <p className="member-card__role">{member.role}</p>
                <div className="member-card__contact">
                  <div className="contact-item">
                    <span className="material-symbols-outlined">email</span>
                    <span>{member.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="material-symbols-outlined">phone</span>
                    <span>{member.phone}</span>
                  </div>
                </div>
                <div className="member-card__actions">
                  <button className="btn btn--secondary btn--small">
                    <span className="material-symbols-outlined">chat</span>
                    Message
                  </button>
                  <button className="btn-icon">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TeamPage; 