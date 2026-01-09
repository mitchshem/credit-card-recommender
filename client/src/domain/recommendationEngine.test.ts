/**
 * Tests for Recommendation Engine
 * 
 * Tests the core recommendation logic with various scenarios:
 * - Category-specific cards beating generic cards
 * - Tie-breaking scenarios
 * - Edge cases (empty wallet, no matches, etc.)
 */

import { getBestCardForMerchant } from './recommendationEngine';
import { Card, Merchant, RecommendationInput } from './models';

// Test data helpers
function createCard(
  id: string,
  name: string,
  categoryMultipliers: { [key: string]: number },
  baseRate: number = 1,
  annualFee: number = 0
): Card {
  return {
    id,
    issuer: 'Test',
    network: 'Visa',
    name,
    rewardsProfile: {
      baseRate,
      categoryMultipliers,
    },
    annualFee,
    isActive: true,
  };
}

function createMerchant(id: string, name: string, categories: string[]): Merchant {
  return {
    id,
    name,
    normalizedName: name.toLowerCase(),
    categories,
  };
}

describe('getBestCardForMerchant', () => {
  describe('Category-specific cards beat generic cards', () => {
    it('should recommend dining card over generic card at restaurant', () => {
      // Arrange
      const diningCard = createCard('amex_gold', 'Amex Gold', {
        dining: 4,
        grocery: 4,
      });
      const genericCard = createCard('generic_card', 'Generic Card', {}, 1);

      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [genericCard, diningCard],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert
      expect(result.bestCardId).toBe('amex_gold');
      expect(result.rankedCards[0].rewardRate).toBe(4);
      expect(result.rankedCards[1].rewardRate).toBe(1);
      expect(result.explanation).toContain('Amex Gold');
      expect(result.explanation).toContain('4x');
      expect(result.explanation.toLowerCase()).toContain('dining');
    });

    it('should recommend grocery card over generic card at grocery store', () => {
      // Arrange
      const groceryCard = createCard('amex_gold', 'Amex Gold', {
        grocery: 4,
      });
      const genericCard = createCard('generic_card', 'Generic Card', {}, 1);

      const groceryStore = createMerchant('trader_joes', "Trader Joe's", ['grocery']);

      const input: RecommendationInput = {
        wallet: [genericCard, groceryCard],
        merchant: groceryStore,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert
      expect(result.bestCardId).toBe('amex_gold');
      expect(result.rankedCards[0].rewardRate).toBe(4);
    });
  });

  describe('Tie-breaking scenarios', () => {
    it('should prefer lower annual fee when reward rates are tied', () => {
      // Arrange - Two cards with same reward rate, different fees
      const expensiveCard = createCard(
        'expensive_card',
        'Expensive Card',
        { dining: 3 },
        1,
        250 // Higher fee
      );
      const cheapCard = createCard(
        'cheap_card',
        'Cheap Card',
        { dining: 3 },
        1,
        0 // No fee
      );

      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [expensiveCard, cheapCard],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should prefer the cheaper card
      expect(result.bestCardId).toBe('cheap_card');
      expect(result.rankedCards[0].rewardRate).toBe(3);
      expect(result.rankedCards[1].rewardRate).toBe(3);
      // Both have same rate, but cheap card should win on tiebreaker
    });

    it('should rank by reward rate first, then use fee as tiebreaker', () => {
      // Arrange
      const highRateExpensive = createCard(
        'high_rate_expensive',
        'High Rate Expensive',
        { dining: 4 },
        1,
        250
      );
      const lowRateFree = createCard(
        'low_rate_free',
        'Low Rate Free',
        { dining: 2 },
        1,
        0
      );

      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [lowRateFree, highRateExpensive],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Higher rate should win even if more expensive
      expect(result.bestCardId).toBe('high_rate_expensive');
      expect(result.rankedCards[0].rewardRate).toBe(4);
      expect(result.rankedCards[1].rewardRate).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty wallet gracefully', () => {
      // Arrange
      const input: RecommendationInput = {
        wallet: [],
        merchant: createMerchant('chipotle', 'Chipotle', ['dining']),
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert
      expect(result.bestCardId).toBe('');
      expect(result.rankedCards).toHaveLength(0);
      expect(result.explanation).toContain('empty');
    });

    it('should ignore inactive cards', () => {
      // Arrange
      const activeCard = createCard('active_card', 'Active Card', { dining: 3 });
      const inactiveCard = createCard(
        'inactive_card',
        'Inactive Card',
        { dining: 5 }
      );
      inactiveCard.isActive = false;

      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [activeCard, inactiveCard],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should only consider active card
      expect(result.bestCardId).toBe('active_card');
      expect(result.rankedCards).toHaveLength(1);
    });

    it('should handle merchant with no categories', () => {
      // Arrange
      const card = createCard('test_card', 'Test Card', { dining: 3 });
      const merchant = createMerchant('unknown', 'Unknown Merchant', []);

      const input: RecommendationInput = {
        wallet: [card],
        merchant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert
      expect(result.explanation).toContain('category not found');
    });

    it('should use base rate when no category matches', () => {
      // Arrange
      const card = createCard('travel_card', 'Travel Card', { travel: 3 }, 1);
      const groceryStore = createMerchant('trader_joes', "Trader Joe's", ['grocery']);

      const input: RecommendationInput = {
        wallet: [card],
        merchant: groceryStore,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should use base rate since grocery doesn't match
      expect(result.bestCardId).toBe('travel_card');
      expect(result.rankedCards[0].rewardRate).toBe(1); // Base rate
    });

    it('should handle merchant with multiple categories and pick best match', () => {
      // Arrange
      const groceryCard = createCard('grocery_card', 'Grocery Card', { grocery: 5 });
      const wholesaleCard = createCard('wholesale_card', 'Wholesale Card', {
        wholesale: 3,
      });

      // Costco is both grocery and wholesale
      const costco = createMerchant('costco', 'Costco', ['grocery', 'wholesale']);

      const input: RecommendationInput = {
        wallet: [wholesaleCard, groceryCard],
        merchant: costco,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should pick grocery card with 5x over wholesale 3x
      expect(result.bestCardId).toBe('grocery_card');
      expect(result.rankedCards[0].rewardRate).toBe(5);
    });
  });

  describe('Explanation quality', () => {
    it('should generate clear explanation for category match', () => {
      // Arrange
      const diningCard = createCard('dining_card', 'Dining Card', { dining: 4 });
      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [diningCard],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert
      expect(result.explanation).toContain('Dining Card');
      expect(result.explanation).toContain('4x');
      expect(result.explanation.toLowerCase()).toContain('dining');
    });

    it('should mention alternative card if rates are close', () => {
      // Arrange
      const card1 = createCard('card_1', 'Card 1', { dining: 3 });
      const card2 = createCard('card_2', 'Card 2', { dining: 2.5 });
      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [card1, card2],
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should mention the alternative
      expect(result.explanation).toContain('Or');
    });
  });

  describe('Multiple cards ranking', () => {
    it('should rank all cards correctly', () => {
      // Arrange
      const card1 = createCard('card_1', 'Card 1', { dining: 4 });
      const card2 = createCard('card_2', 'Card 2', { dining: 3 });
      const card3 = createCard('card_3', 'Card 3', { dining: 2 });
      const restaurant = createMerchant('chipotle', 'Chipotle', ['dining']);

      const input: RecommendationInput = {
        wallet: [card3, card1, card2], // Out of order
        merchant: restaurant,
      };

      // Act
      const result = getBestCardForMerchant(input);

      // Assert - Should be ranked by rate
      expect(result.rankedCards).toHaveLength(3);
      expect(result.rankedCards[0].rewardRate).toBe(4);
      expect(result.rankedCards[1].rewardRate).toBe(3);
      expect(result.rankedCards[2].rewardRate).toBe(2);
    });
  });
});

