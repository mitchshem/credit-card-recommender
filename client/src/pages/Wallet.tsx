import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CardSelector from '../components/CardSelector';
import { Card } from '../types/data';
import { cardsData } from '../data';
import {
  getUserWallet,
  mergeUserWalletWithCards,
  addCardToUserWallet,
  removeCardFromUserWallet,
  toggleUserCardSelection,
  toggleAllUserCardsSelection
} from '../lib/userWallet';

const Wallet: React.FC = () => {
  const { currentUser } = useAuth();
  const [userCards, setUserCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  // Load user's wallet cards
  useEffect(() => {
    if (currentUser) {
      loadUserWallet();
    } else {
      // Guest mode - use local storage
      setUserCards([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadUserWallet = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const wallet = await getUserWallet(currentUser.uid);
      
      if (wallet) {
        const mergedCards = mergeUserWalletWithCards(wallet, cardsData as Card[]);
        setUserCards(mergedCards);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      setMessage('Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = async (card: Card) => {
    if (!currentUser) {
      setMessage('Please sign in to add cards to your wallet');
      return;
    }

    try {
      setIsLoading(true);
      await addCardToUserWallet(currentUser.uid, card.id, undefined, true);
      setMessage(`✅ ${card.name} added to your wallet!`);
      setShowAddCard(false);
      await loadUserWallet();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding card:', error);
      setMessage('Failed to add card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      await removeCardFromUserWallet(currentUser.uid, cardId);
      setMessage('Card removed from wallet');
      await loadUserWallet();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error removing card:', error);
      setMessage('Failed to remove card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelection = async (cardId: string) => {
    if (!currentUser) return;

    try {
      await toggleUserCardSelection(currentUser.uid, cardId);
      await loadUserWallet();
    } catch (error) {
      console.error('Error toggling selection:', error);
    }
  };

  const handleToggleAll = async (selected: boolean) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      await toggleAllUserCardsSelection(currentUser.uid, selected);
      await loadUserWallet();
    } catch (error) {
      console.error('Error toggling all cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allSelected = userCards.length > 0 && userCards.every(card => card.isSelected);

  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>💳 My Wallet</h1>
          <p>Sign in to manage your credit cards and get personalized recommendations</p>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 'var(--radius-2xl)',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            Sign in required
          </h2>
          <p style={{ color: 'var(--primary-600)' }}>
            Please sign in to access your wallet and manage your credit cards
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💳 My Wallet</h1>
        <p>Manage your credit cards and get personalized recommendations</p>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          background: 'var(--accent-500)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {/* Add Card Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2rem',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: '2rem',
        border: '1px solid var(--primary-200)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ color: 'var(--primary-800)' }}>Add Card to Wallet</h2>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="btn-primary"
            style={{ padding: '0.5rem 1.5rem' }}
          >
            {showAddCard ? 'Cancel' : '+ Add Card'}
          </button>
        </div>

        {showAddCard && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <CardSelector
              onSelectCard={handleCardSelect}
              excludedCardIds={userCards.map(c => c.id)}
            />
          </div>
        )}
      </div>

      {/* Wallet Cards List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2rem',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--primary-200)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ color: 'var(--primary-800)' }}>
            My Cards ({userCards.length})
          </h2>
          {userCards.length > 0 && (
            <button
              onClick={() => handleToggleAll(!allSelected)}
              className="btn-secondary"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: 'var(--primary-600)' }}>Loading...</p>
          </div>
        ) : userCards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💼</div>
            <h3 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
              Your wallet is empty
            </h3>
            <p style={{ color: 'var(--primary-600)' }}>
              Add credit cards to start tracking and getting recommendations
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userCards.map((card) => (
              <div
                key={card.id}
                style={{
                  padding: '1.5rem',
                  background: 'white',
                  border: '2px solid',
                  borderColor: card.isSelected ? 'var(--accent-500)' : 'var(--primary-200)',
                  borderRadius: 'var(--radius-xl)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleToggleSelection(card.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ color: 'var(--primary-800)', margin: 0 }}>
                        {card.name}
                      </h3>
                      {card.isSelected && (
                        <span style={{
                          background: 'var(--accent-500)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          Active
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: 'var(--primary-600)',
                      fontSize: '0.9rem',
                      margin: '0.25rem 0'
                    }}>
                      {card.network} • Annual Fee: {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
                    </p>
                    
                    {card.signup_bonus && (
                      <div style={{
                        background: 'var(--primary-50)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-lg)',
                        marginTop: '0.75rem'
                      }}>
                        <strong style={{ color: 'var(--accent-600)' }}>
                          🎁 Sign-up Bonus:
                        </strong>{' '}
                        {card.signup_bonus.points || card.signup_bonus.miles} {card.signup_bonus.points ? 'points' : 'miles'}
                        {' '}worth ~${card.signup_bonus.value}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCard(card.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-full)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = 'var(--primary-600)';
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
