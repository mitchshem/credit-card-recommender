import { Card } from '../types/data';
import { mergeUserWalletWithCards } from './userWallet';

export interface PersonalizedRecommendation {
  card: Card;
  reason: string;
  confidence: number;
  potentialValue: number;
  category: string;
}

export interface SpendingCategory {
  category: string;
  monthlyAmount: number;
}

/**
 * Get personalized recommendations for a merchant based on user's wallet
 */
export function getPersonalizedRecommendations(
  merchantCategory: string,
  userWallet: any,
  allCards: Card[]
): PersonalizedRecommendation[] {
  if (!userWallet || !allCards || userWallet.cards.length === 0) {
    return [];
  }

  const userCards = mergeUserWalletWithCards(userWallet, allCards);
  const activeCards = userCards.filter(card => card.isSelected);

  if (activeCards.length === 0) {
    return [];
  }

  const recommendations: PersonalizedRecommendation[] = [];

  // Analyze each card in wallet
  for (const card of activeCards) {
    const rewardRate = card.reward_rates[merchantCategory] || 0;

    if (rewardRate > 0) {
      const reason = getRecommendationReason(card, merchantCategory, rewardRate);
      const confidence = calculateConfidence(card, merchantCategory, rewardRate);
      const potentialValue = calculatePotentialValue(card, merchantCategory, rewardRate);

      recommendations.push({
        card,
        reason,
        confidence,
        potentialValue,
        category: merchantCategory
      });
    }
  }

  // Sort by potential value and confidence
  return recommendations.sort((a, b) => {
    const scoreA = a.potentialValue * a.confidence;
    const scoreB = b.potentialValue * b.confidence;
    return scoreB - scoreA;
  });
}

/**
 * Get the best card for a specific merchant category
 */
export function getBestCardForMerchant(
  merchantCategory: string,
  userWallet: any,
  allCards: Card[]
): PersonalizedRecommendation | null {
  const recommendations = getPersonalizedRecommendations(merchantCategory, userWallet, allCards);
  return recommendations.length > 0 ? recommendations[0] : null;
}

/**
 * Analyze spending patterns and optimize card usage
 */
