/**
 * Login Page (MVP)
 * 
 * Simple login page that redirects authenticated users.
 * Uses existing AuthModal component for sign-in.
 */

import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/AuthModal';

const LoginPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = React.useState(true);

  // If user is already signed in, we'll handle redirect in App
  useEffect(() => {
    if (currentUser) {
      setShowModal(false);
    }
  }, [currentUser]);

  return (
    <div className="page-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '2rem'
      }}>
        <h1 style={{ 
          color: 'var(--primary-800)', 
          marginBottom: '0.5rem',
          fontSize: '2rem'
        }}>
          Credit Card Advisor
        </h1>
        <p style={{ 
          color: 'var(--primary-600)', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Sign in to optimize your credit card rewards
        </p>
        
        {showModal && <AuthModal isOpen={showModal} onClose={() => {}} />}
      </div>
    </div>
  );
};

export default LoginPage;

