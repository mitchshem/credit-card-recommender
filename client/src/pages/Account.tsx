import React, { useState } from 'react';

const Account: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    cardsTracked: 5,
    totalRewards: 12847
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>👤 My Account</h1>
          <p>Sign in to access your personal finance dashboard</p>
        </div>

        <div className="auth-section">
          <div className="card auth-card">
            <h3>Sign In</h3>
            <div className="auth-form">
              <div className="form-group">
                <label>Email:</label>
                <input type="email" placeholder="Enter your email" className="form-input" />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" placeholder="Enter your password" className="form-input" />
              </div>
              <button className="action-btn primary" onClick={handleLogin}>
                Sign In (Demo)
              </button>
            </div>
            
            <div className="auth-divider">
              <span>or</span>
            </div>
            
            <div className="social-auth">
              <button className="social-btn google">Continue with Google</button>
              <button className="social-btn apple">Continue with Apple</button>
            </div>
            
            <div className="auth-links">
              <a href="#forgot">Forgot Password?</a>
              <a href="#signup">Create Account</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 My Account</h1>
        <p>Manage your profile and preferences</p>
      </div>

      <div className="account-sections">
        <div className="profile-section">
          <div className="card">
            <h3>Profile Information</h3>
            <div className="profile-details">
              <div className="profile-item">
                <label>Name:</label>
                <span>{userProfile.name}</span>
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <span>{userProfile.email}</span>
              </div>
              <div className="profile-item">
                <label>Member Since:</label>
                <span>{userProfile.memberSince}</span>
              </div>
            </div>
            <button className="action-btn secondary">Edit Profile</button>
          </div>
        </div>

        <div className="stats-section">
          <div className="card">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{userProfile.cardsTracked}</span>
                <span className="stat-label">Cards Tracked</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userProfile.totalRewards.toLocaleString()}</span>
                <span className="stat-label">Total Rewards Earned</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">23</span>
                <span className="stat-label">Recommendations Used</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">$2,847</span>
                <span className="stat-label">Estimated Value</span>
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <div className="card">
            <h3>Preferences</h3>
            <div className="preferences-list">
              <div className="preference-item">
                <label>Email Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="preference-item">
                <label>Monthly Reports</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="preference-item">
                <label>Bonus Category Alerts</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="preference-item">
                <label>New Card Recommendations</label>
                <input type="checkbox" />
              </div>
            </div>
            <button className="action-btn secondary">Save Preferences</button>
          </div>
        </div>

        <div className="data-section">
          <div className="card">
            <h3>Data Management</h3>
            <div className="data-actions">
              <button className="action-btn secondary">Export Data</button>
              <button className="action-btn secondary">Import Data</button>
              <button className="action-btn danger">Delete Account</button>
            </div>
          </div>
        </div>

        <div className="session-section">
          <div className="card">
            <h3>Session</h3>
            <p>You are currently signed in as {userProfile.name}</p>
            <button className="action-btn secondary" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
