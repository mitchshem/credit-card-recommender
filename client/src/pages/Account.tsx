import React from 'react';
import UserAccount from '../components/UserAccount';
import ScraperRefresh from '../components/ScraperRefresh';

const Account: React.FC = () => {
  const handleUserChange = (user: any) => {
    console.log('User changed:', user);
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 My Account</h1>
        <p>Manage your profile and preferences</p>
      </div>

      <div className="account-section">
        <UserAccount 
          onUserChange={handleUserChange}
          currentUser={currentUser}
        />

        <div className="card">
          <h3>Account Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Email Notifications:</label>
              <input type="checkbox" defaultChecked />
              <span>Receive updates about new cards and features</span>
            </div>
            
            <div className="setting-item">
              <label>Data Sync:</label>
              <input type="checkbox" defaultChecked />
              <span>Sync wallet and preferences across devices</span>
            </div>

            <div className="setting-item">
              <label>Analytics Tracking:</label>
              <input type="checkbox" defaultChecked />
              <span>Track spending patterns for better recommendations</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Data Management</h3>
          <div className="data-actions">
            <button className="btn-secondary">Export Data</button>
            <button className="btn-secondary">Import Data</button>
            <button className="btn-danger">Clear All Data</button>
          </div>
          <p className="data-note">
            Export your wallet, custom merchants, and preferences. 
            Clear all data will reset the app to default state.
          </p>
        </div>

        <div className="card">
          <ScraperRefresh />
        </div>
      </div>
    </div>
  );
};

export default Account;
