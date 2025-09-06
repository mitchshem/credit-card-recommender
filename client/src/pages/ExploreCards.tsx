import React, { useState } from 'react';

const ExploreCards: React.FC = () => {
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Explore Cards</h1>
        <p>Browse and discover credit cards from our comprehensive database</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Card Name</option>
            <option value="annual_fee">Annual Fee</option>
            <option value="rewards">Reward Rate</option>
            <option value="network">Network</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by:</label>
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Cards</option>
            <option value="no_fee">No Annual Fee</option>
            <option value="travel">Travel Cards</option>
            <option value="cashback">Cash Back Cards</option>
            <option value="business">Business Cards</option>
          </select>
        </div>
      </div>

      <div className="placeholder-content">
        <div className="card">
          <h3>Card Database Explorer</h3>
          <p>This feature will allow you to:</p>
          <ul>
            <li>Browse all available credit cards</li>
            <li>Filter by category, annual fee, and network</li>
            <li>Sort by various criteria</li>
            <li>Compare cards side by side</li>
            <li>Add cards directly to your wallet</li>
          </ul>
          <p><em>Coming soon - comprehensive card database integration</em></p>
        </div>
      </div>
    </div>
  );
};

export default ExploreCards;
