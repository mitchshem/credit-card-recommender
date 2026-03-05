/**
 * Advisor Page
 * 
 * Main page for "what card should I use here?" recommendations.
 * Features quick category buttons and merchant search.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Merchant, RecommendationResult } from '../domain/models';
import { getBestCardForMerchant } from '../domain/recommendationEngine';
import { initializeWallet } from '../services/localStorage';
import { getPreferences } from '../services/localStorage';
import { CATEGORIES, CATEGORY_NAMES } from '../data/myCards';
import { OFFERS, OfferConfig } from '../config/offers';
import { trackOfferClickIntent } from '../services/offerTracking';

const Advisor: React.FC = () => {
  const [wallet, setWallet] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [preferences, setPreferences] = useState(getPreferences());

  useEffect(() => {
    // Initialize wallet from localStorage
    const walletCards = initializeWallet();
    setWallet(walletCards);
    setPreferences(getPreferences());
  }, []);

  // Reload preferences when they change (listen for custom event from Priorities page)
  useEffect(() => {
    const handlePreferencesUpdate = () => {
      const newPrefs = getPreferences();
      setPreferences(newPrefs);
      // If we have a selected category, recalculate recommendation with new preferences
      if (selectedCategory) {
        const merchant: Merchant = {
          id: selectedCategory,
          name: CATEGORY_NAMES[selectedCategory as keyof typeof CATEGORY_NAMES] || selectedCategory,
          normalizedName: selectedCategory.toLowerCase(),
          categories: [selectedCategory]
        };
        const result = getBestCardForMerchantWithConstraints({
          wallet: wallet.filter(c => c.isActive),
          merchant,
          preferences: newPrefs
        });
        setRecommendation(result);
      }
    };
    
    // Listen for custom event from Priorities page
    window.addEventListener('preferencesUpdated', handlePreferencesUpdate);
    
    // Also check on focus (when user returns to tab)
    window.addEventListener('focus', handlePreferencesUpdate);

    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdate);
      window.removeEventListener('focus', handlePreferencesUpdate);
    };
  }, [selectedCategory, wallet]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    // Get current preferences (refresh to ensure we have latest)
    const currentPreferences = getPreferences();
    setPreferences(currentPreferences);
    
    // Create merchant object for this category
    const merchant: Merchant = {
      id: category,
      name: CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || category,
      normalizedName: category.toLowerCase(),
      categories: [category]
    };

    // Get recommendation with current preferences
    const result = getBestCardForMerchantWithConstraints({
      wallet: wallet.filter(c => c.isActive),
      merchant,
      preferences: currentPreferences
    });

    setRecommendation(result);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('recommendation-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  /**
   * Get recommendation with Costco constraint handling and preferences
   */
  const getBestCardForMerchantWithConstraints = (input: { 
    wallet: Card[]; 
    merchant: Merchant;
    preferences?: ReturnType<typeof getPreferences>;
  }): RecommendationResult => {
    let filteredWallet = input.wallet;

    // Apply Costco constraint: exclude Amex if category is Costco/Warehouse
    if (input.merchant.categories.includes('costco') || input.merchant.categories.includes('warehouse')) {
      filteredWallet = filteredWallet.filter(card => 
        card.network !== 'American Express'
      );
    }

    if (filteredWallet.length === 0) {
      return {
        bestCardId: '',
        rankedCards: [],
        explanation: 'No compatible cards for this category. Costco only accepts Visa/Mastercard.'
      };
    }

    return getBestCardForMerchant({
      wallet: filteredWallet,
      merchant: input.merchant,
      preferences: input.preferences
    });
  };

  const bestCard = recommendation && wallet.find(c => c.id === recommendation.bestCardId);
  const activeCards = wallet.filter(c => c.isActive);

  const handleOfferClick = (offer: OfferConfig) => {
    trackOfferClickIntent(offer);
    if (!offer.isActive) {
      return;
    }
    window.open(offer.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="page-header"
      >
        <h1>What card should I use here?</h1>
        <p>Select a category to instantly see which card earns the most</p>
        {preferences?.primaryObjective && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: 'var(--accent-50)',
              border: '1px solid var(--accent-200)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.9rem',
              color: 'var(--accent-700)',
              display: 'inline-block'
            }}
          >
            <strong>Active:</strong> {preferences.primaryObjective.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {preferences.constraints && Object.values(preferences.constraints).some(v => v) && ' • Custom constraints'}
          </motion.div>
        )}
      </motion.div>

      {/* Category Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
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
          fontWeight: 600
        }}>
          Quick Categories
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem'
        }}>
          {CATEGORIES.filter(cat => cat !== 'other').map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              style={{
                padding: '1.25rem 1rem',
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: `2px solid ${selectedCategory === category ? 'var(--accent-500)' : 'var(--primary-200)'}`,
                borderRadius: 'var(--radius-xl)',
                color: selectedCategory === category ? 'white' : 'var(--primary-800)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedCategory === category 
                  ? 'var(--shadow-lg)' 
                  : 'var(--shadow-sm)'
              }}
            >
              {CATEGORY_NAMES[category]}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick('other')}
            className={`category-btn ${selectedCategory === 'other' ? 'active' : ''}`}
            style={{
              padding: '1.25rem 1rem',
              background: selectedCategory === 'other' 
                ? 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `2px solid ${selectedCategory === 'other' ? 'var(--accent-500)' : 'var(--primary-200)'}`,
              borderRadius: 'var(--radius-xl)',
              color: selectedCategory === 'other' ? 'white' : 'var(--primary-800)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: selectedCategory === 'other' 
                ? 'var(--shadow-lg)' 
                : 'var(--shadow-sm)'
            }}
          >
            Other / Unknown
          </motion.button>
        </div>
      </motion.div>

      {/* Recommendation Results */}
      <AnimatePresence>
        {recommendation && bestCard && (
          <motion.div
            id="recommendation-results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              marginBottom: '2rem'
            }}
          >
            {/* Best Card Highlight */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-2xl)',
                color: 'white',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  opacity: 0.9, 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600
                }}>
                  Recommended Card
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  marginBottom: '1rem',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}>
                  {bestCard.name}
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  {recommendation.rankedCards[0] && (
                    <div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                        Reward Rate
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {recommendation.rankedCards[0].rewardRate}x
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                      Network
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {bestCard.network}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  {recommendation.explanation}
                </div>
              </div>
            </motion.div>

            {/* Why This Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: 'var(--radius-2xl)',
                marginBottom: '2rem',
                border: '1px solid var(--glass-border)'
              }}
            >
              <h3 style={{ 
                marginBottom: '1.5rem',
                color: 'var(--primary-800)',
                fontSize: '1.5rem',
                fontWeight: 700
              }}>
                Why this card?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendation.rankedCards[0] && (
                  <div style={{
                    padding: '1rem',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: '4px solid var(--accent-500)'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-800)' }}>
                      Top Earn Rate
                    </div>
                    <div style={{ color: 'var(--primary-600)' }}>
                      Earns {recommendation.rankedCards[0].rewardRate}x points on {selectedCategory ? CATEGORY_NAMES[selectedCategory as keyof typeof CATEGORY_NAMES] : 'this category'}
                    </div>
                  </div>
                )}
                {bestCard.rewardsProfile.notes && (
                  <div style={{
                    padding: '1rem',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: '4px solid var(--accent-500)'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-800)' }}>
                      Additional Benefits
                    </div>
                    <div style={{ color: 'var(--primary-600)' }}>
                      {bestCard.rewardsProfile.notes}
                    </div>
                  </div>
                )}
                {((selectedCategory === 'costco' || selectedCategory === 'warehouse') && bestCard.network === 'Visa') && (
                  <div style={{
                    padding: '1rem',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: '4px solid var(--accent-500)'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-800)' }}>
                      Costco Compatible
                    </div>
                    <div style={{ color: 'var(--primary-600)' }}>
                      Costco only accepts Visa and Mastercard. This Visa card is accepted.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Runner-ups */}
            {recommendation.rankedCards.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  padding: '2rem',
                  borderRadius: 'var(--radius-2xl)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <h3 style={{ 
                  marginBottom: '1.5rem',
                  color: 'var(--primary-800)',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  Runner-ups
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendation.rankedCards.slice(1, 4).map((ranked) => {
                    const card = wallet.find(c => c.id === ranked.cardId);
                    if (!card) return null;

                    return (
                      <motion.div
                        key={ranked.cardId}
                        whileHover={{ x: 4 }}
                        style={{
                          padding: '1.25rem',
                          background: 'white',
                          borderRadius: 'var(--radius-xl)',
                          border: '1px solid var(--primary-200)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--primary-800)' }}>
                            {card.name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                            {ranked.reason}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: 'var(--primary-700)'
                        }}>
                          {ranked.rewardRate}x
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '2rem',
          border: '1px solid var(--glass-border)'
        }}
      >
        <h3 style={{
          marginBottom: '1rem',
          color: 'var(--primary-800)',
          fontSize: '1.4rem',
          fontWeight: 700
        }}>
          Offers (Coming Soon)
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              style={{
                padding: '1rem',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--primary-200)',
                opacity: offer.isActive ? 1 : 0.9
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--primary-800)', marginBottom: '0.4rem' }}>
                {offer.title}
              </div>
              <div style={{ color: 'var(--primary-600)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {offer.description}
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-700)'
                }}>
                  {offer.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOfferClick(offer)}
                aria-disabled={!offer.isActive}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: offer.isActive ? 'var(--accent-500)' : 'var(--primary-300)',
                  background: offer.isActive ? 'var(--accent-500)' : 'var(--primary-100)',
                  color: offer.isActive ? 'white' : 'var(--primary-600)',
                  fontWeight: 600,
                  cursor: offer.isActive ? 'pointer' : 'not-allowed'
                }}
                title={offer.isActive ? offer.ctaLabel : 'Coming Soon'}
              >
                {offer.isActive ? offer.ctaLabel : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>
        <p style={{
          margin: 0,
          color: 'var(--primary-600)',
          fontSize: '0.875rem',
          fontStyle: 'italic'
        }}>
          Disclaimer: No affiliate links or sponsored offers are active yet.
        </p>
      </motion.div>

      {/* Empty State */}
      {activeCards.length === 0 && (
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
            No active cards in wallet
          </h3>
          <p style={{ color: 'var(--primary-600)' }}>
            Go to Wallet to activate your cards first.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Advisor;
