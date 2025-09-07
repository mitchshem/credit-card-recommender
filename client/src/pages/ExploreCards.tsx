import React, { useState } from 'react';
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

const ExploreCards: React.FC = () => {
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');

  const cards = cardsData as unknown as Card[];

  const getFilteredCards = (): Card[] => {
    let filtered = [...cards];

    if (filterBy !== 'all') {
      filtered = filtered.filter(card => {
        switch (filterBy) {
          case 'no-fee':
            return card.annual_fee === 0;
          case 'low-fee':
            return card.annual_fee > 0 && card.annual_fee <= 99;
          case 'medium-fee':
            return card.annual_fee >= 100 && card.annual_fee <= 299;
          case 'high-fee':
            return card.annual_fee >= 300;
          case 'travel':
            return card.reward_rates.travel > 1 || card.reward_rates.flights > 1 || card.reward_rates.hotels > 1;
          case 'dining':
            return card.reward_rates.dining > 1;
          case 'groceries':
            return card.reward_rates.groceries > 1;
          case 'cashback':
            return card.name.toLowerCase().includes('cash');
          default:
            return true;
        }
      });
    }

    if (networkFilter !== 'all') {
      filtered = filtered.filter(card => card.network === networkFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'fee-low':
          return a.annual_fee - b.annual_fee;
        case 'fee-high':
          return b.annual_fee - a.annual_fee;
        case 'rewards':
          const aMaxReward = Math.max(...Object.values(a.reward_rates));
          const bMaxReward = Math.max(...Object.values(b.reward_rates));
          return bMaxReward - aMaxReward;
        case 'network':
          return a.network.localeCompare(b.network);
        default:
          return 0;
      }
    });
  };

  const addToWallet = (cardId: string) => {
    const walletCards = JSON.parse(localStorage.getItem('walletCards') || '[]');
    if (!walletCards.includes(cardId)) {
      walletCards.push(cardId);
      localStorage.setItem('walletCards', JSON.stringify(walletCards));
      alert('Card added to wallet!');
    } else {
      alert('Card is already in your wallet!');
    }
  };

  const getHighestRewardCategory = (card: Card): string => {
    const rates = card.reward_rates;
    const maxRate = Math.max(...Object.values(rates));
    const category = Object.keys(rates).find(key => rates[key] === maxRate);
    return `${maxRate}x ${category}`;
  };

  const filteredCards = getFilteredCards();
  const networks = Array.from(new Set(cards.map(card => card.network)));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Explore Cards</h1>
        <p>Browse and discover credit cards from our comprehensive database</p>
      </div>

      <div className="explore-controls">
        <div className="filter-sort-controls">
          <div className="control-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Card Name</option>
              <option value="fee-low">Annual Fee (Low to High)</option>
              <option value="fee-high">Annual Fee (High to Low)</option>
              <option value="rewards">Highest Reward Rate</option>
              <option value="network">Network</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Filter by Category:</label>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">All Cards</option>
              <option value="no-fee">No Annual Fee</option>
              <option value="low-fee">Low Fee ($1-$99)</option>
              <option value="medium-fee">Medium Fee ($100-$299)</option>
              <option value="high-fee">High Fee ($300+)</option>
              <option value="travel">Travel Cards</option>
              <option value="dining">Dining Cards</option>
              <option value="groceries">Grocery Cards</option>
              <option value="cashback">Cash Back Cards</option>
            </select>
          </div>

          <div className="control-group">
            <label>Filter by Network:</label>
            <select value={networkFilter} onChange={(e) => setNetworkFilter(e.target.value)}>
              <option value="all">All Networks</option>
              {networks.map(network => (
                <option key={network} value={network}>{network}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="cards-results">
        <p className="results-count">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
      </div>

      <div className="cards-grid">
        {filteredCards.map(card => (
          <div key={card.id} className="explore-card">
            <div className="card-header">
              <h3 className="card-name">{card.name}</h3>
              <span className="card-network">{card.network}</span>
            </div>
            
            <div className="card-fee">
              <span className="fee-label">Annual Fee:</span>
              <span className="fee-amount">
                {card.annual_fee === 0 ? 'No Fee' : `$${card.annual_fee}`}
              </span>
            </div>

            <div className="card-rewards">
              <span className="rewards-label">Best Rate:</span>
              <span className="rewards-rate">{getHighestRewardCategory(card)}</span>
            </div>

            <div className="card-categories">
              {Object.entries(card.reward_rates).map(([category, rate]) => (
                rate > 1 && (
                  <span key={category} className="category-badge">
                    {rate}x {category}
                  </span>
                )
              ))}
            </div>

            <div className="card-perks">
              {card.perks.slice(0, 2).map((perk, index) => (
                <p key={index} className="perk-item">• {perk}</p>
              ))}
              {card.perks.length > 2 && (
                <p className="more-perks">+{card.perks.length - 2} more benefits</p>
              )}
            </div>

            {card.signup_bonus && (
              <div className="signup-bonus">
                <span className="bonus-label">Sign-up Bonus:</span>
                <p className="bonus-text">{card.signup_bonus}</p>
              </div>
            )}

            <div className="card-actions">
              <button 
                onClick={() => addToWallet(card.id)}
                className="btn-primary add-to-wallet"
              >
                Add to Wallet
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="no-results">
          <h3>No cards found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default ExploreCards;
