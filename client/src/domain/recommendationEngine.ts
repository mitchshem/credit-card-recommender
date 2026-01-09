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
  UserPreferences,
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
    const score = calculateScore(card, rewardRate, input.merchant, input.preferences);
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
    // Primary sort: by score (includes preferences)
    if (Math.abs(b.score - a.score) > 0.01) {
      return b.score - a.score;
    }
    // If scores are very close, prefer higher reward rate
    if (b.rewardRate !== a.rewardRate) {
      return b.rewardRate - a.rewardRate;
    }
    // Final tiebreaker: prefer lower annual fee
    const cardA = activeCards.find(c => c.id === a.cardId)!;
    const cardB = activeCards.find(c => c.id === b.cardId)!;
    return cardA.annualFee - cardB.annualFee;
  });

  // Generate explanation (include preferences context if applicable)
  const explanation = generateExplanation(rankedCards, activeCards, input.merchant, input.preferences);

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
 * Factors:
 * - Base reward rate
 * - User preferences (primary objective, constraints)
 * - Annual fee considerations
 * - Card-specific bonuses (Delta miles, AA miles, etc.)
 */
function calculateScore(
  card: Card,
  rewardRate: number,
  merchant: Merchant,
  preferences?: UserPreferences
): number {
  if (!preferences) {
    // No preferences: simple reward rate scoring
    return rewardRate;
  }

  let score = rewardRate;

  // Apply primary objective
  const objective = preferences.primaryObjective;
  if (objective) {
    score = applyPrimaryObjective(card, rewardRate, objective, score);
  }

  // Apply constraints
  if (preferences.constraints) {
    score = applyConstraints(card, rewardRate, preferences.constraints, score);
  }

  // Apply priority bonuses
  if (preferences.priorities && preferences.priorities.length > 0) {
    score = applyPriorityBonuses(card, preferences.priorities, score);
  }

  return score;
}

/**
 * Apply Primary Objective to Score
 */
function applyPrimaryObjective(
  card: Card,
  rewardRate: number,
  objective: 'maximize_points' | 'maximize_delta_miles' | 'maximize_aa_miles' | 'minimize_cost' | 'simplify',
  currentScore: number
): number {
  switch (objective) {
    case 'maximize_delta_miles':
      // Boost Delta SkyMiles cards
      if (card.id === 'delta_skymiles_gold') {
        return currentScore * 1.2; // 20% boost for Delta-focused objective
      }
      // Slight penalty for other airline cards if reward rates are similar
      if (card.id === 'barclays_aviator' && rewardRate > 0) {
        return currentScore * 0.9;
      }
      break;
    
    case 'maximize_aa_miles':
      // Boost AAdvantage cards
      if (card.id === 'barclays_aviator') {
        return currentScore * 1.2; // 20% boost for AA-focused objective
      }
      // Slight penalty for other airline cards
      if (card.id === 'delta_skymiles_gold' && rewardRate > 0) {
        return currentScore * 0.9;
      }
      break;
    
    case 'minimize_cost':
      // Prefer no-annual-fee cards when rates are close
      if (card.annualFee === 0) {
        return currentScore * 1.15; // 15% boost for no-fee cards
      }
      // Penalty for high annual fees when rates are similar
      if (card.annualFee > 250) {
        return currentScore * 0.85;
      }
      break;
    
    case 'simplify':
      // Prefer simpler cards (lower annual fees, fewer categories)
      if (card.annualFee === 0 || card.annualFee <= 99) {
        return currentScore * 1.1; // 10% boost for simpler/lower-fee cards
      }
      break;
    
    case 'maximize_points':
    default:
      // Default: maximize raw reward rate (already handled by base score)
      break;
  }

  return currentScore;
}

/**
 * Apply Constraints to Score
 */
