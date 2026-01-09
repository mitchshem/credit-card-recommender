import React, { useState, useEffect } from 'react';

type Page = 'advisor' | 'priorities' | 'wallet' | 'compare' | 'upgrade-guide';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigationItems = [
    { id: 'advisor', label: 'Advisor', icon: null },
    { id: 'priorities', label: 'Priorities', icon: null },
    { id: 'wallet', label: 'Wallet', icon: null },
    { id: 'compare', label: 'Compare', icon: null },
    { id: 'upgrade-guide', label: 'Upgrade Guide', icon: null },
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

  return (
    <div className="dashboard-layout">
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'sidebar-mobile' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            {sidebarOpen ? 'Credit Card Advisor' : 'CCA'}
          </h2>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
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
              aria-label={item.label}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigation(item.id);
                }
              }}
            >
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`main-content ${sidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
        <div className="content-wrapper">
          <div className="top-bar">
            <div className="top-bar-left">
              <h1 className="page-title">Credit Card Advisor</h1>
            </div>
            <div className="top-bar-right">
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
