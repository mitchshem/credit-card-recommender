import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { initializeWallet } from '../services/localStorage';
import { Card } from '../domain/models';
import { MY_CARDS } from '../data/myCards';

const UpgradeGuide: React.FC = () => {
  const [wallet, setWallet] = useState<Card[]>([]);

  useEffect(() => {
    const walletCards = initializeWallet();
    setWallet(walletCards);
  }, []);

  const checklist = [
    {
      id: 'review_active',
      title: 'Review Active Cards',
      description: 'Make sure all cards you use regularly are active in your wallet',
      completed: wallet.filter(c => c.isActive).length > 0,
      action: 'Go to Wallet to manage active cards'
    },
    {
      id: 'set_priorities',
      title: 'Set Your Priorities',
      description: 'Define your primary objectives and constraints in Priorities',
      completed: false,
      action: 'Go to Priorities to configure your preferences'
    },
    {
      id: 'costco_setup',
      title: 'Ensure Costco Card Available',
      description: 'Make sure you have a Visa or Mastercard active for Costco',
      completed: wallet.some(c => 
        c.isActive && 
        (c.network === 'Visa' || c.network === 'Mastercard')
      ),
      action: 'Activate Disney Visa, Chase Debit, or Aviator in Wallet'
    },
    {
      id: 'maximize_dining',
      title: 'Maximize Dining Rewards',
      description: 'Use Amex Gold (4x) for dining when not at Costco',
      completed: false,
      action: 'Use Advisor to see best card for dining'
    },
    {
      id: 'maximize_groceries',
      title: 'Maximize Grocery Rewards',
      description: 'Use Amex Gold (4x) for groceries when not at warehouse stores',
      completed: false,
      action: 'Use Advisor to see best card for groceries'
    },
    {
      id: 'future_linking',
      title: 'Account Linking (Future)',
      description: 'Delta MQD status and Amex Offers integration will be available soon',
      completed: false,
      action: 'Manual entry available for now',
      future: true
    }
  ];

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <h1>Upgrade Guide</h1>
        <p>Actionable checklist to optimize your credit card usage</p>
      </motion.div>

      {/* Checklist */}
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
          fontSize: '1.5rem',
          fontWeight: 700
        }}>
          Optimization Checklist
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {checklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              style={{
                padding: '1.5rem',
                background: item.completed ? 'var(--accent-50)' : 'var(--primary-50)',
                border: `2px solid ${item.completed ? 'var(--accent-300)' : 'var(--primary-200)'}`,
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-full)',
                background: item.completed ? 'var(--accent-500)' : 'var(--primary-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.125rem'
              }}>
                {item.completed && (
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>✓</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  marginBottom: '0.5rem',
                  color: 'var(--primary-800)',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  {item.title}
                  {item.future && (
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      background: 'var(--primary-200)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--primary-700)'
                    }}>
                      Future
                    </span>
                  )}
                </h3>
                <p style={{
                  marginBottom: '0.75rem',
                  color: 'var(--primary-600)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5
                }}>
                  {item.description}
                </p>
                <div style={{
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  color: 'var(--primary-700)',
                  fontStyle: 'italic'
                }}>
                  → {item.action}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Account Linking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
          Account Linking (Future)
        </h2>
        <div style={{
          padding: '1.5rem',
          background: 'var(--primary-50)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            marginBottom: '1rem',
            color: 'var(--primary-700)',
            lineHeight: 1.6
          }}>
            <strong>Not available yet—requires official integration or secure auth.</strong>
          </p>
          <p style={{
            marginBottom: '1rem',
            color: 'var(--primary-600)',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            Delta MQD status and Amex Offers are not accessible via public APIs. This would require:
          </p>
          <ul style={{
            marginLeft: '1.5rem',
            color: 'var(--primary-600)',
            fontSize: '0.95rem',
            lineHeight: 1.8
          }}>
            <li>Official Delta and American Express API integration</li>
            <li>Secure OAuth authentication flow</li>
            <li>Third-party aggregator service</li>
            <li>Manual entry option (available now)</li>
          </ul>
        </div>
        <div style={{
          padding: '1rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--primary-200)'
        }}>
          <strong style={{ color: 'var(--primary-800)', display: 'block', marginBottom: '0.5rem' }}>
            Manual Entry Available:
          </strong>
          <p style={{ color: 'var(--primary-600)', fontSize: '0.95rem' }}>
            For now, you can manually track your Delta MQDs and status in your notes. 
            This feature will be expanded when official integration becomes available.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeGuide;
