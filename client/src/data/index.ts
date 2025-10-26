/**
 * Unified data source - single source of truth for all app data
 * All components should import from here, not from individual files
 */

import cardsDataJson from './cards.json';
import merchantsDataJson from './merchants.json';
import { Card, Merchant } from '../types/data';

// Export data with proper type casting
export const cardsData = cardsDataJson as unknown as Card[];
export const merchantsData = merchantsDataJson as unknown as Merchant;

// Export types for convenience
export type { Card, Merchant } from '../types/data';

// Helper functions
export function getCardById(id: string): Card | undefined {
  return cardsData.find(card => card.id === id);
}

export function getMerchantCategory(merchant: string): string | undefined {
  return merchantsData[merchant];
}

export function getAllMerchants(): string[] {
  return Object.keys(merchantsData);
}

export function getCardsByNetwork(network: string): Card[] {
  return cardsData.filter(card => card.network === network);
}
