import React from 'react';

const RotatingCategories: React.FC = () => {
  const currentQuarter = "Q4 2025";
  
  const rotatingCategories = [
    {
      card: "Chase Freedom Flex",
      category: "PayPal & Warehouse Clubs",
      rate: "5%",
      limit: "$1,500",
      expires: "Dec 31, 2025"
    },
    {
      card: "Discover it",
      category: "Amazon & Target",
      rate: "5%",
      limit: "$1,500",
      expires: "Dec 31, 2025"
    },
    {
      card: "Chase Freedom",
      category: "PayPal & Warehouse Clubs",
      rate: "5%",
      limit: "$1,500",
      expires: "Dec 31, 2025"
    }
  ];

  const upcomingCategories = [
    {
      quarter: "Q1 2026",
      categories: ["Gas Stations", "Grocery Stores", "Drug Stores"]
    },
    {
      quarter: "Q2 2026",
      categories: ["Restaurants", "Gas Stations", "Home Improvement"]
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔄 Rotating Categories</h1>
        <p>Track current and upcoming bonus categories to maximize your rewards</p>
      </div>

      <div className="categories-section">
        <div className="current-categories">
          <h3>Current Quarter: {currentQuarter}</h3>
          <div className="categories-grid">
            {rotatingCategories.map((item, index) => (
              <div key={index} className="category-card active">
                <div className="card-header">
                  <h4>{item.card}</h4>
                  <span className="rate-badge">{item.rate}</span>
                </div>
                <div className="category-details">
                  <p className="category-name">{item.category}</p>
                  <p className="category-limit">Limit: {item.limit}</p>
                  <p className="category-expires">Expires: {item.expires}</p>
                </div>
                <div className="category-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }} />
                  </div>
                  <span className="progress-text">$975 / $1,500 spent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-categories">
          <h3>Upcoming Categories</h3>
          {upcomingCategories.map((quarter, index) => (
            <div key={index} className="card">
              <h4>{quarter.quarter}</h4>
              <div className="upcoming-list">
                {quarter.categories.map((category, catIndex) => (
                  <span key={catIndex} className="category-tag">{category}</span>
                ))}
              </div>
              <p className="note">*Categories are predictions based on historical patterns</p>
            </div>
          ))}
        </div>

        <div className="category-tips">
          <div className="card">
            <h3>💡 Optimization Tips</h3>
            <ul>
              <li>Activate your rotating categories each quarter</li>
              <li>Set calendar reminders for category changes</li>
              <li>Track your spending to maximize bonuses</li>
              <li>Consider gift card purchases for future spending</li>
              <li>Plan large purchases around bonus categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatingCategories;
