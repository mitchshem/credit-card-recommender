import React, { useState, useEffect } from 'react';

type Page = 'home' | 'wallet' | 'explore' | 'smart-match' | 'goals' | 'points-converter' | 'rotating-categories' | 'analytics' | 'upgrade-guide' | 'learn' | 'account';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'wallet', label: 'Wallet', icon: '💳' },
    { id: 'explore', label: 'Explore Cards', icon: '🔍' },
    { id: 'smart-match', label: 'Smart Match', icon: '🎯' },
  ];

  const toolsMenuItems = [
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'points-converter', label: 'Points Converter', icon: '💰' },
    { id: 'rotating-categories', label: 'Rotating Categories', icon: '🔄' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'upgrade-guide', label: 'Upgrade Guide', icon: '📈' },
    { id: 'learn', label: 'Learn', icon: '📚' },
  ];

  const userMenuItems = [
    { id: 'account', label: 'My Account', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'logout', label: 'Sign Out', icon: '🚪' },
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

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId as Page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleUserMenuAction = (actionId: string) => {
    if (actionId === 'account') {
      setCurrentPage('account');
    } else if (actionId === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
    } else if (actionId === 'settings') {
      // Handle settings logic
      console.log('Settings clicked');
    }
    setShowUserMenu(false);
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
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
          
          {/* Tools Dropdown */}
          <div className="dropdown-container">
            <button
              className={`dropdown-trigger ${showToolsMenu ? 'dropdown-open' : ''}`}
              onClick={() => setShowToolsMenu(!showToolsMenu)}
            >
              <span className="nav-icon">🛠️</span>
              {sidebarOpen && (
                <>
                  <span className="nav-label">Tools</span>
                  <span className="dropdown-arrow">{showToolsMenu ? '▲' : '▼'}</span>
                </>
              )}
            </button>
            {showToolsMenu && (
              <div className="dropdown-menu">
                {toolsMenuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`dropdown-item ${currentPage === item.id ? 'dropdown-item-active' : ''}`}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <span className="dropdown-icon">{item.icon}</span>
                    <span className="dropdown-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className={`main-content ${sidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
        <div className="content-wrapper">
          <div className="top-bar">
            <div className="top-bar-left">
              <h1 className="page-title">Credit Card Advisor</h1>
            </div>
            <div className="top-bar-right">
              {/* User Menu Dropdown */}
              <div className="user-menu-container">
                <button
                  className={`user-menu-trigger ${showUserMenu ? 'user-menu-open' : ''}`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <span className="user-name">Mitchell</span>
                  <span className="dropdown-arrow">{showUserMenu ? '▲' : '▼'}</span>
                </button>
                {showUserMenu && (
                  <div className="user-menu-dropdown">
                    {userMenuItems.map((item) => (
                      <button
                        key={item.id}
                        className={`user-menu-item ${currentPage === item.id ? 'user-menu-item-active' : ''}`}
                        onClick={() => handleUserMenuAction(item.id)}
                      >
                        <span className="user-menu-icon">{item.icon}</span>
                        <span className="user-menu-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
