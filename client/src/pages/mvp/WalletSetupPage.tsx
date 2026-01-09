/**
 * Wallet Setup Page (MVP)
 * 
 * Allows users to add/remove cards from their wallet.
 * Cards are selected from the database - no manual entry required.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Card } from '../../domain/models';
import { getUserWallet, saveUserWallet } from '../../services/userDataService';
import { cardsData } from '../../data';
import { Card as OldCard } from '../../types/data';
import { oldCardToDomainCard } from '../../utils/cardAdapters';
import CardSelector from '../../components/CardSelector';

const WalletSetupPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load wallet on mount
  useEffect(() => {
    loadWallet();
  }, [currentUser]);

  const loadWallet = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const cards = await getUserWallet(currentUser.uid);
      setWallet(cards);
    } catch (error) {
      console.error('Error loading wallet:', error);
      setMessage({ type: 'error', text: 'Failed to load wallet' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (card: OldCard) => {
    if (!currentUser) return;

    // Convert old card format to domain card format
    const domainCard = oldCardToDomainCard(card, true);

    // Check if card already in wallet
    if (wallet.some(c => c.id === domainCard.id)) {
      setMessage({ type: 'error', text: 'Card already in wallet' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const updatedWallet = [...wallet, domainCard];
      await saveUserWallet(currentUser.uid, updatedWallet);
      setWallet(updatedWallet);
      setMessage({ type: 'success', text: 'Card added to wallet!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding card:', error);
      setMessage({ type: 'error', text: 'Failed to add card' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!currentUser) return;

    try {
      const updatedWallet = wallet.filter(c => c.id !== cardId);
      await saveUserWallet(currentUser.uid, updatedWallet);
      setWallet(updatedWallet);
      setMessage({ type: 'success', text: 'Card removed from wallet' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error removing card:', error);
      setMessage({ type: 'error', text: 'Failed to remove card' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleActive = async (cardId: string) => {
    if (!currentUser) return;

    try {
      const updatedWallet = wallet.map(card =>
        card.id === cardId ? { ...card, isActive: !card.isActive } : card
      );
      await saveUserWallet(currentUser.uid, updatedWallet);
      setWallet(updatedWallet);
    } catch (error) {
      console.error('Error toggling card:', error);
    }
  };

  const excludedCardIds = wallet.map(c => c.id);
  const activeCards = wallet.filter(c => c.isActive);

  return (
    <ProtectedRoute>
      <div className="page-container">
        <div className="page-header">
          <h1>💳 My Wallet</h1>
          <p>Manage your credit cards</p>
        </div>

        {message && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: message.type === 'success' 
                ? 'rgba(76, 175, 80, 0.1)' 
                : 'rgba(244, 67, 54, 0.1)',
              color: message.type === 'success' ? '#4caf50' : '#f44336',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Wallet Stats */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-700)' }}>
              {wallet.length}
            </div>
            <div style={{ color: 'var(--primary-600)' }}>Total Cards</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-700)' }}>
              {activeCards.length}
            </div>
            <div style={{ color: 'var(--primary-600)' }}>Active Cards</div>
          </div>
        </div>

        {/* Add Card Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>
            Add Card to Wallet
          </h2>
          <CardSelector
            onSelectCard={handleAddCard}
            excludedCardIds={excludedCardIds}
          />
        </div>

        {/* Wallet Cards List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>
            My Cards ({wallet.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary-600)' }}>
              Loading wallet...
            </div>
          ) : wallet.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--primary-600)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <p>Your wallet is empty. Add cards above to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {wallet.map((card) => (
                <div
                  key={card.id}
                  style={{
                    padding: '1.5rem',
                    border: `2px solid ${card.isActive ? 'var(--primary-300)' : 'var(--primary-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    background: card.isActive ? 'white' : 'rgba(0, 0, 0, 0.02)',
                    opacity: card.isActive ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-800)' }}>
                        {card.name}
                      </h3>
                      <div style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }}>
                        {card.issuer} • {card.network}
                      </div>
                      {card.annualFee > 0 && (
                        <div style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }}>
                          ${card.annualFee}/year
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleToggleActive(card.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: card.isActive ? 'var(--primary-100)' : 'var(--primary-500)',
                          color: card.isActive ? 'var(--primary-700)' : 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        {card.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'transparent',
                          color: '#f44336',
                          border: '1px solid #f44336',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WalletSetupPage;

