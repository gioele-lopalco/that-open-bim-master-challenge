import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavigationItem } from '../classes/Project';
import './Sidebar.css';

interface SidebarProps {
  navigationItems: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-container">
          <div className="sidebar__logo-text">
            <div className="sidebar__logo-main">CONSTRUCTION</div>
            <div className="sidebar__logo-sub">COMPANY</div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => (
            <li key={item.id} className="sidebar__nav-item">
              {item.path ? (
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `sidebar__nav-button ${isActive ? 'sidebar__nav-button--active' : ''}`
                  }
                >
                  <span className="material-symbols-outlined sidebar__nav-icon">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              ) : (
                <button 
                  className="sidebar__nav-button"
                  onClick={item.onClick}
                >
                  <span className="material-symbols-outlined sidebar__nav-icon">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 