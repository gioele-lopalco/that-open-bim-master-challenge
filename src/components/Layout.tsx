import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <div className="layout">
      <aside className="layout__sidebar">
        {sidebar}
      </aside>
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
};

export default Layout;