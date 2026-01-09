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
        dining: 4, // Up to $50k/year, then 1x
        groceries: 4, // U.S. supermarkets up to $25k/year, then 1x
        flights: 3, // Booked directly with airlines or amextravel.com
        other: 1
      },
      notes: '$120 annual dining credit ($10/month at Grubhub, Seamless, The Cheesecake Factory, Goldbelly, Wine.com, Milk Bar, and select Shake Shack locations)'
    },
    annualFee: 250,
    benefits: [
      {
        description: '$120 annual dining credit ($10/month)',
        category: 'lifestyle',
        value: '$120/year'
      },
      {
        description: '$10 monthly Uber Cash credit',
        category: 'lifestyle',
        value: '$120/year'
      },
      {
        description: '4x Membership Rewards points at restaurants worldwide',
        category: 'rewards',
      },
      {
        description: '4x points at U.S. supermarkets (up to $25k/year)',
        category: 'rewards',
      },
      {
        description: '3x points on flights booked directly with airlines',
        category: 'travel',
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
        flights: 5, // Booked directly with airlines or via Amex Travel (up to $500k/year)
        hotels: 5, // Prepaid hotels booked via Amex Travel
        dining: 1,
        other: 1
      },
      notes: '5x points on flights and prepaid hotels. $695 annual fee offset by extensive credits.'
    },
    annualFee: 695,
    benefits: [
      {
        description: '$200 annual airline fee credit',
        category: 'travel',
        value: '$200/year'
      },
      {
        description: '$200 annual Uber Cash credit ($15/month + $35 in December)',
        category: 'lifestyle',
        value: '$200/year'
      },
      {
        description: '$240 annual digital entertainment credit ($20/month at select services)',
        category: 'lifestyle',
        value: '$240/year'
      },
      {
        description: '$200 annual hotel credit (Fine Hotels + Resorts)',
        category: 'travel',
        value: '$200/year'
      },
      {
        description: '$100 annual Saks Fifth Avenue credit ($50 twice per year)',
        category: 'lifestyle',
        value: '$100/year'
      },
      {
        description: 'Centurion Lounge access + Priority Pass Select',
        category: 'travel',
      },
      {
        description: '5x Membership Rewards points on flights (direct or Amex Travel)',
        category: 'rewards',
      },
      {
        description: '5x points on prepaid hotels via Amex Travel',
        category: 'rewards',
      },
      {
        description: 'Elite hotel status (Marriott Gold, Hilton Gold)',
        category: 'status',
      },
      {
        description: 'TSA PreCheck or Global Entry credit',
        category: 'travel',
        value: 'Up to $100'
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
        flights: 2, // Delta purchases only
        dining: 2, // U.S. restaurants
        groceries: 2, // U.S. supermarkets
        hotels: 1, // Not 2x, corrected
        other: 1
      },
      notes: '2x miles on Delta purchases, U.S. restaurants, and U.S. supermarkets. MQD waiver at $25k spend.'
    },
    annualFee: 99,
    benefits: [
      {
        description: '2x miles on Delta purchases',
        category: 'rewards',
      },
      {
        description: '2x miles at U.S. restaurants',
        category: 'rewards',
      },
      {
        description: '2x miles at U.S. supermarkets',
        category: 'rewards',
      },
      {
        description: 'MQD waiver at $25k annual spend',
        category: 'status',
        value: '$25k/year'
      },
      {
        description: 'First checked bag free on Delta flights (for you and up to 8 companions)',
        category: 'travel',
      },
      {
        description: 'Priority boarding on Delta flights',
        category: 'travel',
      },
      {
        description: '20% off in-flight purchases',
        category: 'travel',
      },
      {
        description: 'No foreign transaction fees',
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
        groceries: 2, // U.S. supermarkets and grocery stores
        gas: 2, // U.S. gas stations
        dining: 2, // U.S. restaurants
        restaurants: 2, // Alias for dining (backwards compatibility)
        disney: 2, // Disney purchases
        other: 1
      },
      notes: 'Earn 2% in Disney Rewards Dollars on Disney, gas, groceries, restaurants. 1% on all other purchases.'
    },
    annualFee: 49,
    benefits: [
      {
        description: '2% Disney Rewards Dollars on Disney, gas, groceries, restaurants',
        category: 'rewards',
      },
      {
        description: '1% on all other purchases',
        category: 'rewards',
      },
      {
        description: '10% off select Disney merchandise and dining',
        category: 'lifestyle',
      },
      {
        description: 'Special Disney character meet-and-greets',
        category: 'lifestyle',
      },
      {
        description: 'Special financing on Disney vacation packages',
        category: 'lifestyle',
      },
      {
        description: 'No foreign transaction fees',
        category: 'travel',
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
      notes: 'Debit card with no rewards, but accepted everywhere Visa is accepted (including Costco and warehouse clubs)'
    },
    annualFee: 0,
    benefits: [
      {
        description: 'Accepted at Costco and all Visa merchants',
        category: 'acceptance',
      },
      {
        description: 'No annual fee',
        category: 'cost',
      },
      {
        description: 'Direct access to checking account funds',
        category: 'acceptance',
      }
    ]
  },
  {
    id: 'barclays_aviator',
    issuer: 'Barclays',
    network: 'Visa',
    name: 'Barclays AAdvantage Aviator Red World Elite',
    rewardsProfile: {
      baseRate: 1,
      categoryMultipliers: {
        flights: 2, // American Airlines purchases only
        american_airlines: 2, // Alias for flights
        other: 1
      },
      notes: '2x AAdvantage miles on American Airlines purchases. 1x miles on everything else. Known for black/red card design.'
    },
    annualFee: 99,
    benefits: [
      {
        description: '2x AAdvantage miles on American Airlines purchases',
        category: 'rewards',
      },
      {
        description: '1x miles on all other purchases',
        category: 'rewards',
      },
      {
        description: 'First checked bag free on American Airlines flights (for you and up to 4 companions)',
        category: 'travel',
      },
      {
        description: 'Priority boarding on American Airlines flights',
        category: 'travel',
      },
      {
        description: '25% off in-flight food and beverage purchases',
        category: 'travel',
      },
      {
        description: 'Preferred boarding (Group 5)',
        category: 'travel',
      },
      {
        description: 'No foreign transaction fees',
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