export function analyzeSpendingOptimization(
  spendingByCategory: SpendingCategory[],
  userWallet: any,
  allCards: Card[]
): Array<{
  category: string;
  currentCard?: Card;
  optimalCard: Card;
  potentialSavings: number;
  reason: string;
}> {
  const optimizationSuggestions: Array<{
    category: string;
    currentCard?: Card;
    optimalCard: Card;
    potentialSavings: number;
    reason: string;
  }> = [];

  const userCards = mergeUserWalletWithCards(userWallet, allCards);
  const activeCards = userCards.filter(card => card.isSelected);

  for (const { category, monthlyAmount } of spendingByCategory) {
    // Find best user card for this category
    let currentBestCard: Card | undefined;
    let currentBestRate = 0;

    for (const card of activeCards) {
      const rate = card.reward_rates[category] || 0;
      if (rate > currentBestRate) {
        currentBestRate = rate;
        currentBestCard = card;
      }
    }

    // Find optimal card across all cards (including non-wallet)
    let optimalCard = currentBestCard;
    let optimalRate = currentBestRate;

    for (const card of allCards) {
      const rate = card.reward_rates[category] || 0;
      if (rate > optimalRate) {
        optimalRate = rate;
        optimalCard = card;
      }
    }

    // Calculate potential savings
    if (optimalCard && currentBestRate < optimalRate) {
      const currentEarnings = (monthlyAmount * currentBestRate / 100) * 12;
      const optimalEarnings = (monthlyAmount * optimalRate / 100) * 12;
      const potentialSavings = optimalEarnings - currentEarnings;

      if (potentialSavings > 0) {
        optimizationSuggestions.push({
          category,
          currentCard: currentBestCard,
          optimalCard,
          potentialSavings,
          reason: `Using ${optimalCard.name} could earn you $${potentialSavings.toFixed(2)} more per year in ${category} rewards`
        });
      }
    }
  }

  return optimizationSuggestions.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

/**
 * Get personalized card recommendations based on user's spending profile
 */
export function getPersonalizedCardSuggestions(
  spendingProfile: SpendingCategory[],
  userWallet: any,
  allCards: Card[]
): Array<{
  card: Card;
  reason: string;
  potentialValue: number;
  categories: string[];
}> {
  const suggestions: Array<{
    card: Card;
    reason: string;
    potentialValue: number;
    categories: string[];
  }> = [];

  const userCards = mergeUserWalletWithCards(userWallet, allCards);
  const userCardIds = new Set(userCards.map(c => c.id));

  // Find cards not in wallet that match spending profile
  for (const card of allCards) {
    if (userCardIds.has(card.id)) continue;

    const matchingCategories = spendingProfile
      .filter(({ category, monthlyAmount }) => {
        const rate = card.reward_rates[category] || 0;
        return rate > 0 && monthlyAmount > 0;
      })
      .map(({ category }) => category);

    if (matchingCategories.length > 0) {
      // Calculate potential value
      const potentialValue = spendingProfile.reduce((total, { category, monthlyAmount }) => {
        const rate = card.reward_rates[category] || 0;
        return total + (monthlyAmount * rate / 100) * 12;
      }, 0);

      suggestions.push({
        card,
        reason: `Would maximize rewards for: ${matchingCategories.join(', ')}`,
        potentialValue,
        categories: matchingCategories
      });
    }
  }

  return suggestions
    .sort((a, b) => b.potentialValue - a.potentialValue)
    .slice(0, 5); // Top 5 suggestions
}

/**
 * Calculate confidence score for recommendation
 */
function calculateConfidence(card: Card, category: string, rate: number): number {
  let confidence = 0.5;

  // Higher rate = higher confidence
  if (rate >= 4) confidence += 0.3;
  else if (rate >= 3) confidence += 0.2;
  else if (rate >= 2) confidence += 0.1;

  // Check if card has category in recommended_for
  if (card.recommended_for && card.recommended_for.some(r => r.toLowerCase().includes(category))) {
    confidence += 0.1;
  }

  // Check if card is in top rated
  if (card.signup_bonus && card.signup_bonus.value > 500) {
    confidence += 0.1;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Calculate potential value (annual earnings)
 */
function calculatePotentialValue(card: Card, category: string, rate: number): number {
  // Assume average monthly spend of $200 in this category
  const monthlySpend = 200;
  return (monthlySpend * rate / 100) * 12;
}

/**
 * Get human-readable reason for recommendation
 */
function getRecommendationReason(card: Card, category: string, rate: number): string {
  if (rate >= 5) {
    return `Best ${category} rewards in your wallet (${rate}x points)`;
  } else if (rate >= 3) {
    return `Great ${category} rewards (${rate}x points)`;
  } else if (rate >= 2) {
    return `Solid ${category} rewards (${rate}x points)`;
  } else {
    return `Moderate ${category} rewards (${rate}x points)`;
  }
}

/**
 * Get spending insights
 */
export function getSpendingInsights(
  spendingByCategory: SpendingCategory[],
  userWallet: any,
  allCards: Card[]
): {
  totalAnnualSpending: number;
  currentAnnualEarnings: number;
  potentialAnnualEarnings: number;
  optimizedAnnualEarnings: number;
  cardsBeingUsed: number;
  categoriesCovered: number;
} {
  const userCards = mergeUserWalletWithCards(userWallet, allCards);
  const activeCards = userCards.filter(card => card.isSelected);

  let totalAnnualSpending = 0;
  let currentEarnings = 0;
  let optimizedEarnings = 0;

  const activeCategories = new Set<string>();

  for (const { category, monthlyAmount } of spendingByCategory) {
    const annualSpend = monthlyAmount * 12;
    totalAnnualSpending += annualSpend;

    // Current earning (best card user has)
    let currentBestRate = 0;
    for (const card of activeCards) {
      const rate = card.reward_rates[category] || 0;
      if (rate > currentBestRate) {
        currentBestRate = rate;
      }
    }
    if (currentBestRate > 0) {
      currentEarnings += (annualSpend * currentBestRate / 100);
      activeCategories.add(category);
    }

    // Optimized earning (best card available)
    let optimalRate = 0;
    for (const card of allCards) {
      const rate = card.reward_rates[category] || 0;
      if (rate > optimalRate) {
        optimalRate = rate;
      }
    }
    if (optimalRate > 0) {
      optimizedEarnings += (annualSpend * optimalRate / 100);
    }
  }

  return {
    totalAnnualSpending,
    currentAnnualEarnings: currentEarnings,
    potentialAnnualEarnings: optimizedEarnings - currentEarnings,
    optimizedAnnualEarnings: optimizedEarnings,
    cardsBeingUsed: activeCards.length,
    categoriesCovered: activeCategories.size
  };
}
