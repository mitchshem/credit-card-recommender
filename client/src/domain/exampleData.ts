/**
 * Example Data for Credit Card Advisor
 * 
 * This file contains sample cards and merchants for testing and development.
 * In production, this data comes from the comprehensive card database.
 */

import { Card, Merchant } from './models';

/**
 * Example Cards
 * 
 * These represent real cards with realistic reward structures.
 * Used for testing and as examples in the UI.
 */
export const exampleCards: Card[] = [
  {
    id: 'amex_gold',
    issuer: 'American Express',
    network: 'American Express',
    name: 'American Express Gold Card',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        'dining': 4,
        'grocery': 4,
        'travel': 1,
      },
      notes: '4x points on dining and groceries (up to $25,000/year)',
    },
    annualFee: 250,
    isActive: true,
    benefits: [
      {
        description: '$10 monthly dining credit',
        category: 'lifestyle',
        value: '$120/year',
      },
      {
        description: '$10 monthly Uber Cash',
        category: 'lifestyle',
        value: '$120/year',
      },
    ],
  },
  {
    id: 'chase_sapphire_preferred',
    issuer: 'Chase',
    network: 'Visa',
    name: 'Chase Sapphire Preferred',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        'travel': 2,
        'dining': 2,
      },
      notes: '2x points on travel and dining',
    },
    annualFee: 95,
    isActive: true,
    benefits: [
      {
        description: 'Trip cancellation insurance',
        category: 'travel',
      },
      {
        description: 'Primary car rental insurance',
        category: 'travel',
      },
    ],
  },
  {
    id: 'discover_it_cash_back',
    issuer: 'Discover',
    network: 'Discover',
    name: 'Discover it Cash Back',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        'rotating': 5, // Rotating quarterly categories
      },
      notes: '5% cash back on rotating categories (up to $1,500/quarter)',
    },
    annualFee: 0,
    isActive: true,
  },
  {
    id: 'capital_one_venture',
    issuer: 'Capital One',
    network: 'Mastercard',
    name: 'Capital One Venture Rewards',
    rewardsProfile: {
      baseRate: 2,
      categoryMultipliers: {},
      notes: '2x miles on everything',
    },
    annualFee: 95,
    isActive: true,
  },
];

/**
 * Example Merchants
 * 
 * Sample merchants across different categories for testing.
 * In production, this comes from a comprehensive merchant database.
 */
export const exampleMerchants: Merchant[] = [
  {
    id: 'trader_joes',
    name: "Trader Joe's",
    normalizedName: 'trader joes',
    categories: ['grocery'],
  },
  {
    id: 'delta_airlines',
    name: 'Delta Airlines',
    normalizedName: 'delta airlines',
    categories: ['travel', 'airline'],
  },
  {
    id: 'uber',
    name: 'Uber',
    normalizedName: 'uber',
    categories: ['rideshare', 'transportation'],
  },
  {
    id: 'chipotle',
    name: 'Chipotle',
    normalizedName: 'chipotle',
    categories: ['dining', 'fast_food'],
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    normalizedName: 'starbucks',
    categories: ['dining', 'coffee'],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    normalizedName: 'amazon',
    categories: ['online_retail', 'general'],
  },
  {
    id: 'costco',
    name: 'Costco',
    normalizedName: 'costco',
    categories: ['grocery', 'wholesale'],
  },
  {
    id: 'exxon',
    name: 'Exxon',
    normalizedName: 'exxon',
    categories: ['gas', 'fuel'],
  },
];

/**
 * Helper function to find a card by ID
 */
export function getCardById(cards: Card[], cardId: string): Card | undefined {
  return cards.find(card => card.id === cardId);
}

/**
 * Helper function to find a merchant by ID or name
 */
export function findMerchant(
  merchants: Merchant[],
  searchTerm: string
): Merchant | undefined {
  const normalized = searchTerm.toLowerCase().trim();
  return merchants.find(
    merchant =>
      merchant.id === normalized ||
      merchant.name.toLowerCase() === normalized ||
      merchant.normalizedName === normalized
  );
}

/**
 * Helper function to find merchants by category
 */
export function findMerchantsByCategory(
  merchants: Merchant[],
  category: string
): Merchant[] {
  return merchants.filter(merchant => merchant.categories.includes(category));
}

