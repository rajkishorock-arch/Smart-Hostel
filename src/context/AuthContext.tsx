import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  getStoredCurrentUser,
  getStoredUsers,
  saveStoredUser,
  setStoredCurrentUser,
  EVENT_AUTH_CHANGED
} from '../services/storageService';
import { auth, isFirebaseConfigured } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isWarden: boolean;
  isResident: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<UserProfile>;
  signup: (userData: Omit<UserProfile, 'uid' | 'createdAt'> & { password?: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'resident' | 'warden') => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial load
    const current = getStoredCurrentUser();
    setUser(current);
    setLoading(false);

    const handleAuthChange = () => {
      setUser(getStoredCurrentUser());
    };

    window.addEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
    return () => window.removeEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
  }, []);

  const login = async (email: string, password: string, selectedRole?: UserRole): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check if user exists in local/synced storage
      const users = getStoredUsers();
      let matchedUser = Object.values(users).find(u => u.email.toLowerCase() === cleanEmail);

      // Attempt Firebase auth if configured
      if (isFirebaseConfigured && auth) {
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (fbErr) {
          console.warn('Firebase login attempt fallback to local auth:', fbErr);
        }
      }

      if (!matchedUser) {
        // If not found in seed, create a profile on the fly with the selected role or default resident
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
    userData: Omit<UserProfile, 'uid' | 'createdAt'> & { password?: string }
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      const cleanEmail = userData.email.trim().toLowerCase();
      let uid = 'usr-' + Date.now();

      if (isFirebaseConfigured && auth && userData.password) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
          uid = cred.user.uid;
        } catch (fbErr: any) {
          console.warn('Firebase signup fallback to local account:', fbErr);
        }
      }

      const newProfile: UserProfile = {
        uid,
        email: cleanEmail,
        name: userData.name.trim(),
        role: userData.role,
        phone: userData.phone.trim() || '+91 98000 00000',
        hostel: userData.hostel || 'Aravali Boys Hostel',
        block: userData.block || (userData.role === 'warden' ? 'Administration' : 'Block A'),
        roomNumber: userData.roomNumber || (userData.role === 'warden' ? 'Admin-01' : '101'),
        bedNumber: userData.bedNumber || (userData.role === 'warden' ? 'N/A' : 'Bed 1'),
        createdAt: new Date().toISOString()
      };

      saveStoredUser(newProfile);
      setStoredCurrentUser(newProfile);
      setUser(newProfile);
      setLoading(false);
      return newProfile;
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || 'Signup failed.');
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
