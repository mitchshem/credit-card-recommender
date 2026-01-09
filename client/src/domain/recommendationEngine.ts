/**
 * Recommendation Engine
 * 
 * Pure functions for determining which credit card to use at a merchant.
 * This is the core business logic - completely independent of UI, storage, or external services.
 * 
 * Design principles:
 * - Pure functions (no side effects, no global state)
 * - Easy to test
 * - Clear, explainable logic
 * - Simple enough for MVP, extensible for future features
 */

import {
  Card,
  Merchant,
  RecommendationInput,
  RecommendationResult,
  RankedCard,
} from './models';

/**
 * Get Best Card for Merchant
 * 
 * Main entry point for recommendations. Given a wallet and merchant,
 * returns the best card to use and an explanation.
 * 
 * Algorithm:
 * 1. Filter wallet to only active cards
 * 2. For each card, calculate reward rate for merchant's categories
 * 3. Rank cards by reward rate (with tiebreakers)
 * 4. Generate human-readable explanation
 * 
 * Future enhancements:
 * - Consider spending caps (e.g., "5% on first $1,500")
 * - Factor in annual fees when comparing similar rates
 * - Consider signup bonus requirements
 * - Handle rotating categories (Discover 5% categories)
 * 
 * @param input - Wallet, merchant, and optional transaction details
 * @returns Recommendation result with best card and explanation
 */
export function getBestCardForMerchant(
  input: RecommendationInput
): RecommendationResult {
  // Validate input
  if (!input.wallet || input.wallet.length === 0) {
    return createEmptyResult('Your wallet is empty. Add cards to get recommendations.');
  }

  if (!input.merchant || !input.merchant.categories || input.merchant.categories.length === 0) {
    return createEmptyResult('Merchant category not found. Unable to recommend a card.');
  }

  // Filter to only active cards
  const activeCards = input.wallet.filter(card => card.isActive);

  if (activeCards.length === 0) {
    return createEmptyResult('No active cards in your wallet. Activate a card to get recommendations.');
  }

  // Calculate scores for each card
  const rankedCards = activeCards.map(card => {
    const rewardRate = calculateRewardRate(card, input.merchant);
    const score = calculateScore(card, rewardRate, input.merchant);
    const reason = generateReason(card, rewardRate, input.merchant);

    return {
      cardId: card.id,
      rewardRate,
      score,
      reason,
    };
  });

  // Sort by score (highest first)
  rankedCards.sort((a, b) => {
    // Primary sort: by score (reward rate)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Tiebreaker: prefer lower annual fee
    const cardA = activeCards.find(c => c.id === a.cardId)!;
    const cardB = activeCards.find(c => c.id === b.cardId)!;
    return cardA.annualFee - cardB.annualFee;
  });

  // Generate explanation
  const explanation = generateExplanation(rankedCards, activeCards, input.merchant);

  return {
    bestCardId: rankedCards[0].cardId,
    rankedCards,
    explanation,
  };
}

/**
 * Calculate Reward Rate
 * 
 * Determines the reward rate a card earns for a given merchant.
 * 
 * Logic:
 * 1. Check if card has category multipliers for any of merchant's categories
 * 2. Use the highest matching multiplier
 * 3. Fall back to base rate if no category match
 * 
 * Example:
 * - Merchant: "Trader Joe's" (categories: ["grocery"])
 * - Card: Amex Gold (4x on grocery, 1x base)
 * - Returns: 4
 * 
 * Future: Handle spending caps, rotating categories, etc.
 */
function calculateRewardRate(card: Card, merchant: Merchant): number {
  const { rewardsProfile } = card;
  let maxRate = rewardsProfile.baseRate;

  // Check each of merchant's categories for multipliers
  for (const category of merchant.categories) {
    const multiplier = rewardsProfile.categoryMultipliers[category];
    if (multiplier && multiplier > maxRate) {
      maxRate = multiplier;
    }
  }

  return maxRate;
}

