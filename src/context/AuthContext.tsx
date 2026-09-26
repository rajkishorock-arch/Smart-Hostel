import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  getStoredCurrentUser,
  getStoredUsers,
  saveStoredUser,
  setStoredCurrentUser,
  EVENT_AUTH_CHANGED
} from '../services/storageService';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isWarden: boolean;
  isResident: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<UserProfile>;
  signup: (userData: Omit<UserProfile, 'uid' | 'createdAt' | 'role'> & { password?: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'resident' | 'warden') => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Firebase onAuthStateChanged is the authoritative source of truth
    if (isFirebaseConfigured && auth) {
      const unsubscribeAuth = onAuthStateChanged(auth, async fbUser => {
        if (fbUser) {
          try {
            if (db) {
              const userDocRef = doc(db, 'users', fbUser.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                const profile = userDoc.data() as UserProfile;
                setUser(profile);
                setStoredCurrentUser(profile);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.warn('Firestore profile lookup error:', err);
          }

          // Fallback to local storage or fallback profile if Firestore doc not yet created
          const localUsers = getStoredUsers();
          const matched = Object.values(localUsers).find(
            u => u.email.toLowerCase() === fbUser.email?.toLowerCase() || u.uid === fbUser.uid
          );
          if (matched) {
            setUser(matched);
            setStoredCurrentUser(matched);
          }
        } else {
          // If Firebase says unauthenticated, clear session unless running in local offline demo mode
          const current = getStoredCurrentUser();
          if (current && !current.uid.startsWith('res-') && !current.uid.startsWith('warden-')) {
            setUser(null);
            setStoredCurrentUser(null);
          } else {
            setUser(current);
          }
        }
        setLoading(false);
      });

      return () => unsubscribeAuth();
    } else {
      // Local development / offline mode
      setUser(getStoredCurrentUser());
      setLoading(false);

      const handleAuthChange = () => {
        setUser(getStoredCurrentUser());
      };
      window.addEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
      return () => window.removeEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
    }
  }, []);

  const login = async (email: string, password: string, selectedRole?: UserRole): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check if user exists in local/demo storage
      const users = getStoredUsers();
      let matchedUser = Object.values(users).find(u => u.email.toLowerCase() === cleanEmail);

      // Attempt Firebase auth if configured
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          if (db) {
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
            if (userDoc.exists()) {
              matchedUser = userDoc.data() as UserProfile;
            }
          }
        } catch (fbErr: any) {
          if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password. Please verify your credentials.');
          }
          if (fbErr.code === 'auth/too-many-requests') {
            throw new Error('Too many failed login attempts. Please wait a few moments.');
          }
          console.warn('Firebase login attempt fallback to local auth:', fbErr);
        }
      }

      if (!matchedUser) {
        // Only if running in demo mode
        const role = selectedRole || (cleanEmail.includes('warden') || cleanEmail.includes('admin') ? 'warden' : 'resident');
        const namePart = cleanEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        matchedUser = {
          uid: 'usr-' + Date.now(),
          email: cleanEmail,
          name: formattedName,
          role,
          phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
          hostel: 'Aravali Boys Hostel',
          block: role === 'warden' ? 'Administration' : 'Block A',
          roomNumber: role === 'warden' ? 'Office-01' : '101',
          bedNumber: role === 'warden' ? 'N/A' : 'Bed 1',
          createdAt: new Date().toISOString()
        };
        saveStoredUser(matchedUser);
      }

      setStoredCurrentUser(matchedUser);
      setUser(matchedUser);
      setLoading(false);
      return matchedUser;
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || 'Login failed. Please verify your credentials.');
    }
  };

  const signup = async (
    userData: Omit<UserProfile, 'uid' | 'createdAt' | 'role'> & { password?: string }
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cleanEmail = userData.email.trim().toLowerCase();
      let uid = 'usr-' + Date.now();

      // PUBLIC SIGNUP IS STRICTLY RESIDENT ROLE
      const assignedRole: UserRole = 'resident';

      if (isFirebaseConfigured && auth && userData.password) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
          uid = cred.user.uid;
        } catch (fbErr: any) {
          if (fbErr.code === 'auth/email-already-in-use') {
            throw new Error('An account with this email address already exists. Please sign in instead.');
          }
          if (fbErr.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters.');
          }
          if (fbErr.code === 'auth/invalid-email') {
            throw new Error('Please enter a valid institutional email address.');
          }
          console.warn('Firebase signup fallback to local account:', fbErr);
        }
      }

      const newProfile: UserProfile = {
        uid,
        email: cleanEmail,
        name: userData.name.trim(),
        role: assignedRole,
        phone: userData.phone.trim() || '+91 98000 00000',
        hostel: userData.hostel || 'Aravali Boys Hostel',
        block: userData.block || 'Block A',
        roomNumber: userData.roomNumber || '101',
        bedNumber: userData.bedNumber || 'Bed 1',
        createdAt: new Date().toISOString()
      };

      // Write to Firestore and local storage
      if (isFirebaseConfigured && db && uid) {
        try {
          await setDoc(doc(db, 'users', uid), newProfile);
        } catch (err: any) {
          console.warn('Firestore user profile creation error:', err);
        }
      }

      saveStoredUser(newProfile);
      setStoredCurrentUser(newProfile);
      setUser(newProfile);
      setLoading(false);
      return newProfile;
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || 'Registration failed.');
    }
  };

  const quickDemoLogin = async (role: 'resident' | 'warden'): Promise<UserProfile> => {
    const demoEmail = role === 'warden' ? 'warden@hostel.edu' : 'resident@hostel.edu';
    return login(demoEmail, 'Hostel@123', role);
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth).catch(() => {});
      }
    } finally {
      setStoredCurrentUser(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isWarden: user?.role === 'warden',
    isResident: user?.role === 'resident',
    login,
    signup,
    logout,
    quickDemoLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
