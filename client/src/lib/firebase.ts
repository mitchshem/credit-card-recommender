/**
 * Firebase Configuration & Initialization
 * 
 * This file sets up Firebase for the entire application. It:
 * 1. Loads configuration from environment variables
 * 2. Initializes Firebase services (Auth, Firestore)
 * 3. Configures authentication providers (Google, Apple)
 * 4. Exports ready-to-use instances for the rest of the app
 * 
 * IMPORTANT SECURITY NOTE:
 * The config values here are PUBLIC and safe to expose in client-side code.
 * They are NOT secrets - Firebase Security Rules protect your data, not these keys.
 * However, never commit real credentials to version control - use .env files.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider,
  OAuthProvider 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase Configuration Object
 * 
 * These values come from your Firebase project settings.
 * Get them from: Firebase Console > Project Settings > General > Your apps
 * 
 * Why environment variables?
 * - Keeps config out of source code
 * - Easy to switch between dev/staging/prod
 * - Prevents accidental commits of real credentials
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id"
};

/**
 * Initialize Firebase App
 * 
 * This creates the main Firebase app instance that all services will use.
 * If Firebase is already initialized, initializeApp will use the existing instance.
 */
const app: FirebaseApp = initializeApp(firebaseConfig);

/**
 * Firebase Authentication Instance
 * 
 * Use this to:
 * - Sign users in/out
 * - Listen to auth state changes
 * - Access current user info
 * 
 * Example: import { auth } from './lib/firebase';
 */
export const auth: Auth = getAuth(app);

/**
 * Firestore Database Instance
 * 
 * Use this to:
 * - Read/write user documents
 * - Query collections
 * - Listen to real-time updates
 * 
 * Example: import { db } from './lib/firebase';
 */
export const db: Firestore = getFirestore(app);

/**
 * Google Authentication Provider
 * 
 * Configured for Google Sign-In. Firebase will handle the OAuth flow.
 * 
 * Customization options:
 * - googleProvider.addScope('email') - Request email permission
 * - googleProvider.setCustomParameters({ prompt: 'select_account' }) - Force account selection
 */
export const googleProvider = new GoogleAuthProvider();
// Request email and profile scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
// Force account selection (useful for testing with multiple Google accounts)
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Apple Authentication Provider
 * 
 * Note: Apple Sign-In requires additional setup:
 * 1. Apple Developer account ($99/year)
 * 2. Configure service ID in Apple Developer Console
 * 3. Add domain verification in Firebase Console
 */
export const appleProvider = new OAuthProvider('apple.com');

/**
 * Development-only: Log Firebase initialization
 * 
 * Only logs in development mode to verify config is loaded.
 * Never log sensitive data in production!
 */
if (process.env.NODE_ENV === 'development') {
  console.log('✅ Firebase initialized:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    // Don't log full config in production - too verbose
  });
}

// Export the app instance for advanced use cases
export default app;
