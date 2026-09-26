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
  registerWarden: (data: { name: string; email: string; password: string; phone?: string; hostel?: string; inviteCode: string }) => Promise<UserProfile>;
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

          // No verified profile document in Firestore: reject and sign out immediately
          await firebaseSignOut(auth).catch(() => {});
          setUser(null);
          setStoredCurrentUser(null);
          setLoading(false);
        } else {
          setUser(null);
          setStoredCurrentUser(null);
          setLoading(false);
        }
      });

      return () => unsubscribeAuth();
    } else {
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
      let matchedUser: UserProfile | null = null;

      // Real Firebase Authentication
      if (isFirebaseConfigured && auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          if (db) {
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
            if (userDoc.exists()) {
              matchedUser = userDoc.data() as UserProfile;
            }
          }

          if (!matchedUser) {
            // Document missing in Firestore: Reject and immediately sign out
            await firebaseSignOut(auth).catch(() => {});
            throw new Error('Your account profile could not be verified. Please register your account profile or contact hostel administration.');
          }
        } catch (fbErr: any) {
          if (
            fbErr.code === 'auth/invalid-credential' ||
            fbErr.code === 'auth/user-not-found' ||
            fbErr.code === 'auth/wrong-password' ||
            fbErr.code === 'auth/invalid-email'
          ) {
            throw new Error('Invalid email or password. Please verify your credentials.');
          }
          if (fbErr.code === 'auth/too-many-requests') {
            throw new Error('Too many failed login attempts. Please wait a few moments.');
          }
          if (fbErr.message && fbErr.message.includes('profile could not be verified')) {
            throw fbErr;
          }
          console.warn('Firebase login attempt fallback to local auth:', fbErr);
        }
      }

      if (!matchedUser) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }

      // If user selected "Warden" portal on login page, verify they actually have the warden role
      if (selectedRole === 'warden' && matchedUser.role !== 'warden') {
        throw new Error('Warden access is not enabled for this account.');
      }

      setStoredCurrentUser(matchedUser);
      setUser(matchedUser);
      saveStoredUser(matchedUser);
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

      // PUBLIC SIGNUP IS STRICTLY RESIDENT ROLE - CANNOT BE OVERRIDDEN
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
          throw fbErr;
        }
      }

      const newProfile: UserProfile = {
        uid,
        email: cleanEmail,
        name: userData.name.trim(),
        role: assignedRole,
        phone: userData.phone.trim() || '+91 98000 00000',
        hostel: userData.hostel || 'Aravali Residence Hall',
        block: userData.block || 'Block A',
        roomNumber: userData.roomNumber || '204',
        bedNumber: userData.bedNumber || 'Bed 2',
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

  const registerWarden = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    hostel?: string;
    inviteCode: string;
  }): Promise<UserProfile> => {
    setLoading(true);
    try {
      const response = await fetch('/api/warden/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const contentType = response.headers.get('content-type') || '';
      let result: any = null;
      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || result?.error || 'Warden registration service is temporarily unavailable.');
      }

      // Sign in client Firebase Auth
      if (isFirebaseConfigured && auth && data.password) {
        await signInWithEmailAndPassword(auth, data.email.trim().toLowerCase(), data.password).catch(() => {});
      }

      const profile: UserProfile = result.profile || {
        uid: result.uid || 'warden-' + Date.now(),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: 'warden',
        phone: data.phone || '+91 98000 00000',
        hostel: data.hostel || 'Aravali Residence Hall',
        block: 'Administration',
        roomNumber: 'Office-01',
        bedNumber: 'N/A',
        createdAt: new Date().toISOString()
      };
      setStoredCurrentUser(profile);
      setUser(profile);
      saveStoredUser(profile);
      setLoading(false);
      return profile;
    } catch (err: any) {
      setLoading(false);
      throw new Error(err?.message || 'Warden registration failed.');
    }
  };

  const quickDemoLogin = async (role: 'resident' | 'warden'): Promise<UserProfile> => {
    if (import.meta.env.VITE_DEMO_MODE !== 'true') {
      throw new Error('Demo login access is disabled in production.');
    }
    const demoEmail = role === 'warden' 
      ? (import.meta.env.VITE_DEMO_WARDEN_EMAIL || 'demo-warden@hostel.edu') 
      : (import.meta.env.VITE_DEMO_RESIDENT_EMAIL || 'demo-resident@hostel.edu');
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
    if (!demoPassword) {
      throw new Error('Demo mode is enabled but VITE_DEMO_PASSWORD is not configured in environment.');
    }
    return login(demoEmail, demoPassword, role);
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
    registerWarden,
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
