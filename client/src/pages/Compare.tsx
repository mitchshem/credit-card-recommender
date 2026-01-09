/**
 * Compare Page
 * 
 * Multi-select cards and compare them side-by-side.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../domain/models';
import { initializeWallet, saveWallet } from '../services/localStorage';
import { CATEGORIES, CATEGORY_NAMES, COSTCO_CONSTRAINT } from '../data/myCards';
import { getBestCardForMerchant } from '../domain/recommendationEngine';
import { Merchant } from '../domain/models';

const Compare: React.FC = () => {
  const [wallet, setWallet] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  useEffect(() => {
    const walletCards = initializeWallet();
    setWallet(walletCards);
    // Default: select all active cards
    setSelectedCards(walletCards.filter(c => c.isActive).map(c => c.id));
  }, []);

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const selectedCardsData = wallet.filter(c => selectedCards.includes(c.id));
  const activeCards = wallet.filter(c => c.isActive);

  // Calculate winner by category
  const getWinnerByCategory = (category: string): Card | null => {
    if (selectedCardsData.length === 0) return null;

    const merchant: Merchant = {
      id: category,
      name: CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || category,
      normalizedName: category.toLowerCase(),
      categories: [category]
    };

    // Filter out Amex for Costco/Warehouse
    let filteredCards = selectedCardsData;
    if (category === 'costco' || category === 'warehouse') {
      filteredCards = filteredCards.filter(c => c.network !== 'American Express');
    }

    if (filteredCards.length === 0) return null;

    const result = getBestCardForMerchant({
      wallet: filteredCards,
      merchant
    });

    return filteredCards.find(c => c.id === result.bestCardId) || null;
  };

  const getRateForCategory = (card: Card, category: string): number => {
    return card.rewardsProfile.categoryMultipliers[category] || card.rewardsProfile.baseRate;
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <h1>Compare Cards</h1>
        <p>Select 2+ cards to compare earn rates, perks, and best categories</p>
      </motion.div>

      {/* Card Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '2rem',
          border: '1px solid var(--glass-border)'
        }}
      >
        <h2 style={{
          marginBottom: '1.5rem',
          color: 'var(--primary-800)',
          fontSize: '1.25rem',
          fontWeight: 700
        }}>
          Select Cards to Compare ({selectedCards.length} selected)
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {activeCards.map((card) => {
            const isSelected = selectedCards.includes(card.id);
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardToggle(card.id)}
                style={{
                  padding: '1rem',
                  background: isSelected
                    ? 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)'
                    : 'white',
                  border: `2px solid ${isSelected ? 'var(--accent-500)' : 'var(--primary-200)'}`,
                  borderRadius: 'var(--radius-xl)',
                  color: isSelected ? 'white' : 'var(--primary-800)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                }}
              >
                {card.name}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Comparison Table */}
      {selectedCardsData.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--glass-border)',
            overflowX: 'auto'
          }}
        >
          <h2 style={{
            marginBottom: '1.5rem',
            color: 'var(--primary-800)',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            Side-by-Side Comparison
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--primary-200)' }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 700,
                  color: 'var(--primary-800)'
                }}>
                  Category
                </th>
                {selectedCardsData.map((card) => (
                  <th
                    key={card.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: 'var(--primary-800)',
                      minWidth: '150px'
                    }}
                  >
                    {card.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.filter(cat => cat !== 'other').map((category) => {
                const winner = getWinnerByCategory(category);
                return (
                  <tr
                    key={category}
                    style={{
                      borderBottom: '1px solid var(--primary-100)'
                    }}
                  >
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: 'var(--primary-800)'
                    }}>
                      {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                      {winner && (
                        <span style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--accent-600)',
                          fontWeight: 600,
                          marginTop: '0.25rem'
                        }}>
                          Winner: {winner.name}
                        </span>
                      )}
                    </td>
                    {selectedCardsData.map((card) => {
                      const rate = getRateForCategory(card, category);
                      const isWinner = winner?.id === card.id;
                      const isCostcoIncompatible = (category === 'costco' || category === 'warehouse') && card.network === 'American Express';
                      
                      return (
                        <td
                          key={card.id}
                          style={{
                            padding: '1rem',
                            textAlign: 'center',
                            background: isWinner ? 'var(--accent-50)' : 'transparent',
                            fontWeight: isWinner ? 700 : 500,
                            color: isCostcoIncompatible ? 'var(--primary-400)' : (isWinner ? 'var(--accent-700)' : 'var(--primary-700)')
                          }}
                        >
                          {isCostcoIncompatible ? (
                            <span style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                              Not accepted
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '1.5rem',
                              fontWeight: 700
                            }}>
                              {rate}x
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid var(--primary-200)' }}>
                <td style={{
                  padding: '1rem',
                  fontWeight: 700,
                  color: 'var(--primary-800)'
                }}>
                  Annual Fee
                </td>
                {selectedCardsData.map((card) => (
                  <td
                    key={card.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--primary-700)'
                    }}
                  >
                    {card.annualFee === 0 ? 'No Fee' : `$${card.annualFee}`}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{
                  padding: '1rem',
                  fontWeight: 700,
                  color: 'var(--primary-800)'
                }}>
                  Network
                </td>
                {selectedCardsData.map((card) => (
                  <td
                    key={card.id}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--primary-700)'
                    }}
                  >
                    {card.network}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {selectedCardsData.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            Select at least 2 cards to compare
          </h3>
          <p style={{ color: 'var(--primary-600)' }}>
            Choose cards from above to see a side-by-side comparison.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Compare;
