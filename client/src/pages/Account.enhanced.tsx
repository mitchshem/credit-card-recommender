/**
 * Enhanced Account Page
 * 
 * This page demonstrates how to:
 * 1. Read user profile data from Firestore
 * 2. Update user preferences
 * 3. Display user information
 * 4. Handle loading and error states
 * 
 * Key Concepts Demonstrated:
 * - Protected route pattern (using ProtectedRoute component)
 * - Reading from Firestore using useAuth hook
 * - Updating Firestore documents
 * - Form handling with React state
 * - Error handling and user feedback
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { cardsData } from '../data';
import './Account.css';

// Local interface matching AuthContext's UserProfile preferences structure
interface UserPreferences {
  defaultCards?: string[];
  favoriteCategories?: string[];
  preferredPrimaryCard?: string;
}

const AccountEnhanced: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  
  // Form state - stores current form values before saving
  const [formData, setFormData] = useState<UserPreferences>({
    preferredPrimaryCard: '',
    favoriteCategories: [],
    defaultCards: [],
  });
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newCategory, setNewCategory] = useState('');

  /**
   * Load user profile data into form when component mounts or profile changes
   * This syncs the form with data from Firestore
   */
  useEffect(() => {
    if (userProfile?.preferences) {
      setFormData({
        preferredPrimaryCard: '',
        favoriteCategories: userProfile.preferences.favoriteCategories || [],
        defaultCards: userProfile.preferences.defaultCards || [],
      });
    }
  }, [userProfile]);

  /**
   * Handle saving preferences to Firestore
   * 
   * This function:
   * 1. Shows loading state
   * 2. Calls updateUserProfile to save to Firestore
   * 3. Shows success/error message
   * 4. Clears message after 3 seconds
   */
  const handleSavePreferences = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Update user profile with new preferences
      await updateUserProfile({
        preferences: formData,
      });

      setSaveMessage({
        type: 'success',
        text: 'Preferences saved successfully!'
      });

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save preferences. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Add a favorite category
   */
  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.favoriteCategories?.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        favoriteCategories: [...(formData.favoriteCategories || []), newCategory.trim()],
      });
      setNewCategory('');
    }
  };

  /**
   * Remove a favorite category
   */
  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      favoriteCategories: formData.favoriteCategories?.filter(cat => cat !== category) || [],
    });
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date | any) => {
    if (!date) return 'Never';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get all available card names for the dropdown
  const cardOptions = cardsData.map(card => ({
    id: card.id,
    name: card.name,
  }));

  // This component is wrapped in ProtectedRoute in App.tsx
  // But we can also add an explicit check here as a safety measure
  if (!currentUser || !userProfile) {
    return (
      <ProtectedRoute>
        <div>Loading account data...</div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 My Account</h1>
        <p>Manage your profile and preferences</p>
      </div>

      {/* Success/Error Messages */}
      {saveMessage && (
        <div
          className={`message ${saveMessage.type}`}
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: saveMessage.type === 'success' 
              ? 'rgba(76, 175, 80, 0.1)' 
              : 'rgba(244, 67, 54, 0.1)',
            color: saveMessage.type === 'success'
              ? '#4caf50'
              : '#f44336',
            border: `1px solid ${saveMessage.type === 'success' ? '#4caf50' : '#f44336'}`,
          }}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Profile Information Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>Profile Information</h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--primary-700)',
              fontWeight: 500 
            }}>
              Email
            </label>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(0, 0, 0, 0.05)', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-600)'
            }}>
              {userProfile.email}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--primary-700)',
              fontWeight: 500 
            }}>
              Display Name
            </label>
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(0, 0, 0, 0.05)', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-600)'
            }}>
              {userProfile.displayName}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'var(--primary-700)',
                fontWeight: 500 
              }}>
                Member Since
              </label>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(0, 0, 0, 0.05)', 
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary-600)'
              }}>
                {formatDate(userProfile.createdAt)}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'var(--primary-700)',
                fontWeight: 500 
              }}>
                Last Login
              </label>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(0, 0, 0, 0.05)', 
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary-600)'
              }}>
                {formatDate(userProfile.lastLogin)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-800)' }}>Preferences</h2>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Preferred Primary Card */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--primary-700)',
              fontWeight: 500 
            }}>
              Preferred Primary Card
            </label>
            <select
              value={formData.preferredPrimaryCard || ''}
              onChange={(e) => setFormData({ ...formData, preferredPrimaryCard: e.target.value })}
              className="form-select"
              style={{ width: '100%' }}
            >
              <option value="">Select a card...</option>
              {cardOptions.map(card => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--primary-500)', 
              marginTop: '0.5rem' 
            }}>
              This card will be used as the default for recommendations.
            </p>
          </div>

          {/* Favorite Categories */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--primary-700)',
              fontWeight: 500 
            }}>
              Favorite Categories
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="Add a category (e.g., dining, travel)"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleAddCategory}
                className="btn-secondary"
                type="button"
              >
                Add
              </button>
            </div>
            {formData.favoriteCategories && formData.favoriteCategories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {formData.favoriteCategories.map(category => (
                  <span
                    key={category}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {category}
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-600)',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1.2rem',
                        lineHeight: 1,
                      }}
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Save Button */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="btn-primary"
            style={{ minWidth: '120px' }}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountEnhanced;

