import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserWallet } from '../lib/userWallet';
import { 
  getPersonalizedRecommendations
} from '../lib/personalizedRecommendations';
import { cardsData } from '../data';
import { merchantsData } from '../data';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [merchantName, setMerchantName] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [bestCard, setBestCard] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFindBestCard = async () => {
    if (!merchantName.trim() || !currentUser) {
      setRecommendations([]);
      setBestCard(null);
      setShowResults(false);
      return;
    }

    const merchantCategory = merchantsData[merchantName.trim()];
    if (!merchantCategory) {
      alert('Merchant not found');
      return;
    }

    try {
      const userWallet = await getUserWallet(currentUser.uid);
      if (!userWallet) {
        alert('Please add cards to your wallet first');
        return;
      }

      const recs = getPersonalizedRecommendations(
        merchantCategory,
        userWallet,
        cardsData as any
      );

      setRecommendations(recs);
      setBestCard(recs.length > 0 ? recs[0] : null);
      setShowResults(true);
    } catch (error) {
      console.error('Error finding best card:', error);
      alert('Failed to get recommendations');
    }
  };

  const merchantOptions = Object.keys(merchantsData).map(key => ({
    value: key,
    label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Welcome to Your Personal Finance Dashboard</h1>
          <p>Sign in to access personalized recommendations and manage your credit cards</p>
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
            Please sign in to access personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to Your Personal Finance Dashboard</h1>
        <p>Manage your credit cards, track rewards, and optimize your spending</p>
      </div>

      {/* Quick Search */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2rem',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: '2rem',
        border: '1px solid var(--primary-200)'
      }}>
        <h2 style={{ color: 'var(--primary-800)', marginBottom: '1rem' }}>
          Find Best Card for Merchant
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid var(--primary-200)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1rem'
            }}
          >
            <option value="">Select a merchant...</option>
            {merchantOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleFindBestCard}
            className="btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            Find Best Card
          </button>
        </div>

        {showResults && (
          <>
            {bestCard ? (
              <div style={{
                background: 'var(--accent-50)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '2px solid var(--accent-200)',
                marginTop: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem' }}>🎯</div>
                  <div>
                    <h3 style={{ color: 'var(--primary-800)', margin: 0 }}>
                      {bestCard.card.name}
                    </h3>
                    <p style={{ color: 'var(--primary-600)', margin: '0.25rem 0' }}>
                      {bestCard.reason}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>Reward Rate</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-600)' }}>
                      {bestCard.card.reward_rates[bestCard.category]}x
                    </div>
                  </div>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>Confidence</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-600)' }}>
                      {Math.round(bestCard.confidence * 100)}%
                    </div>
                  </div>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>Annual Value</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-600)' }}>
                      ${bestCard.potentialValue.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--primary-50)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                marginTop: '1.5rem'
              }}>
                <p style={{ color: 'var(--primary-600)', margin: 0 }}>
                  No cards found for this merchant. Add cards to your wallet to get recommendations.
                </p>
              </div>
            )}

            {recommendations.length > 1 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary-800)', marginBottom: '1rem' }}>Other options:</h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {recommendations.slice(1, 4).map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--primary-200)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--primary-800)' }}>{rec.card.name}</strong>
                        <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                          {rec.card.reward_rates[rec.category]}x points
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                          ${rec.potentialValue.toFixed(0)}/yr
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>💳 Your Wallet</h3>
          <p>Manage your credit card collection</p>
        </div>

        <div className="dashboard-card">
          <h3>🎯 Smart Recommendations</h3>
          <p>Get personalized card suggestions</p>
        </div>

        <div className="dashboard-card">
          <h3>📊 Rewards Analytics</h3>
          <p>Track your earning potential</p>
        </div>

        <div className="dashboard-card">
          <h3>🔄 Rotating Categories</h3>
          <p>Maximize your quarterly earnings</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
