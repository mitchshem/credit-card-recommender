/**
 * User Data Types for Firestore
 * 
 * These types define the structure of user data stored in Firestore.
 * Each field is documented to explain its purpose and usage.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * User Preferences
 * Stores user-specific app preferences and settings
 */
export interface UserPreferences {
  /** The card ID of the user's preferred primary card for recommendations */
  preferredPrimaryCard?: string;
  
  /** Array of category names the user frequently uses (e.g., ["dining", "travel"]) */
  favoriteCategories?: string[];
  
  /** Default cards to show in wallet view */
  defaultCards?: string[];
  
  /** Whether user wants email notifications */
  emailNotifications?: boolean;
  
  /** Whether to sync data across devices */
  dataSync?: boolean;
  
  /** Whether to enable analytics tracking */
  analyticsTracking?: boolean;
}

/**
 * User Profile Document
 * Complete structure of a user document in Firestore
 * Document path: users/{uid}
 */
export interface UserProfile {
  /** Firebase Authentication UID - unique identifier, also used as document ID */
  uid: string;
  
  /** User's email address from authentication provider */
  email: string;
  
  /** User's display name (from Google or manually set) */
  displayName: string;
  
  /** URL to user's profile photo (from Google) */
  photoURL?: string;
  
  /** User preferences and settings */
  preferences?: UserPreferences;
  
  /** Array of card IDs in user's wallet (references to cards in static database) */
  wallet?: string[];
  
  /** Timestamp when user account was created */
  createdAt?: Timestamp | Date;
  
  /** Timestamp when user last logged in */
  lastLogin?: Timestamp | Date;
  
  /** Timestamp when user profile was last updated */
  updatedAt?: Timestamp | Date;
}

/**
 * Partial User Profile
 * Used for updating user data (only include fields to update)
 */
export type PartialUserProfile = Partial<Omit<UserProfile, 'uid' | 'email'>>;

/**
 * User Profile with Required Fields
 * Used when creating a new user document
 */
export type NewUserProfile = Omit<UserProfile, 'createdAt' | 'lastLogin' | 'updatedAt'> & {
  createdAt: Timestamp;
  lastLogin: Timestamp;
};

