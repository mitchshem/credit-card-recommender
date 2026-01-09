/**
 * Local Storage Service
 * 
 * Handles all local persistence for the offline-first single-user app.
 */

import { Card } from '../domain/models';
import { MY_CARDS } from '../data/myCards';

export interface UserPreferences {
  primaryObjective?: 'maximize_points' | 'maximize_delta_miles' | 'maximize_aa_miles' | 'minimize_cost' | 'simplify';
  priorities?: string[];
  constraints?: {
    avoidAnnualFeeBias?: boolean;
    preferSimplicity?: boolean;
    preferLoungeAccess?: boolean;
    preferStatusProgress?: boolean;
  };
}

export interface WalletState {
  cards: Card[];
}

const STORAGE_KEYS = {
  WALLET: 'credit_card_advisor_wallet',
  PREFERENCES: 'credit_card_advisor_preferences'
} as const;

/**
 * Initialize wallet with all cards (default all active)
 */
export function initializeWallet(): Card[] {
  const saved = localStorage.getItem(STORAGE_KEYS.WALLET);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // If parsing fails, return default
    }
  }
  
  // Default: all cards active
  return MY_CARDS.map(card => ({
    ...card,
    isActive: true
  }));
}

/**
 * Save wallet to localStorage
 */
export function saveWallet(wallet: Card[]): void {
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
}

/**
 * Get user preferences
 */
export function getPreferences(): UserPreferences {
  const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // If parsing fails, return default
    }
  }
  return {};
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}
