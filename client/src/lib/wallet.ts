import { WalletCard, Card } from '../types/data';
import { cardsData } from '../data';

const WALLET_STORAGE_KEY = 'walletCards';
const WALLET_VERSION_KEY = 'walletVersion';
const CURRENT_VERSION = 2; // Increment when storage format changes

/**
 * Wallet storage adapter with migration support
 * Stores only card IDs to avoid duplication and corruption
 */

export interface WalletState {
  cardIds: string[]; // Store only IDs
  selectedIds: string[]; // IDs that are selected
  customCards: WalletCard[]; // User-added custom cards
}

/**
 * Migrate old wallet format (full objects) to new format (IDs only)
 */
function migrateOldWallet(): WalletState {
  try {
    const oldData = localStorage.getItem('walletCards');
    if (!oldData) return getDefaultWallet();
    
    const parsed = JSON.parse(oldData);
    
    // Check if it's already the new format (array of IDs)
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      return getDefaultWallet();
    }
    
    // Old format: array of full card objects
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
      const cardIds = parsed
        .filter((card: WalletCard) => !card.isUserAdded)
        .map((card: WalletCard) => card.id);
      
      const selectedIds = parsed
        .filter((card: WalletCard) => card.isSelected)
        .map((card: WalletCard) => card.id);
      
      const customCards = parsed.filter((card: WalletCard) => card.isUserAdded);
      
      const newState: WalletState = {
        cardIds,
        selectedIds,
        customCards
      };
      
      saveWalletState(newState);
      console.log('Migrated wallet from old format to new format');
      return newState;
    }
  } catch (error) {
    console.error('Error migrating wallet:', error);
  }
  
  return getDefaultWallet();
}

/**
 * Get default wallet state (all cards selected)
 */
function getDefaultWallet(): WalletState {
  const cardIds = (cardsData as Card[]).map(card => card.id);
  return {
    cardIds,
    selectedIds: cardIds,
    customCards: []
  };
}

/**
 * Load wallet state from localStorage
 */
export function loadWalletState(): WalletState {
  // Check version
  const storedVersion = localStorage.getItem(WALLET_VERSION_KEY);
  
  // If version exists and matches, load normally
  if (storedVersion && parseInt(storedVersion) === CURRENT_VERSION) {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      try {
        const state = JSON.parse(stored) as WalletState;
        return state;
      } catch (error) {
        console.error('Error parsing wallet state:', error);
      }
    }
  }
  
  // Otherwise, migrate
  return migrateOldWallet();
}

/**
 * Save wallet state to localStorage
 */
export function saveWalletState(state: WalletState): void {
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(WALLET_VERSION_KEY, CURRENT_VERSION.toString());
}

/**
 * Get full wallet cards (including custom cards)
 */
export function getWalletCards(allCards: Card[]): WalletCard[] {
  const state = loadWalletState();
  const cards = new Map(allCards.map(card => [card.id, card]));
  
  // Add standard cards
  const walletCards = state.cardIds
    .map(id => cards.get(id))
    .filter((card): card is Card => card !== undefined)
    .map(card => ({
      ...card,
      isSelected: state.selectedIds.includes(card.id),
      isUserAdded: false
    }));
  
  // Add custom cards
  const customCards = state.customCards.map(card => ({
    ...card,
    isUserAdded: true
  }));
  
  return [...walletCards, ...customCards];
}

/**
 * Get selected cards only
 */
export function getSelectedCards(allCards: Card[]): Card[] {
  const state = loadWalletState();
  const selectedIdSet = new Set(state.selectedIds);
  const cards = new Map(allCards.map(card => [card.id, card]));
  
  return state.cardIds
    .filter(id => selectedIdSet.has(id))
    .map(id => cards.get(id))
    .filter((card): card is Card => card !== undefined);
}

/**
 * Toggle card selection
 */
export function toggleCardSelection(cardId: string): void {
  const state = loadWalletState();
  const index = state.selectedIds.indexOf(cardId);
  
  if (index > -1) {
    state.selectedIds.splice(index, 1);
  } else {
    state.selectedIds.push(cardId);
  }
  
  saveWalletState(state);
}

/**
 * Add card to wallet
 */
export function addCardToWallet(card: WalletCard): void {
  const state = loadWalletState();
  
  if (card.isUserAdded) {
    // Custom card - add to customCards
    if (!state.customCards.find(c => c.id === card.id)) {
      state.customCards.push(card);
    }
  } else {
    // Standard card - add to cardIds if not already present
    if (!state.cardIds.includes(card.id)) {
      state.cardIds.push(card.id);
      state.selectedIds.push(card.id);
    }
  }
  
  saveWalletState(state);
}

/**
 * Remove card from wallet
 */
export function removeCardFromWallet(cardId: string): void {
  const state = loadWalletState();
  
  // Remove from cardIds
  state.cardIds = state.cardIds.filter(id => id !== cardId);
  state.selectedIds = state.selectedIds.filter(id => id !== cardId);
  
  // Remove from customCards
  state.customCards = state.customCards.filter(card => card.id !== cardId);
  
  saveWalletState(state);
}

/**
 * Toggle all cards selection
 */
export function toggleAllCards(selected: boolean): void {
  const state = loadWalletState();
  state.selectedIds = selected ? [...state.cardIds] : [];
  saveWalletState(state);
}

/**
 * Check if card is selected
 */
export function isCardSelected(cardId: string): boolean {
  const state = loadWalletState();
  return state.selectedIds.includes(cardId);
}

/**
 * Check if card is in wallet
 */
export function isCardInWallet(cardId: string): boolean {
  const state = loadWalletState();
  return state.cardIds.includes(cardId) || state.customCards.some(c => c.id === cardId);
}
