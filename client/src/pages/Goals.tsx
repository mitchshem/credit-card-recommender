import React, { useState } from 'react';

const Goals: React.FC = () => {
  const [priorities, setPriorities] = useState({
    cashback: 3,
    points: 4,
    status: 2,
    perks: 3,
    simplicity: 4
  });

  const handlePriorityChange = (category: string, value: number) => {
    setPriorities({ ...priorities, [category]: value });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎯 Your Goals</h1>
        <p>Set your priorities to get personalized recommendations</p>
      </div>

      <div className="goals-section">
        <div className="card">
          <h3>Priority Settings</h3>
          <p>Rate each factor from 1 (not important) to 5 (very important)</p>
          
          <div className="priority-controls">
            <div className="priority-item">
              <label>💰 Cash Back Rewards</label>
              <div className="priority-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={priorities.cashback}
                  onChange={(e) => handlePriorityChange('cashback', parseInt(e.target.value))}
                />
                <span className="priority-value">{priorities.cashback}</span>
              </div>
            </div>

            <div className="priority-item">
              <label>✈️ Travel Points</label>
              <div className="priority-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={priorities.points}
                  onChange={(e) => handlePriorityChange('points', parseInt(e.target.value))}
                />
                <span className="priority-value">{priorities.points}</span>
              </div>
            </div>

            <div className="priority-item">
              <label>👑 Elite Status</label>
              <div className="priority-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={priorities.status}
                  onChange={(e) => handlePriorityChange('status', parseInt(e.target.value))}
                />
                <span className="priority-value">{priorities.status}</span>
              </div>
            </div>

            <div className="priority-item">
              <label>🎁 Card Perks</label>
              <div className="priority-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={priorities.perks}
                  onChange={(e) => handlePriorityChange('perks', parseInt(e.target.value))}
                />
                <span className="priority-value">{priorities.perks}</span>
              </div>
            </div>

            <div className="priority-item">
              <label>🎯 Simplicity</label>
              <div className="priority-slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={priorities.simplicity}
                  onChange={(e) => handlePriorityChange('simplicity', parseInt(e.target.value))}
                />
                <span className="priority-value">{priorities.simplicity}</span>
              </div>
            </div>
          </div>

          <button className="action-btn primary">Save Preferences</button>
        </div>

        <div className="card">
          <h3>Your Profile</h3>
          <div className="profile-summary">
            <p><strong>Top Priority:</strong> {Object.entries(priorities).reduce((a, b) => priorities[a[0] as keyof typeof priorities] > priorities[b[0] as keyof typeof priorities] ? a : b)[0]}</p>
            <p><strong>Recommendation Style:</strong> Balanced approach</p>
            <p><strong>Risk Tolerance:</strong> Moderate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
