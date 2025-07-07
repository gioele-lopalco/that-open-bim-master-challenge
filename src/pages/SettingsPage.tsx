import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { useProjects } from '../hooks/useProjects';
import './SettingsPage.css';

function SettingsPage() {
  const { navigation } = useProjects();

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="settings-page">
        <header className="settings-page__header">
          <div>
            <h1>Settings</h1>
            <p className="text-secondary">Configure your application preferences</p>
          </div>
        </header>
        
        <div className="settings-page__content">
          <div className="settings-page__sidebar">
            <nav className="settings-nav">
              <button className="settings-nav__item settings-nav__item--active">
                <span className="material-symbols-outlined">account_circle</span>
                Profile
              </button>
              <button className="settings-nav__item">
                <span className="material-symbols-outlined">notifications</span>
                Notifications
              </button>
              <button className="settings-nav__item">
                <span className="material-symbols-outlined">security</span>
                Security
              </button>
              <button className="settings-nav__item">
                <span className="material-symbols-outlined">palette</span>
                Appearance
              </button>
              <button className="settings-nav__item">
                <span className="material-symbols-outlined">business</span>
                Company
              </button>
            </nav>
          </div>

          <div className="settings-page__main">
            <div className="settings-section">
              <h2 className="settings-section__title">Profile Information</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value="John Doe" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value="john.doe@company.com" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value="+1 234 567 8901" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" value="Senior Project Manager" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select className="form-select">
                    <option>Construction Management</option>
                    <option>Engineering</option>
                    <option>Architecture</option>
                    <option>Quality Control</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2 className="settings-section__title">Preferences</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked />
                    <span className="checkmark"></span>
                    Email notifications for new projects
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked />
                    <span className="checkmark"></span>
                    Desktop notifications for urgent tasks
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Weekly progress reports
                  </label>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select className="form-select">
                    <option>English</option>
                    <option>Italian</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Timezone</label>
                  <select className="form-select">
                    <option>UTC+1 (Rome)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC-5 (New York)</option>
                    <option>UTC-8 (Los Angeles)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn btn--primary">Save Changes</button>
              <button className="btn btn--secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SettingsPage; 