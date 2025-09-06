import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to Your Personal Finance Dashboard</h1>
        <p>Manage your credit cards, track rewards, and optimize your spending</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>💳 Your Wallet</h3>
          <p>5 cards selected</p>
          <p className="card-subtitle">Manage your credit card collection</p>
        </div>

        <div className="dashboard-card">
          <h3>🎯 Smart Recommendations</h3>
          <p>Get personalized card suggestions</p>
          <p className="card-subtitle">Based on your spending patterns</p>
        </div>

        <div className="dashboard-card">
          <h3>📊 Rewards Analytics</h3>
          <p>Track your earning potential</p>
          <p className="card-subtitle">Optimize your reward strategy</p>
        </div>

        <div className="dashboard-card">
          <h3>🔄 Rotating Categories</h3>
          <p>Current bonus categories</p>
          <p className="card-subtitle">Maximize your quarterly earnings</p>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">Find Best Card</button>
          <button className="action-btn secondary">Add Custom Card</button>
          <button className="action-btn secondary">View Analytics</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
