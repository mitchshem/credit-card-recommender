/**
 * Taxonomy mapping for handling category mismatches
 * Maps card categories to merchant categories and vice versa
 */

// Category aliases - maps similar categories together
export const categoryAliases: { [key: string]: string[] } = {
  // Travel-related categories
  travel: ['travel', 'flights', 'airfare', 'hotels'],
  flights: ['flights', 'airfare'],
  airfare: ['airfare', 'flights'],
  hotels: ['hotels'],
  
  // Shopping categories
  groceries: ['groceries', 'online_grocery'],
  online_grocery: ['online_grocery', 'groceries'],
  online_shopping: ['online_shopping'],
  
  // Other categories that should map to "other"
  rideshare: ['rideshares', 'rideshare'],
  streaming: ['streaming'],
  fitness: ['fitness'],
  pharmacy: ['pharmacy'],
  
  // Direct mappings
  dining: ['dining'],
  gas: ['gas'],
  other: ['other'],
};

// Alias map - for fast lookup
export const aliasMap: { [key: string]: string } = {
  // Travel variations
  travel: 'travel',
  flights: 'travel',
  airfare: 'travel',
  hotels: 'travel',
  
  // Shopping variations
  groceries: 'groceries',
  online_grocery: 'groceries',
  online_shopping: 'other',
  
  // Other variations
  rideshare: 'other',
  streaming: 'other',
  fitness: 'other',
  pharmacy: 'other',
  
  // Direct categories
  dining: 'dining',
  gas: 'gas',
  other: 'other',
};

/**
 * Normalize a category name to standard form
 */
export function normalizeCategory(category: string): string {
  return aliasMap[category] || category;
}

/**
 * Get all aliases for a category
 */
export function getCategoryAliases(category: string): string[] {
  return categoryAliases[category] || [category];
}

/**
 * Find the best matching category from a card's reward rates
 */
export function findMatchingCategory(
  merchantCategory: string,
  cardRewardRates: { [category: string]: number }
): { category: string; rate: number } | null {
  const normalizedCategory = normalizeCategory(merchantCategory);
  
  // Try exact match first
  if (cardRewardRates[normalizedCategory] !== undefined) {
    return { category: normalizedCategory, rate: cardRewardRates[normalizedCategory] };
  }
  
  // Try aliases
  const aliases = getCategoryAliases(normalizedCategory);
  for (const alias of aliases) {
    if (cardRewardRates[alias] !== undefined) {
      return { category: alias, rate: cardRewardRates[alias] };
    }
  }
  
  // Fallback to "other"
  if (cardRewardRates.other !== undefined) {
    return { category: 'other', rate: cardRewardRates.other };
  }
  
  return null;
}

/**
 * Get all available categories from reward rates
 */
export function getAvailableCategories(rewardRates: { [category: string]: number }): string[] {
  return Object.keys(rewardRates).filter(cat => rewardRates[cat] > 0);
}
