import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  wallet?: string[];
  preferences?: {
    defaultCards?: string[];
    favoriteCategories?: string[];
  };
  createdAt?: any;
  lastLogin?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  loginWithApple: () => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(userCredential.user, {
      displayName
    });

    // Create user profile in Firestore
    const profile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      photoURL: userCredential.user.photoURL || undefined,
      wallet: [],
      preferences: {
        defaultCards: [],
        favoriteCategories: []
      },
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), profile);
    
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create new profile
      const profile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'User',
        photoURL: result.user.photoURL || undefined,
        wallet: [],
        preferences: {
          defaultCards: [],
          favoriteCategories: []
        },
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), profile);
    } else {
      // Update last login
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    
    return result;
  };

  const loginWithApple = async () => {
    const result = await signInWithPopup(auth, appleProvider);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create new profile
      const profile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'User',
        photoURL: result.user.photoURL || undefined,
        wallet: [],
        preferences: {
          defaultCards: [],
          favoriteCategories: []
        },
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), profile);
    } else {
      // Update last login
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const userDoc = doc(db, 'users', currentUser.uid);
    await setDoc(userDoc, data, { merge: true });
    
    // Reload profile
    const updatedDoc = await getDoc(userDoc);
    if (updatedDoc.exists()) {
      setUserProfile(updatedDoc.data() as UserProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      }
      
      setLoading(false);
    });

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
