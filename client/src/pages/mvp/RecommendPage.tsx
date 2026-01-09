/**
 * Recommend Page (MVP)
 * 
 * Main page where users search for a merchant and get card recommendations.
 * Uses the pure recommendation engine to calculate the best card.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Card, Merchant, RecommendationResult } from '../../domain/models';
import { getBestCardForMerchant } from '../../domain/recommendationEngine';
import { getUserWallet } from '../../services/userDataService';
import { merchantsData } from '../../data';
import { cardsData } from '../../data';

const RecommendPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [merchantQuery, setMerchantQuery] = useState('');
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [wallet, setWallet] = useState<Card[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet on mount
  useEffect(() => {
    if (currentUser) {
      loadWallet();
    }
  }, [currentUser]);

  const loadWallet = async () => {
    if (!currentUser) return;

    try {
      const cards = await getUserWallet(currentUser.uid);
      setWallet(cards);
    } catch (error) {
      console.error('Error loading wallet:', error);
      setError('Failed to load wallet');
    }
  };

  // Convert merchantsData to Merchant format
  const allMerchants: Merchant[] = Object.entries(merchantsData).map(([key, category]) => ({
    id: key,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    normalizedName: key.toLowerCase(),
    categories: Array.isArray(category) ? category : [category],
  }));

  // Filter merchants based on search query
  const filteredMerchants = merchantQuery
    ? allMerchants.filter(m =>
        m.name.toLowerCase().includes(merchantQuery.toLowerCase()) ||
        m.normalizedName.includes(merchantQuery.toLowerCase())
      )
    : [];

  const handleMerchantSelect = (selectedMerchant: Merchant) => {
    setMerchant(selectedMerchant);
    setMerchantQuery(selectedMerchant.name);
    setError(null);
  };

  const handleGetRecommendation = () => {
    if (!merchant) {
      setError('Please select a merchant');
      return;
    }

    if (wallet.length === 0) {
      setError('Add cards to your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert wallet cards to domain Card format
      const domainCards: Card[] = wallet.map(card => {
        // Find card in cardsData to get full reward structure
        const fullCard = (cardsData as any[]).find(c => c.id === card.id);
        if (fullCard) {
          return {
            ...card,
            rewardsProfile: {
              baseRate: fullCard.reward_rates.other || 1,
              categoryMultipliers: fullCard.reward_rates || {},
            },
          };
        }
        return card;
      });

      const result = getBestCardForMerchant({
        wallet: domainCards,
        merchant,
      });

      setRecommendation(result);
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBestCard = () => {
    if (!recommendation || !wallet.length) return null;
    return wallet.find(c => c.id === recommendation.bestCardId);
  };

  const bestCard = getBestCard();

  return (
    <ProtectedRoute>
      <div className="page-container">
        <div className="page-header">
          <h1>🔍 Get Recommendation</h1>
          <p>Find the best card to use at any merchant</p>
        </div>

        {/* Wallet Status */}
        {wallet.length === 0 && (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid #ffc107',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              color: '#f57c00'
            }}
          >
            ⚠️ Add cards to your wallet first to get recommendations.
          </div>
        )}

        {/* Search Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem'
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>
            Search for Merchant
          </h2>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              value={merchantQuery}
              onChange={(e) => {
                setMerchantQuery(e.target.value);
                setMerchant(null);
                setRecommendation(null);
              }}
              placeholder="Type merchant name (e.g., Trader Joe's, Uber, Delta)"
              className="form-input"
              style={{ width: '100%', padding: '0.75rem' }}
            />

            {/* Merchant Suggestions */}
            {merchantQuery && filteredMerchants.length > 0 && !merchant && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid var(--primary-200)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '0.25rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {filteredMerchants.slice(0, 10).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleMerchantSelect(m)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--primary-100)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {merchant && (
            <div
              style={{
                padding: '0.75rem',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                color: 'var(--primary-700)'
              }}
            >
              Selected: <strong>{merchant.name}</strong>
            </div>
          )}

          <button
            onClick={handleGetRecommendation}
            disabled={!merchant || loading || wallet.length === 0}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Calculating...' : 'Get Recommendation'}
          </button>

          {error && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Recommendation Result */}
        {recommendation && bestCard && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>
              Recommendation
            </h2>

            {/* Best Card */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                BEST CARD TO USE
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {bestCard.name}
              </h3>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem', opacity: 0.9 }}>
                {recommendation.rankedCards[0]?.rewardRate}x rewards
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.95 }}>
                {recommendation.explanation}
              </div>
            </div>

            {/* Alternative Cards */}
            {recommendation.rankedCards.length > 1 && (
              <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-700)' }}>
                  Other Options
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {recommendation.rankedCards.slice(1, 4).map((ranked) => {
                    const card = wallet.find(c => c.id === ranked.cardId);
                    if (!card) return null;

                    return (
                      <div
                        key={ranked.cardId}
                        style={{
                          padding: '1rem',
                          border: '1px solid var(--primary-200)',
                          borderRadius: 'var(--radius-md)',
                          background: 'white'
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                          {card.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                          {ranked.rewardRate}x • {ranked.reason}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default RecommendPage;

