import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AddCustomCardModal.css';

interface AddCustomCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (cardData: CustomCardData) => void;
}

export interface CustomCardData {
  name: string;
  network: string;
  issuer: string;
  annual_fee: number;
  reward_rates: { [category: string]: number };
  perks: string[];
}

const AddCustomCardModal: React.FC<AddCustomCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
  const [formData, setFormData] = useState<CustomCardData>({
    name: '',
    network: 'Visa',
    issuer: '',
    annual_fee: 0,
    reward_rates: {
      dining: 0,
      groceries: 0,
      travel: 0,
      gas: 0,
      other: 0
    },
    perks: []
  });
  const [newPerk, setNewPerk] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a card name');
      return;
    }

    if (!formData.issuer.trim()) {
      setError('Please enter an issuer');
      return;
    }

    onAddCard(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      network: 'Visa',
      issuer: '',
      annual_fee: 0,
      reward_rates: {
        dining: 0,
        groceries: 0,
        travel: 0,
        gas: 0,
        other: 0
      },
      perks: []
    });
    setNewPerk('');
    setError('');
    onClose();
  };

  const addPerk = () => {
    if (newPerk.trim()) {
      setFormData({
        ...formData,
        perks: [...formData.perks, newPerk.trim()]
      });
      setNewPerk('');
    }
  };

  const removePerk = (index: number) => {
    setFormData({
      ...formData,
      perks: formData.perks.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Add Custom Card</h2>
            <button className="modal-close" onClick={handleClose}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Card Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., My Custom Rewards Card"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issuer *</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., Chase, Amex"
                  required
                />
              </div>

              <div className="form-group">
                <label>Network</label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Annual Fee ($)</label>
              <input
                type="number"
                value={formData.annual_fee}
                onChange={(e) => setFormData({ ...formData, annual_fee: parseFloat(e.target.value) || 0 })}
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label>Reward Rates (multiplier per category)</label>
              <div className="reward-rates-grid">
                <div>
                  <label>Dining</label>
                  <input
                    type="number"
                    value={formData.reward_rates.dining}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward_rates: { ...formData.reward_rates, dining: parseFloat(e.target.value) || 0 }
                    })}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label>Groceries</label>
                  <input
                    type="number"
                    value={formData.reward_rates.groceries}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward_rates: { ...formData.reward_rates, groceries: parseFloat(e.target.value) || 0 }
                    })}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label>Travel</label>
                  <input
                    type="number"
                    value={formData.reward_rates.travel}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward_rates: { ...formData.reward_rates, travel: parseFloat(e.target.value) || 0 }
                    })}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label>Gas</label>
                  <input
                    type="number"
                    value={formData.reward_rates.gas}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward_rates: { ...formData.reward_rates, gas: parseFloat(e.target.value) || 0 }
                    })}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label>Other</label>
                  <input
                    type="number"
                    value={formData.reward_rates.other}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward_rates: { ...formData.reward_rates, other: parseFloat(e.target.value) || 0 }
                    })}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Perks & Benefits</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={newPerk}
                  onChange={(e) => setNewPerk(e.target.value)}
                  placeholder="Add a perk or benefit"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPerk();
                    }
                  }}
                />
                <button type="button" onClick={addPerk} className="btn-secondary">Add</button>
              </div>
              {formData.perks.length > 0 && (
                <div className="perks-list">
                  {formData.perks.map((perk, index) => (
                    <div key={index} className="perk-item">
                      <span>{perk}</span>
                      <button type="button" onClick={() => removePerk(index)} className="perk-remove">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="modal-actions">
              <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Card</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddCustomCardModal;

