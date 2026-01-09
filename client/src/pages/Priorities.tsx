/**
 * Priorities Page
 * 
 * Revamped page for setting user priorities and preferences.
 * Replaces basic sliders with a more sophisticated system.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeWallet } from '../services/localStorage';
import { savePreferences, getPreferences, UserPreferences } from '../services/localStorage';
import { Card } from '../domain/models';
import { CATEGORIES, CATEGORY_NAMES } from '../data/myCards';

const Priorities: React.FC = () => {
  const [wallet, setWallet] = useState<Card[]>([]);
  const [primaryObjective, setPrimaryObjective] = useState<UserPreferences['primaryObjective']>('maximize_points');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<UserPreferences['constraints']>({
    avoidAnnualFeeBias: false,
    preferSimplicity: false,
    preferLoungeAccess: false,
    preferStatusProgress: false
  });
  const [previewData, setPreviewData] = useState<Record<string, string>>({});

  useEffect(() => {
    const walletCards = initializeWallet();
    setWallet(walletCards);
    
    const savedPrefs = getPreferences();
    if (savedPrefs.primaryObjective) {
      setPrimaryObjective(savedPrefs.primaryObjective);
    }
    if (savedPrefs.priorities) {
      setPriorities(savedPrefs.priorities);
    }
    if (savedPrefs.constraints) {
      setConstraints(savedPrefs.constraints);
    }
  }, []);

  useEffect(() => {
    // Save preferences whenever they change
    savePreferences({
      primaryObjective,
      priorities,
      constraints
    });
    
    // Update preview
    updatePreview();
  }, [primaryObjective, priorities, constraints, wallet]);

  const updatePreview = () => {
    // Generate preview of default card for each category
    const activeCards = wallet.filter(c => c.isActive);
    const preview: Record<string, string> = {};

    CATEGORIES.forEach(category => {
      if (category === 'other') return;

      // Filter cards based on constraints
      let filteredCards = [...activeCards];
      
      // Costco constraint: exclude Amex
      if (category === 'costco' || category === 'warehouse') {
        filteredCards = filteredCards.filter(c => c.network !== 'American Express');
      }

      // Find best card for this category
      let bestCard: Card | null = null;
      let bestRate = 0;

      filteredCards.forEach(card => {
        const rate = card.rewardsProfile.categoryMultipliers[category] || card.rewardsProfile.baseRate;
        
        // Apply constraints
        if (constraints?.avoidAnnualFeeBias && card.annualFee > 0 && rate === bestRate) {
          return; // Skip if same rate but has annual fee
        }
        
        if (rate > bestRate) {
          bestRate = rate;
          bestCard = card;
        }
      });

      if (bestCard) {
        preview[category] = bestCard.name;
      }
    });

    setPreviewData(preview);
  };

  const objectiveOptions: Array<{ value: UserPreferences['primaryObjective']; label: string; description: string }> = [
    { value: 'maximize_points', label: 'Maximize Points', description: 'Get the most points/benefits possible' },
    { value: 'maximize_delta_miles', label: 'Maximize Delta Miles', description: 'Focus on earning Delta SkyMiles' },
    { value: 'maximize_aa_miles', label: 'Maximize AA Miles', description: 'Focus on earning AAdvantage miles' },
    { value: 'minimize_cost', label: 'Minimize Cost', description: 'Avoid annual fees, keep it simple' },
    { value: 'simplify', label: 'Simplify', description: 'Use fewer cards, minimize decision fatigue' }
  ];

  const priorityOptions = [
    { id: 'lounge_access', label: 'Lounge Access', icon: '✈️' },
    { id: 'status_progress', label: 'Airline Status Progress', icon: '⭐' },
    { id: 'dining_credits', label: 'Dining Credits', icon: '🍽️' },
    { id: 'travel_insurance', label: 'Travel Insurance', icon: '🛡️' },
    { id: 'simplicity', label: 'Simplicity', icon: '🎯' }
  ];

  const handlePriorityToggle = (priorityId: string) => {
    setPriorities(prev => 
      prev.includes(priorityId)
        ? prev.filter(p => p !== priorityId)
        : [...prev, priorityId]
    );
  };

  const handleConstraintToggle = (key: keyof NonNullable<UserPreferences['constraints']>) => {
    setConstraints(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="page-header"
      >
        <h1>Your Priorities</h1>
        <p>Set your preferences to get personalized recommendations</p>
      </motion.div>

      {/* Primary Objective */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
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
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          Primary Objective
        </h2>
        <p style={{ 
          marginBottom: '1.5rem',
          color: 'var(--primary-600)',
          fontSize: '0.95rem'
        }}>
          What's your main goal with credit cards?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {objectiveOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPrimaryObjective(option.value)}
              style={{
                padding: '1.25rem 1.5rem',
                background: primaryObjective === option.value
                  ? 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)'
                  : 'white',
                border: `2px solid ${primaryObjective === option.value ? 'var(--accent-500)' : 'var(--primary-200)'}`,
                borderRadius: 'var(--radius-xl)',
                color: primaryObjective === option.value ? 'white' : 'var(--primary-800)',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: primaryObjective === option.value ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                {option.label}
              </div>
              <div style={{ 
                fontSize: '0.875rem',
                opacity: primaryObjective === option.value ? 0.9 : 0.7,
                fontWeight: 400
              }}>
                {option.description}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Priority Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
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
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          Additional Priorities
        </h2>
        <p style={{ 
          marginBottom: '1.5rem',
          color: 'var(--primary-600)',
          fontSize: '0.95rem'
        }}>
          Select additional features you value (optional)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {priorityOptions.map((option) => {
            const isSelected = priorities.includes(option.id);
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePriorityToggle(option.id)}
                style={{
                  padding: '0.875rem 1.25rem',
                  background: isSelected
                    ? 'var(--accent-100)'
                    : 'white',
                  border: `2px solid ${isSelected ? 'var(--accent-500)' : 'var(--primary-200)'}`,
                  borderRadius: 'var(--radius-full)',
                  color: isSelected ? 'var(--accent-700)' : 'var(--primary-700)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Constraints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
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
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          Constraints & Preferences
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'avoidAnnualFeeBias', label: 'Avoid Annual Fee Bias', description: 'Prefer no-fee cards when rates are equal' },
            { key: 'preferSimplicity', label: 'Prefer Simplicity', description: 'Favor fewer cards and simpler rewards' },
            { key: 'preferLoungeAccess', label: 'Prefer Lounge Access', description: 'Prioritize cards with lounge benefits' },
            { key: 'preferStatusProgress', label: 'Prefer Status Progress', description: 'Favor cards that help with airline status' }
          ].map((item) => (
            <label
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <input
                type="checkbox"
                checked={constraints?.[item.key as keyof NonNullable<UserPreferences['constraints']>] || false}
                onChange={() => handleConstraintToggle(item.key as keyof NonNullable<UserPreferences['constraints']>)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-800)', marginBottom: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                  {item.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Live Preview */}
      {Object.keys(previewData).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <h2 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--primary-800)',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            Live Preview: Default Cards by Category
          </h2>
          <p style={{ 
            marginBottom: '1.5rem',
            color: 'var(--primary-600)',
            fontSize: '0.95rem'
          }}>
            Based on your priorities, here's your default card for each category:
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(previewData).map(([category, cardName]) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  padding: '1rem',
                  background: 'var(--primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--primary-200)'
                }}
              >
                <div style={{ 
                  fontSize: '0.75rem',
                  color: 'var(--primary-600)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600
                }}>
                  {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                </div>
                <div style={{ 
                  fontWeight: 600,
                  color: 'var(--primary-800)',
                  fontSize: '0.95rem'
                }}>
                  {cardName}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Priorities;
