/**
 * Domain Models for Credit Card Advisor
 * 
 * This file defines the core data structures for the application.
 * These models represent the business domain - they're independent of
 * UI, storage, or external services like Firebase.
 * 
 * Design principles:
 * - Types are strict (no `any`)
 * - Models are focused on the MVP but extensible for future features
 * - Comments explain purpose and usage
 */

// ============================================================================
// USER PROFILE
// ============================================================================

/**
 * UserProfile
 * 
 * Represents a user of the application. This is the minimal profile data
 * needed for the MVP. In Firestore, this document lives at `users/{uid}`.
 * 
 * Security note: Never stores payment information or sensitive card data.
 */
export interface UserProfile {
  /** Firebase Auth UID - used as unique identifier and document ID */
  uid: string;
  
  /** User's email address */
  email: string;
  
  /** User's display name */
  displayName: string;
  
  /** Optional profile photo URL */
  photoURL?: string;
  
  /** User preferences and settings */
  preferences?: UserPreferences;
}

/**
 * UserPreferences
 * 
 * User-specific app preferences. Stored as part of UserProfile.
 * Extend this as you add more preference options.
 */
export interface UserPreferences {
  /** Preferred primary card ID for quick access */
  preferredPrimaryCard?: string;
  
  /** Favorite spending categories */
  favoriteCategories?: string[];
  
  /** Notification preferences */
  emailNotifications?: boolean;
}

// ============================================================================
// CREDIT CARD
// ============================================================================

/**
 * Card
 * 
 * Represents a credit card in the system. Cards come from a static database
 * and are referenced by ID. Users add cards to their wallet by ID.
 * 
 * Key design decisions:
 * - `id` is the primary key (e.g., "chase_sapphire_preferred")
 * - `network` is the payment network (Visa, Mastercard, Amex, Discover)
 * - `rewardsProfile` contains the reward structure
 * - Benefits are separate from rewards (travel insurance, etc.)
 */
export interface Card {
  /** Unique identifier for this card (e.g., "chase_sapphire_preferred") */
  id: string;
  
  /** Card issuer (e.g., "Chase", "American Express") */
  issuer: string;
  
  /** Payment network (e.g., "Visa", "Mastercard", "American Express") */
  network: string;
  
  /** Official card name (e.g., "Chase Sapphire Preferred") */
  name: string;
  
  /** User's custom nickname (optional, only if user sets one) */
  nickname?: string;
  
  /** Reward structure for this card */
  rewardsProfile: CardRewardsProfile;
  
  /** Annual fee in dollars (0 if no fee) */
  annualFee: number;
  
  /** Whether this card is active in user's wallet (they can toggle this) */
  isActive: boolean;
  
  /** List of benefits (travel insurance, lounge access, etc.) */
  benefits?: CardBenefit[];
}

/**
 * CardRewardsProfile
 * 
 * Defines how rewards are earned on this card. This is the core data
 * used by the recommendation engine.
 * 
 * MVP assumption: Rewards are percentage-based (e.g., 4% = 4x points or 4% cash back).
 * Future: Could add point values, transfer partners, redemption multipliers.
 */
export interface CardRewardsProfile {
  /** Base reward rate for all purchases (default rate) */
  baseRate: number;
  
  /** Category-specific multipliers
   * Example: { "dining": 4, "grocery": 3, "travel": 2 }
   * Keys are category names, values are reward multipliers
   */
  categoryMultipliers: { [category: string]: number };
  
  /** Optional notes about rewards (e.g., "Up to $6,000 per year") */
  notes?: string;
}

/**
 * CardBenefit
 * 
 * Represents a non-reward benefit (travel insurance, credits, etc.).
 * Not used in MVP recommendation logic but stored for future use.
 */
export interface CardBenefit {
  /** Human-readable description (e.g., "Travel insurance included") */
  description: string;
  
  /** Benefit category (e.g., "travel", "lifestyle", "insurance") */
  category: string;
  
  /** Optional multiplier or value (e.g., "$200 annual credit") */
  value?: string;
}

// ============================================================================
// MERCHANT
// ============================================================================

/**
 * Merchant
 * 
 * Represents a merchant (store, service, etc.) where users might make purchases.
 * Merchants map to spending categories which determine which card to use.
 * 
 * Example: "Trader Joe's" → "grocery" category
 */
export interface Merchant {
  /** Unique identifier (e.g., "trader_joes", "uber") */
  id: string;
  
  /** Merchant name (e.g., "Trader Joe's", "Uber") */
  name: string;
  
  /** Normalized name for searching (lowercase, no special chars) */
  normalizedName: string;
  
  /** Primary spending categories this merchant matches
   * Example: ["grocery"] or ["travel", "airline"]
   */
  categories: string[];
  
  /** Optional: Merchant Category Code (MCC) for precise categorization */
  mcc?: string;
}

// ============================================================================
// RECOMMENDATION
// ============================================================================

/**
 * RecommendationInput
 * 
 * Input data for the recommendation engine. Contains everything needed
 * to determine which card is best for a given transaction.
 */
export interface RecommendationInput {
  /** User's wallet of cards (only active cards are considered) */
  wallet: Card[];
  
  /** Merchant where the transaction will occur */
  merchant: Merchant;
  
  /** Transaction amount in dollars (optional for MVP, but useful for future) */
  amount?: number;
  
  /** Optional tags for additional context (e.g., ["foreign", "online"]) */
  tags?: string[];
}

/**
 * RecommendationResult
 * 
 * The output of the recommendation engine. Contains the best card and
 * an explanation of why it was chosen.
 */
export interface RecommendationResult {
  /** ID of the best card to use */
  bestCardId: string;
  
  /** All cards ranked by score (highest first)
   * Includes score and reason for each card
   */
  rankedCards: RankedCard[];
  
  /** Human-readable explanation of why this card was chosen
   * Example: "Use Amex Gold because it earns 4x points on groceries, 
   * compared to 1x on your other cards."
   */
  explanation: string;
}

/**
 * RankedCard
 * 
 * A card with its recommendation score and reasoning.
 * Used to show users not just the best card, but why others didn't win.
 */
export interface RankedCard {
  /** Card ID */
  cardId: string;
  
  /** Reward rate for this merchant's category */
  rewardRate: number;
  
  /** Overall score (used for ranking, can incorporate multiple factors) */
  score: number;
  
  /** Brief reason this card was ranked here */
  reason: string;
}

// ============================================================================
// WALLET (User's Collection of Cards)
// ============================================================================

/**
 * WalletCard
 * 
 * A card in a user's wallet. This extends Card with user-specific data
 * like nickname and active status. This is what gets stored in the wallet.
 */
export interface WalletCard extends Card {
  /** User's custom nickname for this card (optional) */
  nickname?: string;
  
  /** Whether this card is currently active (user can toggle) */
  isActive: boolean;
  
  /** When this card was added to wallet (optional, for future features) */
  addedAt?: Date;
}

