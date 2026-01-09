/**
 * User Data Service
 * 
 * Abstraction layer for user data persistence. This service hides the
 * implementation details of where data is stored (localStorage vs Firebase).
 * 
 * Benefits:
 * - Rest of app doesn't depend on Firebase SDK
 * - Easy to swap storage implementations (localStorage → Firebase → API)
 * - Easier to test (can mock this service)
 * - Clear separation of concerns
 * 
 * Current implementation: localStorage (for development/testing)
 * Future: Firebase Firestore (production)
 */

import { UserProfile } from '../domain/models';
import { Card } from '../domain/models';

/**
 * User Data Service Interface
 * 
 * Defines the contract for user data operations. Any implementation
 * (localStorage, Firebase, API) must satisfy this interface.
 */
export interface IUserDataService {
  getUserProfile(uid: string): Promise<UserProfile | null>;
  saveUserProfile(uid: string, data: Partial<UserProfile>): Promise<void>;
  getUserWallet(uid: string): Promise<Card[]>;
  saveUserWallet(uid: string, cards: Card[]): Promise<void>;
}

/**
 * LocalStorage Implementation
 * 
 * Stores user data in browser localStorage. Good for:
 * - Development and testing
 * - Offline-first apps
 * - No backend required
 * 
 * Limitations:
 * - Data only on one device
 * - Limited storage space
 * - Not secure for sensitive data (but we don't store sensitive data)
 */
class LocalStorageUserDataService implements IUserDataService {
  private readonly PROFILE_KEY_PREFIX = 'cc_advisor_profile_';
  private readonly WALLET_KEY_PREFIX = 'cc_advisor_wallet_';

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const key = `${this.PROFILE_KEY_PREFIX}${uid}`;
      const data = localStorage.getItem(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as UserProfile;
    } catch (error) {
      console.error('Error loading user profile from localStorage:', error);
      return null;
    }
  }

  async saveUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const key = `${this.PROFILE_KEY_PREFIX}${uid}`;
      const existing = await this.getUserProfile(uid);
      const updated = { ...existing, ...data, uid };
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user profile to localStorage:', error);
      throw new Error('Failed to save user profile');
    }
  }

  async getUserWallet(uid: string): Promise<Card[]> {
    try {
      const key = `${this.WALLET_KEY_PREFIX}${uid}`;
      const data = localStorage.getItem(key);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as Card[];
    } catch (error) {
      console.error('Error loading wallet from localStorage:', error);
      return [];
    }
  }

  async saveUserWallet(uid: string, cards: Card[]): Promise<void> {
    try {
      const key = `${this.WALLET_KEY_PREFIX}${uid}`;
      localStorage.setItem(key, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving wallet to localStorage:', error);
      throw new Error('Failed to save wallet');
    }
  }
}

/**
 * Firebase Implementation
 * 
 * Stores user data in Firestore. Use this for production.
 * 
 * TODO: Implement this when ready to use Firebase
 * - Import Firebase/Firestore functions
 * - Map between domain models and Firestore documents
 * - Handle errors and offline scenarios
 */
class FirebaseUserDataService implements IUserDataService {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    // TODO: Implement Firebase Firestore read
    // Example structure:
    // const doc = await getDoc(doc(db, 'users', uid));
    // if (!doc.exists()) return null;
    // return mapFirestoreToUserProfile(doc.data());
    
    throw new Error('Firebase implementation not yet ready');
  }

  async saveUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    // TODO: Implement Firebase Firestore write
    // Example structure:
    // await setDoc(doc(db, 'users', uid), data, { merge: true });
    
    throw new Error('Firebase implementation not yet ready');
  }

  async getUserWallet(uid: string): Promise<Card[]> {
    // TODO: Implement Firebase Firestore read for wallet
    // Could store as array of card IDs and resolve from static database
    // Or store full card objects in a 'wallets' collection
    
    throw new Error('Firebase implementation not yet ready');
  }

  async saveUserWallet(uid: string, cards: Card[]): Promise<void> {
    // TODO: Implement Firebase Firestore write for wallet
    // Store in user document or separate wallets collection
    
    throw new Error('Firebase implementation not yet ready');
  }
}

/**
 * Get User Data Service Instance
 * 
 * Returns the appropriate implementation based on environment/config.
 * 
 * For now: Always returns localStorage implementation
 * Future: Check environment variable or feature flag
 */
function getUserDataService(): IUserDataService {
  // Check for feature flag or environment variable
  const useFirebase = process.env.REACT_APP_USE_FIREBASE_STORAGE === 'true';

  if (useFirebase) {
    return new FirebaseUserDataService();
  }

  // Default: localStorage
  return new LocalStorageUserDataService();
}

/**
 * Default Export: Singleton Instance
 * 
 * Export a single instance so the whole app uses the same service.
 * This ensures consistency and makes it easy to swap implementations.
 */
export const userDataService: IUserDataService = getUserDataService();

/**
 * Helper Functions
 * 
 * Convenience wrappers that use the default service instance.
 * Makes it easy to use throughout the app.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return userDataService.getUserProfile(uid);
}

export async function saveUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  return userDataService.saveUserProfile(uid, data);
}

export async function getUserWallet(uid: string): Promise<Card[]> {
  return userDataService.getUserWallet(uid);
}

export async function saveUserWallet(uid: string, cards: Card[]): Promise<void> {
  return userDataService.saveUserWallet(uid, cards);
}