/**
 * Calculate Score
 * 
 * Computes a numeric score for ranking cards. Higher score = better card.
 * 
 * MVP: Score = reward rate (simple!)
 * Future: Could factor in:
 * - Annual fee (negative points)
 * - Benefits value
 * - User preferences
 * - Spending caps and restrictions
 */
function calculateScore(
  card: Card,
  rewardRate: number,
  merchant: Merchant
): number {
  // MVP: Score is just the reward rate
  // Future: Subtract annual fee impact, add benefits value, etc.
  return rewardRate;
}

/**
 * Generate Reason
 * 
 * Creates a brief reason why this card is ranked at this position.
 * Used for showing users why each card is where it is.
 */
function generateReason(
  card: Card,
  rewardRate: number,
  merchant: Merchant
): string {
  const cardName = card.nickname || card.name;

  if (rewardRate === card.rewardsProfile.baseRate) {
    return `${rewardRate}x base rate on all purchases`;
  }

  // Find which category matched
  const matchedCategory = merchant.categories.find(
    cat => card.rewardsProfile.categoryMultipliers[cat] === rewardRate
  );

  if (matchedCategory) {
    return `${rewardRate}x on ${formatCategory(matchedCategory)}`;
  }

  return `${rewardRate}x reward rate`;
}

/**
 * Generate Explanation
 * 
 * Creates the main human-readable explanation shown to users.
 * Explains which card to use and why, in simple terms.
 * 
 * Format: "Use [Card] because [reason]. [Alternative if close]"
 */
function generateExplanation(
  rankedCards: RankedCard[],
  cards: Card[],
  merchant: Merchant
): string {
  if (rankedCards.length === 0) {
    return 'No cards available for recommendation.';
  }

  const bestCard = cards.find(c => c.id === rankedCards[0].cardId)!;
  const bestCardName = bestCard.nickname || bestCard.name;
  const bestRate = rankedCards[0].rewardRate;

  // Base explanation
  let explanation = `Use ${bestCardName} because it earns ${bestRate}x `;

  // Find the category that matched
  const matchedCategory = merchant.categories.find(
    cat => bestCard.rewardsProfile.categoryMultipliers[cat] === bestRate
  );

  if (matchedCategory) {
    explanation += `on ${formatCategory(matchedCategory)}`;
  } else {
    explanation += 'on all purchases';
  }

  // Add alternative if there's a close second
  if (rankedCards.length > 1) {
    const secondCard = cards.find(c => c.id === rankedCards[1].cardId)!;
    const secondRate = rankedCards[1].rewardRate;
    const secondCardName = secondCard.nickname || secondCard.name;

    // If second place is within 0.5x, mention it
    if (bestRate - secondRate <= 0.5) {
      explanation += `. Or ${secondCardName} for ${secondRate}x`;
    }
  }

  // Compare to base rate if significantly better
  const baseRateCards = rankedCards.filter(
    rc => rc.rewardRate === cards.find(c => c.id === rc.cardId)!.rewardsProfile.baseRate
  );

  if (baseRateCards.length > 0 && bestRate > 1) {
    explanation += ` (vs ${baseRateCards[0].rewardRate}x on your other cards)`;
  }

  return explanation;
}

/**
 * Format Category
 * 
 * Converts category keys to human-readable format.
 * Example: "fast_food" → "fast food"
 */
function formatCategory(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Create Empty Result
 * 
 * Helper for when no recommendation can be made.
 */
function createEmptyResult(message: string): RecommendationResult {
  return {
    bestCardId: '',
    rankedCards: [],
    explanation: message,
  };
}

/**
 * Get Card Display Name
 * 
 * Helper to get display name (nickname if set, otherwise card name).
 */
export function getCardDisplayName(card: Card): string {
  return card.nickname || card.name;
}

/**
 * Find Matching Category
 * 
 * Finds which category from merchant matches a card's multipliers.
 * Useful for showing users which category triggered the reward.
 */
export function findMatchingCategory(
  card: Card,
  merchant: Merchant
): string | null {
  for (const category of merchant.categories) {
    if (card.rewardsProfile.categoryMultipliers[category]) {
      return category;
    }
  }
  return null;
}

