/**
 * Enhanced AuthContext with Improved Structure
 * 
 * This is an enhanced version of AuthContext that:
 * - Uses the new type definitions from types/user.ts
 * - Uses helper functions from lib/firestore-helpers.ts
 * - Has better error handling and comments
 * - Is more maintainable and easier to extend
 * 
 * To use this instead of the current AuthContext:
 * 1. Replace the contents of AuthContext.tsx with this file
 * 2. Update imports if needed
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, appleProvider } from '../lib/firebase';
import { 
  getUserProfile, 
  createUserProfile, 
  updateLastLogin,
  createOrUpdateUserProfile 
} from '../lib/firestore-helpers';
import { UserProfile, PartialUserProfile, NewUserProfile } from '../types/user';

/**
 * AuthContext Interface
 * 
 * Defines what data and functions are available to components using useAuth()
 */
interface AuthContextType {
  /** Current Firebase Auth user object (null if not signed in) */
  currentUser: User | null;
  
  /** User's profile data from Firestore (null if not signed in or profile doesn't exist) */
  userProfile: UserProfile | null;
  
  /** True while checking authentication state (prevents flash of content) */
  loading: boolean;
  
  /** Sign up with email and password */
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  
  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<any>;
  
  /** Sign in with Google OAuth */
  loginWithGoogle: () => Promise<any>;
  
  /** Sign in with Apple OAuth */
  loginWithApple: () => Promise<any>;
  
  /** Sign out current user */
  logout: () => Promise<void>;
  
  /** Update user profile data in Firestore */
  updateUserProfile: (data: PartialUserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * useAuth Hook
 * 
 * Provides access to authentication state and functions.
 * Must be used inside an AuthProvider component.
 * 
 * @example
 * ```tsx
 * const { currentUser, loginWithGoogle, logout } = useAuth();
 * ```
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider Component
 * 
 * Provides authentication state and functions to all child components.
 * 
 * Responsibilities:
 * - Manages authentication state (signed in/out)
 * - Loads user profile from Firestore when user signs in
 * - Provides sign-in/sign-out functions
 * - Listens to auth state changes in real-time
 * 
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign Up with Email/Password
   * 
   * Creates a new user account and profile in Firestore.
   */
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update Firebase Auth profile (displayName)
      await updateAuthProfile(userCredential.user, {
        displayName
      });

      // 3. Create Firestore user profile document
      const newProfile: NewUserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName,
        photoURL: userCredential.user.photoURL || undefined,
        wallet: [],
        preferences: {
          defaultCards: [],
          favoriteCategories: [],
          emailNotifications: true,
          dataSync: true,
          analyticsTracking: true,
        },
        createdAt: serverTimestamp() as any,
        lastLogin: serverTimestamp() as any,
      };

      await createUserProfile(newProfile);
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  /**
   * Sign In with Email/Password
   * 
   * Authenticates user and updates last login timestamp.
   */
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      await updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Sign In with Google
   * 
   * Opens Google OAuth popup and:
   * - Creates user profile if first time signing in
   * - Updates last login if returning user
   */
  const loginWithGoogle = async () => {
    try {
      // 1. Sign in with Google OAuth popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Create or update user profile
      const newProfile: NewUserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'User',
        photoURL: result.user.photoURL || undefined,
        wallet: [],
        preferences: {
          defaultCards: [],
          favoriteCategories: [],
          emailNotifications: true,
          dataSync: true,
          analyticsTracking: true,
        },
        createdAt: serverTimestamp() as any,
        lastLogin: serverTimestamp() as any,
      };

      // Helper function handles create vs update logic
      await createOrUpdateUserProfile(newProfile);
      
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  /**
   * Sign In with Apple
   * 
   * Similar to Google sign-in but uses Apple OAuth.
   */
  const loginWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      
      const newProfile: NewUserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'User',
        photoURL: result.user.photoURL || undefined,
        wallet: [],
        preferences: {
          defaultCards: [],
          favoriteCategories: [],
          emailNotifications: true,
          dataSync: true,
          analyticsTracking: true,
        },
        createdAt: serverTimestamp() as any,
        lastLogin: serverTimestamp() as any,
      };

      await createOrUpdateUserProfile(newProfile);
      
      return result;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    }
  };

  /**
   * Sign Out
   * 
   * Signs out current user and clears profile data from memory.
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  /**
   * Update User Profile
   * 
   * Updates user document in Firestore with new data.
   * Automatically refreshes userProfile state after update.
   */
  const updateUserProfile = async (data: PartialUserProfile) => {
    if (!currentUser) {
      throw new Error('Cannot update profile: user not signed in');
    }
    
    try {
      const { updateUserProfile: updateProfileHelper } = await import('../lib/firestore-helpers');
      
      // Update in Firestore
      await updateProfileHelper(currentUser.uid, data);
      
      // Reload profile to get updated data
      const updatedProfile = await getUserProfile(currentUser.uid);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  /**
   * Listen to Authentication State Changes
   * 
   * This effect runs when:
   * - Component mounts (initial auth check)
   * - User signs in
   * - User signs out
   * - Auth token refreshes
   * 
   * When user signs in:
   * 1. Set currentUser state
   * 2. Load user profile from Firestore
   * 3. Set loading to false
   * 
   * When user signs out:
   * 1. Set currentUser to null
   * 2. Clear userProfile
   * 3. Set loading to false
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in - load their profile from Firestore
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Don't block sign-in if profile load fails
          setUserProfile(null);
        }
      } else {
        // User is signed out - clear profile
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup: unsubscribe when component unmounts
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

