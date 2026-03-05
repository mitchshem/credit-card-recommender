/**
 * Wallet Page
 * 
 * Shows user's cards with beautiful tiles and detail views.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../domain/models';
import { initializeWallet, saveWallet } from '../services/localStorage';
import { CATEGORY_NAMES } from '../data/myCards';

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const walletCards = initializeWallet();
    setWallet(walletCards);
  }, []);

  const handleToggleActive = (cardId: string) => {
    const updatedWallet = wallet.map(card =>
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    );
    setWallet(updatedWallet);
    saveWallet(updatedWallet);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const getCardColor = (network: string) => {
    switch (network) {
      case 'American Express':
        return 'linear-gradient(135deg, #006FCF 0%, #0054A6 100%)';
      case 'Visa':
        return 'linear-gradient(135deg, #1A1F71 0%, #2E3180 100%)';
      case 'Mastercard':
        return 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)';
      default:
        return 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)';
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <h1>My Wallet</h1>
        <p>Your credit cards and their benefits</p>
      </motion.div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {wallet.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(card)}
            style={{
              background: getCardColor(card.network),
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              color: 'white',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              overflow: 'hidden',
              opacity: card.isActive ? 1 : 0.6
            }}
          >
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: card.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {card.isActive ? 'Active' : 'Inactive'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                {card.network}
              </div>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                lineHeight: 1.2
              }}>
                {card.name}
              </h2>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Annual Fee</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {card.annualFee === 0 ? 'No Fee' : `$${card.annualFee}`}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleActive(card.id);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: card.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {card.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 2000,
                backdropFilter: 'blur(4px)'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                borderRadius: 'var(--radius-2xl)',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 2001,
                boxShadow: 'var(--shadow-2xl)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCard(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--primary-100)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>

              <div style={{
                background: getCardColor(selectedCard.network),
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                color: 'white',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {selectedCard.name}
                </h2>
                <div style={{ opacity: 0.9 }}>{selectedCard.network}</div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  marginBottom: '1rem',
                  color: 'var(--primary-800)',
                  fontSize: '1.25rem',
                  fontWeight: 700
                }}>
                  Earn Structure
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(selectedCard.rewardsProfile.categoryMultipliers).map(([category, rate]) => (
                    <div
                      key={category}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'var(--primary-50)',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    >
                      <span style={{ fontWeight: 500, color: 'var(--primary-800)' }}>
                        {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || category}
                      </span>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--accent-600)'
                      }}>
                        {rate}x
                      </span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <span style={{ fontWeight: 500, color: 'var(--primary-800)' }}>All Other Purchases</span>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--primary-700)'
                    }}>
                      {selectedCard.rewardsProfile.baseRate}x
                    </span>
                  </div>
                </div>
              </div>

              {selectedCard.rewardsProfile.notes && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    marginBottom: '1rem',
                    color: 'var(--primary-800)',
                    fontSize: '1.25rem',
                    fontWeight: 700
                  }}>
                    Key Benefits
                  </h3>
                  <div style={{
                    padding: '1rem',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--primary-700)'
                  }}>
                    {selectedCard.rewardsProfile.notes}
                  </div>
                </div>
              )}

              {selectedCard.benefits && selectedCard.benefits.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    marginBottom: '1rem',
                    color: 'var(--primary-800)',
                    fontSize: '1.25rem',
                    fontWeight: 700
                  }}>
                    Additional Perks
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedCard.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.75rem',
                          background: 'var(--primary-50)',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>✓</span>
                        <span style={{ color: 'var(--primary-700)' }}>{benefit.description}</span>
                        {benefit.value && (
                          <span style={{
                            marginLeft: 'auto',
                            fontWeight: 600,
                            color: 'var(--accent-600)'
                          }}>
                            {benefit.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCard.network === 'American Express' && (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid #ffc107',
                  borderRadius: 'var(--radius-lg)',
                  color: '#f57c00'
                }}>
                  <strong>Note:</strong> This card is not accepted at Costco or other merchants that don't accept American Express.
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
