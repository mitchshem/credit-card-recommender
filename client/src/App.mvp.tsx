/**
 * MVP App - Simplified version using new domain models and recommendation engine
 * 
 * This version uses the new MVP pages and architecture.
 * To use: Rename App.tsx to App.old.tsx and rename this to App.tsx
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/mvp/LoginPage';
import WalletSetupPage from './pages/mvp/WalletSetupPage';
import RecommendPage from './pages/mvp/RecommendPage';
import Home from './pages/Home';
import Wallet from './pages/Wallet';

type Page = 'home' | 'wallet' | 'recommend' | 'wallet-setup';

function MVPAppContent() {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Redirect logic: if not authenticated, show login
  useEffect(() => {
    if (!loading && !currentUser) {
      setCurrentPage('home');
    }
  }, [currentUser, loading]);

  const renderPage = () => {
    // If not authenticated, show login/home page
    if (!currentUser && !loading) {
      return <LoginPage />;
    }

    if (loading) {
      return (
        <div className="page-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 0, 0, 0.1)',
              borderTopColor: 'var(--primary-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: 'var(--primary-600)' }}>Loading...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      );
    }

    // Authenticated user - show MVP pages
    switch (currentPage) {
      case 'home':
      case 'recommend':
        return <RecommendPage />;
      case 'wallet':
      case 'wallet-setup':
        return <WalletSetupPage />;
      default:
        return <RecommendPage />;
    }
  };

  // MVP Navigation - simplified
  const handleMVPNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <Layout 
      currentPage={currentPage === 'recommend' ? 'home' : currentPage === 'wallet-setup' ? 'wallet' : currentPage}
      setCurrentPage={(page) => {
        // Map existing page names to MVP pages
        if (page === 'home') {
          handleMVPNavigation('recommend');
        } else if (page === 'wallet') {
          handleMVPNavigation('wallet-setup');
        }
      }}
    >
      {renderPage()}
    </Layout>
  );
}

function MVPApp() {
  return (
    <AuthProvider>
      <MVPAppContent />
    </AuthProvider>
  );
}

export default MVPApp;