function applyConstraints(
  card: Card,
  rewardRate: number,
  constraints: NonNullable<UserPreferences['constraints']>,
  currentScore: number
): number {
  let adjustedScore = currentScore;

  // Avoid annual fee bias: prefer no-fee when rates are equal
  if (constraints.avoidAnnualFeeBias) {
    // If this card has an annual fee and we're comparing at the same rate,
    // slight penalty
    if (card.annualFee > 0 && rewardRate <= 2) {
      adjustedScore *= 0.95;
    }
    // Bonus for no-fee cards
    if (card.annualFee === 0 && rewardRate > 1) {
      adjustedScore *= 1.05;
    }
  }

  // Prefer simplicity: bonus for lower-fee, simpler cards
  if (constraints.preferSimplicity) {
    if (card.annualFee <= 99) {
      adjustedScore *= 1.08;
    } else if (card.annualFee > 400) {
      adjustedScore *= 0.92;
    }
  }

  // Prefer lounge access: boost Platinum
  if (constraints.preferLoungeAccess) {
    if (card.id === 'amex_platinum') {
      adjustedScore *= 1.15; // Significant boost for lounge access
    }
    // Boost Delta Gold for Priority boarding (travel benefit)
    if (card.id === 'delta_skymiles_gold') {
      adjustedScore *= 1.05;
    }
  }

  // Prefer status progress: boost airline cards
  if (constraints.preferStatusProgress) {
    if (card.id === 'delta_skymiles_gold') {
      adjustedScore *= 1.1; // MQD waiver benefit
    }
    if (card.id === 'barclays_aviator') {
      adjustedScore *= 1.05; // Airline card
    }
  }

  return adjustedScore;
}

/**
 * Apply Priority Bonuses to Score
 */
function applyPriorityBonuses(
  card: Card,
  priorities: string[],
  currentScore: number
): number {
  let adjustedScore = currentScore;

  // Lounge access priority
  if (priorities.includes('lounge_access')) {
    if (card.id === 'amex_platinum') {
      adjustedScore *= 1.2; // Big boost for Centurion Lounge access
    }
  }

  // Status progress priority
  if (priorities.includes('status_progress')) {
    if (card.id === 'delta_skymiles_gold') {
      adjustedScore *= 1.15; // MQD waiver is valuable
    }
  }

  // Dining credits priority
  if (priorities.includes('dining_credits')) {
    if (card.id === 'amex_gold') {
      adjustedScore *= 1.1; // $120 dining credit
    }
  }

  return adjustedScore;
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
  merchant: Merchant,
  preferences?: UserPreferences
): string {
  if (rankedCards.length === 0) {
    return 'No cards available for recommendation.';
  }

  const bestCard = cards.find(c => c.id === rankedCards[0].cardId)!;
  const bestCardName = bestCard.nickname || bestCard.name;
  const bestRate = rankedCards[0].rewardRate;
  const bestScore = rankedCards[0].score;

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

  // Add context based on preferences
  if (preferences) {
    if (preferences.primaryObjective === 'maximize_delta_miles' && bestCard.id === 'delta_skymiles_gold') {
      explanation += ` and helps maximize Delta SkyMiles`;
    } else if (preferences.primaryObjective === 'maximize_aa_miles' && bestCard.id === 'barclays_aviator') {
      explanation += ` and helps maximize AAdvantage miles`;
    } else if (preferences.primaryObjective === 'minimize_cost' && bestCard.annualFee === 0) {
      explanation += ` with no annual fee`;
    } else if (preferences.constraints?.preferLoungeAccess && bestCard.id === 'amex_platinum') {
      explanation += ` plus lounge access benefits`;
    }
  }

  // Add alternative if there's a close second
  if (rankedCards.length > 1) {
    const secondCard = cards.find(c => c.id === rankedCards[1].cardId)!;
    const secondRate = rankedCards[1].rewardRate;
    const secondScore = rankedCards[1].score;
    const secondCardName = secondCard.nickname || secondCard.name;

    // If second place score is within 10%, mention it (score accounts for preferences)
    const scoreDifference = (bestScore - secondScore) / bestScore;
    if (scoreDifference <= 0.1 || bestRate - secondRate <= 0.5) {
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

