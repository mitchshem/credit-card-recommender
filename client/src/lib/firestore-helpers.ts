/**
 * Firestore Helper Functions
 * 
 * These functions provide a convenient, type-safe way to interact with Firestore.
 * They handle common patterns like:
 * - Creating user documents
 * - Updating user data
 * - Reading user profiles
 * - Error handling
 * 
 * Why use helpers?
 * - Reduces code duplication
 * - Provides consistent error handling
 * - Makes it easier to change database structure later
 * - Centralizes security-related logic
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  DocumentSnapshot,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, PartialUserProfile, NewUserProfile } from '../types/user';

/**
 * User Collection Constants
 * 
 * Centralized path names make refactoring easier if collection names change.
 */
export const COLLECTIONS = {
  USERS: 'users',
  // Future collections can be added here:
  // WALLETS: 'wallets',
  // USER_CARDS: 'userCards',
} as const;

/**
 * Get User Profile
 * 
 * Reads a user's profile document from Firestore.
 * 
 * @param uid - Firebase Auth user ID (also the document ID)
 * @returns UserProfile if found, null if document doesn't exist
 * 
 * @throws Error if Firestore read fails
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    const userDocSnap: DocumentSnapshot<DocumentData> = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      return null;
    }
    
    // Convert Firestore Timestamp to Date for easier use in React
    const data = userDocSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      lastLogin: data.lastLogin?.toDate?.() || data.lastLogin,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(`Failed to fetch user profile: ${error}`);
  }
}

/**
 * Create User Profile
 * 
 * Creates a new user document in Firestore.
 * This should be called when a user signs up for the first time.
 * 
 * @param profile - Complete user profile data
 * @throws Error if Firestore write fails or document already exists
 */
export async function createUserProfile(profile: NewUserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, profile.uid);
    
    // Check if document already exists
    const existingDoc = await getDoc(userDocRef);
    if (existingDoc.exists()) {
      throw new Error(`User profile already exists for uid: ${profile.uid}`);
    }
    
    // Create document with server timestamp
    await setDoc(userDocRef, {
      ...profile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error(`Failed to create user profile: ${error}`);
  }
}

/**
 * Update User Profile
 * 
 * Updates an existing user document with partial data.
 * Uses merge: true to only update specified fields.
 * 
 * @param uid - Firebase Auth user ID
 * @param updates - Partial profile data to update
 * @throws Error if Firestore update fails
 */
export async function updateUserProfile(
  uid: string, 
  updates: PartialUserProfile
): Promise<void> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    
    // Always update the updatedAt timestamp when modifying user data
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(`Failed to update user profile: ${error}`);
  }
}

/**
 * Update Last Login
 * 
 * Updates only the lastLogin timestamp for a user.
 * This is useful after a user signs in.
 * 
 * @param uid - Firebase Auth user ID
 */
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userDocRef, {
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw - last login update failure shouldn't break sign-in flow
  }
}

/**
 * Create or Update User Profile
 * 
 * Convenience function that:
 * - Creates user profile if it doesn't exist
 * - Updates lastLogin if it does exist
 * 
 * Useful for OAuth sign-in flows where you're not sure if user exists yet.
 * 
 * @param profile - User profile data
 * @returns true if created, false if updated
 */
export async function createOrUpdateUserProfile(
  profile: NewUserProfile
): Promise<boolean> {
  const existingProfile = await getUserProfile(profile.uid);
  
  if (!existingProfile) {
    // User doesn't exist - create new profile
    await createUserProfile(profile);
    return true; // Created
  } else {
    // User exists - just update last login
    await updateLastLogin(profile.uid);
    return false; // Updated
  }
}

/**
 * Check if User Profile Exists
 * 
 * Quick check to see if a user document exists without fetching all data.
 * 
 * @param uid - Firebase Auth user ID
 * @returns true if document exists, false otherwise
 */
export async function userProfileExists(uid: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists();
  } catch (error) {
    console.error('Error checking if user profile exists:', error);
    return false;
  }
}

