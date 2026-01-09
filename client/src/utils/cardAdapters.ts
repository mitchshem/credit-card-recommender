/**
 * Card Adapters
 * 
 * Utilities to convert between old Card format (from types/data.ts)
 * and new domain Card format (from domain/models.ts).
 * 
 * This allows the MVP pages to work with existing card data.
 */

import { Card as OldCard } from '../types/data';
import { Card as DomainCard } from '../domain/models';

/**
 * Convert old Card format to new Domain Card format
 */
export function oldCardToDomainCard(oldCard: OldCard, isActive: boolean = true): DomainCard {
  return {
    id: oldCard.id,
    issuer: oldCard.issuer || 'Unknown',
    network: oldCard.network,
    name: oldCard.name,
    nickname: undefined, // Old format doesn't have nickname
    rewardsProfile: {
      baseRate: oldCard.reward_rates.other || 1,
      categoryMultipliers: { ...oldCard.reward_rates },
      notes: oldCard.perks?.join(', ') || undefined,
    },
    annualFee: oldCard.annual_fee || 0,
    isActive,
    benefits: oldCard.benefits ? [
      ...(oldCard.benefits.travel_insurance ? [{ 
        description: 'Travel insurance',
        category: 'travel' 
      }] : []),
      ...(oldCard.benefits.rental_car_insurance ? [{ 
        description: 'Rental car insurance',
        category: 'travel' 
      }] : []),
      ...(oldCard.benefits.purchase_protection ? [{ 
        description: 'Purchase protection',
        category: 'protection' 
      }] : []),
    ] : undefined,
  };
}

/**
 * Convert domain Card format to old Card format
 * (useful if we need to pass domain cards to old components)
 */
export function domainCardToOldCard(domainCard: DomainCard): OldCard {
  return {
    id: domainCard.id,
    name: domainCard.name,
    network: domainCard.network,
    issuer: domainCard.issuer,
    annual_fee: domainCard.annualFee,
    reward_rates: {
      ...domainCard.rewardsProfile.categoryMultipliers,
      other: domainCard.rewardsProfile.baseRate,
    },
    perks: domainCard.rewardsProfile.notes ? [domainCard.rewardsProfile.notes] : [],
    categories: Object.keys(domainCard.rewardsProfile.categoryMultipliers),
  };
}

/**
 * Convert array of old cards to domain cards
 */
export function oldCardsToDomainCards(oldCards: OldCard[], isActive: boolean = true): DomainCard[] {
  return oldCards.map(card => oldCardToDomainCard(card, isActive));
}

