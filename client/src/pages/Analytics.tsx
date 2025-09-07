import React, { useState, useEffect } from 'react';
import cardsData from '../data/cards.json';

interface Card {
  id: string;
  name: string;
  network: string;
  annual_fee: number;
  reward_rates: { [category: string]: number };
  perks: string[];
  source?: string;
  category?: string;
  signup_bonus?: string;
}

interface SpendingData {
  groceries: number;
  dining: number;
  gas: number;
  travel: number;
  other: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  customMerchants: { [merchant: string]: string };
  customCards: any[];
  preferences: {
    defaultWalletCards: string[];
    favoriteMerchants: string[];
  };
  spendingData?: SpendingData;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [spendingData, setSpendingData] = useState<SpendingData>({
    groceries: 0,
    dining: 0,
    gas: 0,
    travel: 0,
    other: 0
  });
  const [showSpendingForm, setShowSpendingForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      if (user.spendingData) {
        setSpendingData(user.spendingData);
      }
    }
  }, []);

  const updateSpendingData = (newSpending: SpendingData) => {
    setSpendingData(newSpending);
    
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        spendingData: newSpending
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
    
    setShowSpendingForm(false);
  };

  const calculateRewards = () => {
    const cards = cardsData as unknown as Card[];
    const walletCards = JSON.parse(localStorage.getItem('walletCards') || '[]');
    const userCards = cards.filter(card => walletCards.includes(card.id));

    let totalEarned = 0;
    let potentialEarned = 0;

    Object.entries(spendingData).forEach(([category, amount]) => {
      const bestUserCard = userCards.reduce((best, card) => {
        const rate = card.reward_rates[category] || card.reward_rates.other || 1;
        const bestRate = best ? (best.reward_rates[category] || best.reward_rates.other || 1) : 0;
        return rate > bestRate ? card : best;
      }, null as Card | null);

      const bestOverallCard = cards.reduce((best, card) => {
        const rate = card.reward_rates[category] || card.reward_rates.other || 1;
        const bestRate = best.reward_rates[category] || best.reward_rates.other || 1;
        return rate > bestRate ? card : best;
      });

      const userRate = bestUserCard ? (bestUserCard.reward_rates[category] || bestUserCard.reward_rates.other || 1) : 1;
      const optimalRate = bestOverallCard.reward_rates[category] || bestOverallCard.reward_rates.other || 1;

      totalEarned += amount * userRate;
      potentialEarned += amount * optimalRate;
    });

    return {
      earned: Math.round(totalEarned),
      potential: Math.round(potentialEarned),
      missed: Math.round(potentialEarned - totalEarned)
    };
  };

  const getOptimizationOpportunities = () => {
    const cards = cardsData as unknown as Card[];
    const walletCards = JSON.parse(localStorage.getItem('walletCards') || '[]');
    const userCards = cards.filter(card => walletCards.includes(card.id));
    const opportunities: Array<{
      category: string;
      currentCard: string;
      recommendedCard: string;
      currentRate: number;
      recommendedRate: number;
      monthlyGain: number;
      spending: number;
    }> = [];

    Object.entries(spendingData).forEach(([category, amount]) => {
      if (amount === 0) return;

      const bestUserCard = userCards.reduce((best, card) => {
        const rate = card.reward_rates[category] || card.reward_rates.other || 1;
        const bestRate = best ? (best.reward_rates[category] || best.reward_rates.other || 1) : 0;
        return rate > bestRate ? card : best;
      }, null as Card | null);

      const bestOverallCard = cards.reduce((best, card) => {
        const rate = card.reward_rates[category] || card.reward_rates.other || 1;
        const bestRate = best.reward_rates[category] || best.reward_rates.other || 1;
        return rate > bestRate ? card : best;
      });

      const userRate = bestUserCard ? (bestUserCard.reward_rates[category] || bestUserCard.reward_rates.other || 1) : 1;
      const optimalRate = bestOverallCard.reward_rates[category] || bestOverallCard.reward_rates.other || 1;

      if (optimalRate > userRate) {
        const monthlyGain = amount * (optimalRate - userRate);
        opportunities.push({
          category,
          currentCard: bestUserCard?.name || 'No card',
          recommendedCard: bestOverallCard.name,
          currentRate: userRate,
          recommendedRate: optimalRate,
          monthlyGain: Math.round(monthlyGain),
          spending: amount
        });
      }
    });

    return opportunities.sort((a, b) => b.monthlyGain - a.monthlyGain).slice(0, 3);
  };

  const rewardsData = calculateRewards();
  const opportunities = getOptimizationOpportunities();
  const totalSpending = Object.values(spendingData).reduce((sum, amount) => sum + amount, 0);

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
        
        <button 
          onClick={() => setShowSpendingForm(true)}
          className="btn-primary"
        >
          Update Spending Data
        </button>
      </div>

      {showSpendingForm && (
        <div className="card spending-form">
          <h3>Monthly Spending by Category</h3>
          <div className="form-grid">
            {Object.entries(spendingData).map(([category, amount]) => (
              <div key={category} className="form-group">
                <label>{category.charAt(0).toUpperCase() + category.slice(1)}:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setSpendingData({
                    ...spendingData,
                    [category]: parseInt(e.target.value) || 0
                  })}
                  placeholder="$0"
                  className="form-input"
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button 
              onClick={() => updateSpendingData(spendingData)}
              className="btn-primary"
            >
              Save Spending Data
            </button>
            <button 
              onClick={() => setShowSpendingForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          <div className="efficiency-score">
            <span className="score-label">Efficiency Score:</span>
            <span className="score-value">
              {rewardsData.potential > 0 ? Math.round((rewardsData.earned / rewardsData.potential) * 100) : 0}%
            </span>
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
                    style={{ width: totalSpending > 0 ? `${(amount / totalSpending) * 100}%` : '0%' }}
                  />
                </div>
                <div className="spending-details">
                  <span className="category-name">{category}</span>
                  <span className="spending-amount">${amount}</span>
                  <span className="spending-percentage">
                    {totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="total-spending">
            <strong>Total Monthly Spending: ${totalSpending}</strong>
          </div>
        </div>

        <div className="card analytics-card">
          <h3>🎯 Optimization Opportunities</h3>
          <div className="opportunities-list">
            {opportunities.length > 0 ? opportunities.map((opp, index) => (
              <div key={index} className="opportunity-item">
                <span className="opportunity-icon">💡</span>
                <div className="opportunity-text">
                  <strong>Optimize {opp.category} spending</strong>
                  <p>Switch from {opp.currentCard} ({opp.currentRate}x) to {opp.recommendedCard} ({opp.recommendedRate}x)</p>
                  <span className="potential-gain">+{opp.monthlyGain} points/month</span>
                </div>
              </div>
            )) : (
              <div className="no-opportunities">
                <p>Great job! You're already optimizing your rewards.</p>
                <p>Update your spending data to see personalized recommendations.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card analytics-card">
          <h3>📅 Monthly Trends</h3>
          <div className="trends-chart">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '60%' }}>
                  <span className="bar-label">Jan</span>
                </div>
                <div className="chart-bar" style={{ height: '80%' }}>
                  <span className="bar-label">Feb</span>
                </div>
                <div className="chart-bar" style={{ height: '45%' }}>
                  <span className="bar-label">Mar</span>
                </div>
                <div className="chart-bar" style={{ height: '90%' }}>
                  <span className="bar-label">Apr</span>
                </div>
                <div className="chart-bar" style={{ height: '70%' }}>
                  <span className="bar-label">May</span>
                </div>
              </div>
            </div>
            <p className="chart-note">Historical spending trends (demo data)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
