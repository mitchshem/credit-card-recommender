import { Card, WalletCard } from '../types/data';
import { findMatchingCategory } from './taxonomy';

export interface Recommendation {
  card: Card;
  category: string;
  rate: number;
  walletCard?: WalletCard;
}

/**
 * Get recommendations for a merchant category
 */
export function getRecommendations(
  merchantCategory: string,
  allCards: Card[],
  selectedCards: Card[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  for (const card of selectedCards) {
    const match = findMatchingCategory(merchantCategory, card.reward_rates);
    
    if (match && match.rate > 0) {
      recommendations.push({
        card,
        category: match.category,
        rate: match.rate
      });
    }
  }
  
  // Sort by rate descending
  return recommendations.sort((a, b) => b.rate - a.rate);
}

/**
 * Get the best card for a specific category
 */
export function getBestCardForCategory(
  category: string,
  cards: Card[]
): Card | null {
  let bestCard: Card | null = null;
  let bestRate = 0;
  
  for (const card of cards) {
    const match = findMatchingCategory(category, card.reward_rates);
    
    if (match && match.rate > bestRate) {
      bestRate = match.rate;
      bestCard = card;
    }
  }
  
  return bestCard;
}

/**
 * Get reward rate for a card and category
 */
export function getRewardRate(
  card: Card,
  category: string
): number {
  const match = findMatchingCategory(category, card.reward_rates);
  return match ? match.rate : 0;
}

/**
 * Calculate potential earnings for a category
 */
export function calculatePotentialEarnings(
  category: string,
  cards: Card[],
  monthlySpending: number
): Array<{ card: Card; rate: number; earnings: number }> {
  const results = cards.map(card => {
    const rate = getRewardRate(card, category);
    const earnings = monthlySpending * rate / 100; // Convert to percentage
    return { card, rate, earnings };
  });
  
  return results.sort((a, b) => b.earnings - a.earnings);
}

/**
 * Find optimization opportunities
 */
export interface OptimizationOpportunity {
  category: string;
  currentCard?: Card;
  recommendedCard: Card;
  currentRate: number;
  recommendedRate: number;
  potentialGain: number;
  monthlySpending: number;
}

export function findOptimizationOpportunities(
  spendingByCategory: { [category: string]: number },
  userCards: Card[],
  allCards: Card[]
): OptimizationOpportunity[] {
  const opportunities: OptimizationOpportunity[] = [];
  
  for (const [category, spending] of Object.entries(spendingByCategory)) {
    if (spending === 0) continue;
    
    // Find best user card for this category
    const bestUserCard = getBestCardForCategory(category, userCards);
    const currentRate = bestUserCard ? getRewardRate(bestUserCard, category) : 1;
    
    // Find best overall card for this category
    const bestOverallCard = getBestCardForCategory(category, allCards);
    const recommendedRate = bestOverallCard ? getRewardRate(bestOverallCard, category) : 1;
    
    // If there's a better option
    if (bestOverallCard && recommendedRate > currentRate) {
      const potentialGain = spending * (recommendedRate - currentRate) / 100;
      
      opportunities.push({
        category,
        currentCard: bestUserCard || undefined,
        recommendedCard: bestOverallCard,
        currentRate,
        recommendedRate,
        potentialGain,
        monthlySpending: spending
      });
    }
  }
  
  // Sort by potential gain descending
  return opportunities.sort((a, b) => b.potentialGain - a.potentialGain);
}
