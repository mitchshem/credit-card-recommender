import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/wallet', label: 'Wallet', icon: '💳' },
    { path: '/explore', label: 'Explore Cards', icon: '🔍' },
    { path: '/smart-match', label: 'Smart Match', icon: '🎯' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/points-converter', label: 'Points Converter', icon: '💰' },
    { path: '/rotating-categories', label: 'Rotating Categories', icon: '🔄' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/upgrade-guide', label: 'Upgrade Guide', icon: '📈' },
    { path: '/learn', label: 'Learn', icon: '📚' },
    { path: '/account', label: 'My Account', icon: '👤' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null && !isMobile) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'sidebar-mobile' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            {sidebarOpen ? 'Personal Finance' : 'PF'}
          </h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`main-content ${sidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
