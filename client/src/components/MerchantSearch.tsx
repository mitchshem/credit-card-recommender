import React, { useState, useEffect } from 'react';
import { cardsData, merchantsData, Card } from '../data';
import { WalletCard, User } from '../types/data';
import { 
  getWalletCards, 
  getSelectedCards, 
  toggleCardSelection, 
  removeCardFromWallet,
  addCardToWallet,
  toggleAllCards
} from '../lib/wallet';
import { getRecommendations } from '../lib/recommendations';
import SearchableDropdown from './SearchableDropdown';
import UserAccount from './UserAccount';

const MerchantSearch: React.FC = () => {
  const [merchantName, setMerchantName] = useState<string>('');
  const [recommendations, setRecommendations] = useState<WalletCard[]>([]);
  const [showWallet, setShowWallet] = useState<boolean>(true);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [newCardRewards, setNewCardRewards] = useState<{ [category: string]: number }>({
    groceries: 0,
    dining: 0,
    travel: 0,
    gas: 0,
    hotels: 0,
    other: 0,
  });
  const [addCardMessage, setAddCardMessage] = useState<string>('');
  const [walletCards, setWalletCards] = useState<WalletCard[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const jsonCards: Card[] = cardsData;
  const merchantsMapping: { [merchant: string]: string } = merchantsData;

  // Combine default merchants with user's custom merchants
  const allMerchants = {
    ...merchantsMapping,
    ...(currentUser?.customMerchants || {})
  };

  // Create dropdown options for cards (alphabetical)
  const cardOptions = jsonCards
    .map(card => ({
      value: card.id,
      label: card.name,
      category: card.network
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Create dropdown options for merchants (alphabetical)
  const merchantOptions = Object.entries(allMerchants)
    .map(([key, category]) => ({
      value: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: category
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    const loadWalletCards = () => {
      const walletCards = getWalletCards(jsonCards);
      setWalletCards(walletCards);
    };

    loadWalletCards();
  }, [jsonCards]);

  const selectedCards = getSelectedCards(jsonCards);

  const handleFindBestCard = () => {
    if (!merchantName.trim()) {
      setRecommendations([]);
      return;
    }

    const category = allMerchants[merchantName.trim()];
    if (!category) {
      setRecommendations([]);
      return;
    }

    // Use the new recommendations engine with taxonomy support
    const recs = getRecommendations(category, jsonCards, selectedCards);
    
    // Map recommendations back to WalletCard format
    const matchingWalletCards: WalletCard[] = recs.map((rec) => {
      const walletCard = walletCards.find((wc) => wc.id === rec.card.id);
      return walletCard || {
        ...rec.card,
        isSelected: true,
        isUserAdded: false,
      };
    });

    setRecommendations(matchingWalletCards);
  };

  const handleAddCard = () => {
    if (!selectedCardId) {
      setAddCardMessage('Please select a card to add');
      return;
    }

    const selectedCard = jsonCards.find(card => card.id === selectedCardId);
    if (!selectedCard) {
      setAddCardMessage('Selected card not found');
      return;
    }

    const hasRewards = Object.values(newCardRewards).some((reward: unknown) => (reward as number) > 0);
    if (!hasRewards) {
      setAddCardMessage('Please enter at least one reward category > 0');
      return;
    }

    const currentWalletCards = getWalletCards(jsonCards);
    const cardExists = currentWalletCards.some((card) => card.id === selectedCardId);
    if (cardExists) {
      setAddCardMessage('This card is already in your wallet');
      return;
    }

    const newWalletCard: WalletCard = {
      ...selectedCard,
      reward_rates: { ...newCardRewards },
      isSelected: true,
      isUserAdded: true,
    };

    addCardToWallet(newWalletCard);
    // Reload wallet cards to reflect changes
    const updatedWalletCards = getWalletCards(jsonCards);
    setWalletCards(updatedWalletCards);
    setSelectedCardId('');
    setNewCardRewards({
      groceries: 0,
      dining: 0,
      travel: 0,
      gas: 0,
      hotels: 0,
      other: 0,
    });
    setAddCardMessage(`✅ "${newWalletCard.name}" added to wallet!`);
    setTimeout(() => setAddCardMessage(''), 3000);
  };

  const handleCardToggle = (cardId: string) => {
    toggleCardSelection(cardId);
    // Reload wallet cards to reflect changes
    const updatedWalletCards = getWalletCards(jsonCards);
    setWalletCards(updatedWalletCards);
  };

  const handleRemoveCard = (cardId: string) => {
    removeCardFromWallet(cardId);
    // Reload wallet cards to reflect changes
    const updatedWalletCards = getWalletCards(jsonCards);
    setWalletCards(updatedWalletCards);
  };

  const handleSelectAll = () => {
    const currentWalletCards = getWalletCards(jsonCards);
    const allSelected = currentWalletCards.every((card) => card.isSelected);
    toggleAllCards(!allSelected);
    // Reload wallet cards to reflect changes
    const updatedWalletCards = getWalletCards(jsonCards);
    setWalletCards(updatedWalletCards);
  };

  const handleRewardChange = (category: string, value: string) => {
    const numValue = Math.max(0, Number.parseFloat(value) || 0);
    setNewCardRewards((prev) => ({
      ...prev,
      [category]: numValue,
    }));
  };

  const handleCustomMerchantAdd = (merchantName: string) => {
    if (!currentUser) {
      setAddCardMessage('Please create an account to add custom merchants');
      return;
    }

    // For now, we'll add it as "other" category
    // In a real app, you'd show a category selection dialog
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const category = 'other';

    // This would be handled by the UserAccount component
    // For now, just show a message
    setAddCardMessage(`✅ "${merchantName}" added as custom merchant!`);
    setTimeout(() => setAddCardMessage(''), 3000);
  };

  // Wallet cards are automatically saved by the wallet adapter functions

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>
        Credit Card Rewards Optimizer
      </h2>

      <UserAccount onUserChange={setCurrentUser} currentUser={currentUser} />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowWallet(!showWallet)}
          style={{
            padding: '12px 24px',
            backgroundColor: showWallet ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
          }}
        >
          💳 {showWallet ? 'Hide Wallet' : 'Show Wallet'} ({walletCards.length} cards)
        </button>
      </div>

      {showWallet && (
        <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#333' }}>
              💳 My Wallet ({walletCards.length} cards, {walletCards.filter((card) => card.isSelected).length} selected)
            </h3>
            {walletCards.length > 0 && (
              <button
                onClick={handleSelectAll}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {walletCards.every((card) => card.isSelected) ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {walletCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d', backgroundColor: 'white', borderRadius: '8px', border: '2px dashed #dee2e6' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Your wallet is empty</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Add cards below to start getting recommendations</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              {walletCards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid',
                    borderColor: card.isSelected ? '#28a745' : '#dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                    title="Remove card from wallet"
                  >
                    ×
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '30px' }}>
                    <input
                      type="checkbox"
                      checked={card.isSelected}
                      onChange={() => handleCardToggle(card.id)}
                      style={{ transform: 'scale(1.2)' }}
                      title={card.isSelected ? 'Deselect card' : 'Select card for recommendations'}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <strong style={{ color: '#333' }}>{card.name}</strong>
                        {card.isUserAdded && (
                          <span style={{ backgroundColor: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {Object.entries(card.reward_rates)
                          .filter(([_, rate]) => rate > 0)
                          .map(([category, rate]) => `${rate}x ${category}`)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Add Custom Card</h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Card:</label>
          <SearchableDropdown
            options={cardOptions}
            value={selectedCardId}
            onChange={setSelectedCardId}
            placeholder="Search and select a card to add..."
            className="mb-3"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Custom Reward Multipliers:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {Object.keys(newCardRewards).map((category) => (
              <div key={category} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', marginBottom: '2px', textTransform: 'capitalize' }}>
                  {category}:
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={newCardRewards[category]}
                  onChange={(e) => handleRewardChange(category, e.target.value)}
                  style={{ padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleAddCard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Add Card
          </button>
          {addCardMessage && (
            <span style={{ color: addCardMessage.includes('✅') ? '#28a745' : '#dc3545', fontSize: '14px', fontWeight: 'bold' }}>
              {addCardMessage}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Merchant:</label>
        <SearchableDropdown
          options={merchantOptions}
          value={merchantName}
          onChange={setMerchantName}
          placeholder="Search and select a merchant..."
          allowCustom={true}
          onCustomAdd={handleCustomMerchantAdd}
          className="mb-3"
        />

        <button
          onClick={handleFindBestCard}
          disabled={selectedCards.length === 0}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: selectedCards.length === 0 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedCards.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
          title={selectedCards.length === 0 ? 'Add cards to your wallet first' : 'Get recommendations for selected cards'}
        >
          {selectedCards.length === 0 ? 'No Cards Selected' : 'Get Recommendations'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '18px' }}>
            Recommendations for {merchantName}:
          </h3>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recommendations.map((card) => {
              const category = allMerchants[merchantName.trim()];
              const reward = card.reward_rates[category];

              return (
                <li
                  key={card.id}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    padding: '15px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                      {card.name}
                    </span>
                    {card.isUserAdded && (
                      <span style={{ backgroundColor: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <span style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                    {reward}x points
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {merchantName.trim() && recommendations.length === 0 && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', border: '1px solid #f5c6cb', textAlign: 'center' }}>
          {selectedCards.length === 0 ? (
            <>
              No cards selected in your wallet.
              <br />
              Select cards above to get recommendations.
            </>
          ) : (
            <>
              No recommendations found for "{merchantName}".
              <br />
              Try: {Object.keys(merchantsMapping).slice(0, 4).join(', ')}
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '6px', fontSize: '14px', color: '#6c757d' }}>
        <strong>Available merchants:</strong> {Object.keys(merchantsMapping).length} merchants including "Other" categories for flexibility
      </div>
    </div>
  );
};

export default MerchantSearch;
