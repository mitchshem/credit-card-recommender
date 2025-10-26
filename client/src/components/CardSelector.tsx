import React, { useState, useMemo } from 'react';
import { cardsData } from '../data';
import { Card } from '../types/data';
import './CardSelector.css';

interface CardSelectorProps {
  onSelectCard: (card: Card) => void;
  excludedCardIds?: string[];
}

const CardSelector: React.FC<CardSelectorProps> = ({ onSelectCard, excludedCardIds = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const availableCards = useMemo(() => {
    return (cardsData as Card[]).filter(card => !excludedCardIds.includes(card.id));
  }, [excludedCardIds]);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableCards.slice(0, 10); // Show top 10 when no search
    }

    const query = searchQuery.toLowerCase();
    return availableCards.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.network?.toLowerCase().includes(query) ||
      card.issuer?.toLowerCase().includes(query) ||
      card.categories?.some(cat => cat.toLowerCase().includes(query))
    ).slice(0, 10);
  }, [searchQuery, availableCards]);

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
    setSearchQuery(card.name);
    setIsOpen(false);
    onSelectCard(card);
  };

  const formatSignupBonus = (bonus: Card['signup_bonus']) => {
    if (!bonus) return '';
    
    const amount = bonus.points || bonus.miles;
    if (!amount) return '';
    
    return `${amount.toLocaleString()} ${bonus.points ? 'points' : 'miles'} after $${bonus.spend_required.toLocaleString()} spend`;
  };

  const getCardCategory = (card: Card) => {
    if (card.categories && card.categories.length > 0) {
      return card.categories[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'General Purpose';
  };

  return (
    <div className="card-selector-container">
      <div className="card-selector">
        <div className="card-selector-input-wrapper">
          <input
            type="text"
            className="card-selector-input"
            placeholder="Search for a credit card..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay to allow card selection click
              setTimeout(() => setIsOpen(false), 200);
            }}
          />
          <span className="card-selector-icon">🔍</span>
        </div>

        {isOpen && filteredCards.length > 0 && (
          <div className="card-selector-dropdown">
            {filteredCards.map(card => (
              <div
                key={card.id}
                className="card-selector-option"
                onClick={() => handleSelectCard(card)}
              >
                <div className="card-option-header">
                  <div>
                    <div className="card-option-name">{card.name}</div>
                    <div className="card-option-meta">
                      {card.issuer || card.network} • {getCardCategory(card)}
                      {card.annual_fee === 0 && <span className="free-badge">No Annual Fee</span>}
                    </div>
                  </div>
                  <div className="card-option-annual-fee">
                    {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
                  </div>
                </div>
                
                {card.signup_bonus && (
                  <div className="card-option-bonus">
                    🎁 {formatSignupBonus(card.signup_bonus)}
                  </div>
                )}

                {card.reward_rates && Object.keys(card.reward_rates).length > 0 && (
                  <div className="card-option-rewards">
                    {Object.entries(card.reward_rates)
                      .slice(0, 2)
                      .map(([category, rate]) => (
                        <span key={category} className="reward-tag">
                          {rate}x {category.replace(/_/g, ' ')}
                        </span>
                      ))}
                    {Object.keys(card.reward_rates).length > 2 && (
                      <span className="reward-tag">
                        +{Object.keys(card.reward_rates).length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCard && (
        <div className="card-preview">
          <div className="card-preview-header">
            <div>
              <h3>{selectedCard.name}</h3>
              <p className="card-preview-subtitle">
                {selectedCard.issuer || selectedCard.network} • Annual Fee: {selectedCard.annual_fee === 0 ? 'Free' : `$${selectedCard.annual_fee}`}
              </p>
            </div>
            <button 
              className="card-preview-close"
              onClick={() => {
                setSelectedCard(null);
                setSearchQuery('');
              }}
            >
              ×
            </button>
          </div>

          {selectedCard.signup_bonus && (
            <div className="card-preview-section">
              <strong>🎁 Sign-Up Bonus</strong>
              <p>{formatSignupBonus(selectedCard.signup_bonus)}</p>
              <p className="card-preview-value">Worth approximately ${selectedCard.signup_bonus.value}</p>
            </div>
          )}

          {selectedCard.reward_rates && Object.keys(selectedCard.reward_rates).length > 0 && (
            <div className="card-preview-section">
              <strong>💰 Reward Rates</strong>
              <div className="reward-rates-grid">
                {Object.entries(selectedCard.reward_rates).map(([category, rate]) => (
                  <div key={category} className="reward-rate-item">
                    <span className="reward-rate-category">{category.replace(/_/g, ' ')}</span>
                    <span className="reward-rate-value">{rate}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCard.perks && selectedCard.perks.length > 0 && (
            <div className="card-preview-section">
              <strong>✨ Key Features</strong>
              <ul className="card-perks-list">
                {selectedCard.perks.slice(0, 5).map((perk, index) => (
                  <li key={index}>{perk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardSelector;
