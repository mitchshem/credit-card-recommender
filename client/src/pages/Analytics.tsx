import React, { useState } from 'react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  const spendingData = {
    groceries: 850,
    dining: 420,
    gas: 180,
    travel: 320,
    other: 230
  };

  const rewardsData = {
    earned: 2847,
    potential: 3420,
    missed: 573
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Analytics</h1>
        <p>Track your spending patterns and optimize your reward strategy</p>
      </div>

      <div className="analytics-controls">
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card analytics-card">
          <h3>💰 Rewards Summary</h3>
          <div className="rewards-stats">
            <div className="stat-item">
              <span className="stat-value">{rewardsData.earned}</span>
              <span className="stat-label">Points Earned</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{rewardsData.potential}</span>
              <span className="stat-label">Potential Points</span>
            </div>
            <div className="stat-item missed">
              <span className="stat-value">{rewardsData.missed}</span>
              <span className="stat-label">Missed Points</span>
            </div>
          </div>
        </div>

        <div className="card analytics-card">
          <h3>📈 Spending Breakdown</h3>
          <div className="spending-chart">
            {Object.entries(spendingData).map(([category, amount]) => (
              <div key={category} className="spending-item">
                <div className="spending-bar">
                  <div 
                    className="spending-fill" 
                    style={{ width: `${(amount / Math.max(...Object.values(spendingData))) * 100}%` }}
                  />
                </div>
                <div className="spending-details">
                  <span className="category-name">{category}</span>
                  <span className="spending-amount">${amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <h3>🎯 Optimization Opportunities</h3>
          <div className="opportunities-list">
            <div className="opportunity-item">
              <span className="opportunity-icon">💡</span>
              <div className="opportunity-text">
                <strong>Switch grocery spending</strong>
                <p>Use Amex Gold for groceries to earn 4x instead of 1x</p>
                <span className="potential-gain">+255 points/month</span>
              </div>
            </div>
            <div className="opportunity-item">
              <span className="opportunity-icon">🔄</span>
              <div className="opportunity-text">
                <strong>Activate rotating category</strong>
                <p>Chase Freedom Flex 5% on PayPal purchases</p>
                <span className="potential-gain">+180 points/quarter</span>
              </div>
            </div>
            <div className="opportunity-item">
              <span className="opportunity-icon">✈️</span>
              <div className="opportunity-text">
                <strong>Travel card for flights</strong>
                <p>Use travel card for better earning rates</p>
                <span className="potential-gain">+96 points/month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card analytics-card">
          <h3>📅 Monthly Trends</h3>
          <div className="placeholder-chart">
            <p>Interactive spending and rewards charts would be displayed here</p>
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
