import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  role: 'client' | 'admin' | 'staff';
  loyaltyPoints?: number;
  createdAt?: string;
  photoURL?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile from Firestore
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create firestore document
        const userDocRef = doc(db, 'users', user.uid);
        
        unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // First time creating user doc if missing
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'VIP Client',
              phoneNumber: user.phoneNumber || '',
              role: 'client',
              loyaltyPoints: 100, // Welcome gift points
              createdAt: new Date().toISOString(),
              photoURL: user.photoURL || null
            };
            try {
              await setDoc(userDocRef, initialProfile);
              setUserProfile(initialProfile);
            } catch (err) {
              console.warn('Failed to seed user doc in firestore:', err);
              setUserProfile(initialProfile);
            }
          }
          setLoading(false);
        }, (err) => {
          console.warn('Profile snapshot error:', err);
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string, phone?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        phoneNumber: phone || '',
        role: 'client',
        loyaltyPoints: 150, // Welcome bonus points
        createdAt: new Date().toISOString(),
        photoURL: null
      };
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const signInGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      const userDocRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || 'VIP Client',
          phoneNumber: res.user.phoneNumber || '',
          role: 'client',
          loyaltyPoints: 150,
          createdAt: new Date().toISOString(),
          photoURL: res.user.photoURL || null
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      signInEmail,
      signUpEmail,
      signInGoogle,
      logOut,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
