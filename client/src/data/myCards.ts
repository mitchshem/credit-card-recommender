/**
 * Local Data Model for Single-User Offline-First Credit Card Advisor
 * 
 * This file contains the user's card data and preferences.
 * All data is stored locally using localStorage.
 */

import { Card } from '../domain/models';

/**
 * Supported Cards (Only these 6 cards)
 */
export const MY_CARDS: Omit<Card, 'isActive'>[] = [
  {
    id: 'amex_gold',
    issuer: 'American Express',
    network: 'American Express',
    name: 'American Express Gold Card',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        dining: 4,
        groceries: 4,
        flights: 3,
        other: 1
      },
      notes: 'Up to $120 dining credit annually'
    },
    annualFee: 250,
    benefits: [
      {
        description: 'Up to $120 annual dining credit',
        category: 'lifestyle',
        value: '$120'
      },
      {
        description: 'No foreign transaction fees',
        category: 'travel',
      }
    ]
  },
  {
    id: 'amex_platinum',
    issuer: 'American Express',
    network: 'American Express',
    name: 'The Platinum Card from American Express',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        flights: 5,
        hotels: 5,
        dining: 1,
        other: 1
      },
      notes: 'Up to $200 airline fee credit, $200 Uber credit, $240 digital entertainment credit'
    },
    annualFee: 695,
    benefits: [
      {
        description: 'Centurion Lounge access',
        category: 'travel',
      },
      {
        description: 'Up to $200 airline fee credit',
        category: 'travel',
        value: '$200'
      },
      {
        description: 'Up to $200 Uber credit',
        category: 'lifestyle',
        value: '$200'
      },
      {
        description: 'Up to $240 digital entertainment credit',
        category: 'lifestyle',
        value: '$240'
      }
    ]
  },
  {
    id: 'delta_skymiles_gold',
    issuer: 'American Express',
    network: 'American Express',
    name: 'Delta SkyMiles Gold American Express Card',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        flights: 2,
        dining: 2,
        groceries: 2,
        hotels: 2,
        other: 1
      },
      notes: 'Earn Delta SkyMiles. MQD waiver at $25k spend'
    },
    annualFee: 99,
    benefits: [
      {
        description: 'Earn Delta SkyMiles',
        category: 'travel',
      },
      {
        description: 'MQD waiver at $25k annual spend',
        category: 'status',
        value: '$25k'
      },
      {
        description: 'First checked bag free on Delta flights',
        category: 'travel',
      }
    ]
  },
  {
    id: 'disney_visa',
    issuer: 'Chase',
    network: 'Visa',
    name: 'Disney Premier Visa Card',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        groceries: 2,
        gas: 2,
        restaurants: 2,
        disney: 2,
        other: 1
      },
      notes: 'Earn Disney Rewards Dollars'
    },
    annualFee: 49,
    benefits: [
      {
        description: 'Earn Disney Rewards Dollars',
        category: 'lifestyle',
      },
      {
        description: '10% off select Disney merchandise and dining',
        category: 'lifestyle',
      }
    ]
  },
  {
    id: 'chase_debit',
    issuer: 'Chase',
    network: 'Visa',
    name: 'Chase Debit Card',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        other: 1
      },
      notes: 'No rewards, but accepted everywhere Visa is accepted (including Costco)'
    },
    annualFee: 0,
    benefits: [
      {
        description: 'Accepted at Costco and all Visa merchants',
        category: 'acceptance',
      }
    ]
  },
  {
    id: 'barclays_aviator',
    issuer: 'Barclays',
    network: 'Visa',
    name: 'Barclays AAdvantage Aviator Red World Elite Mastercard',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        flights: 2,
        american_airlines: 2,
        other: 1
      },
      notes: 'Earn AAdvantage miles. Known for black/red card design'
    },
    annualFee: 99,
    benefits: [
      {
        description: 'Earn AAdvantage miles',
        category: 'travel',
      },
      {
        description: 'First checked bag free on American Airlines flights',
        category: 'travel',
      }
    ]
  }
];

/**
 * Merchant Categories
 */
export const CATEGORIES = [
  'gas',
  'dining',
  'groceries',
  'flights',
  'hotels',
  'transit',
  'streaming',
  'drugstore',
  'costco',
  'warehouse',
  'other'
] as const;

export type Category = typeof CATEGORIES[number];

/**
 * Category Display Names
 */
export const CATEGORY_NAMES: Record<Category, string> = {
  gas: 'Gas',
  dining: 'Dining',
  groceries: 'Groceries',
  flights: 'Flights',
  hotels: 'Hotels',
  transit: 'Transit',
  streaming: 'Streaming',
  drugstore: 'Drugstore',
  costco: 'Costco',
  warehouse: 'Warehouse',
  other: 'Other'
};

/**
 * Costco Constraint: Costco doesn't accept Amex
 * This is used in the recommendation engine
 */
export const COSTCO_CONSTRAINT = {
  category: 'costco',
  excludedNetworks: ['American Express']
};
