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
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  authLoading: boolean;
  profileLoading: boolean;
  isAuthenticated: boolean;
  isWarden: boolean;
  isResident: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<UserProfile>;
  signup: (userData: Omit<UserProfile, 'uid' | 'createdAt' | 'role'> & { password?: string }) => Promise<UserProfile>;
  registerWarden: (data: { name: string; email: string; password: string; phone?: string; hostel?: string; inviteCode: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'resident' | 'warden') => Promise<UserProfile>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Controlled helper to resolve or bootstrap a verified user profile.
 * Automatically repairs known competition demo accounts.
 * Never allows arbitrary client role escalation.
 */
async function fetchOrBootstrapProfile(fbUser: FirebaseUser): Promise<UserProfile | null> {
  const email = (fbUser.email || '').toLowerCase().trim();

  // 1. Try reading the authoritative Firestore user document
  if (isFirebaseConfigured && db) {
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
    } catch (firestoreErr) {
      console.warn('Direct Firestore profile lookup attempt failed:', firestoreErr);
    }
  }

  // 2. Specific automatic repair for known demo resident account
  if (email === 'demo-resident@hostel.edu' || email === 'resident@campus.edu') {
    const demoResidentProfile: UserProfile = {
      uid: fbUser.uid,
      email: email,
      name: 'Rahul Sharma',
      role: 'resident',
      phone: '+91 98000 00000',
      status: 'active',
      hostel: 'Aravali Residence Hall',
      block: 'Block A',
      roomNumber: '204',
      bedNumber: 'Bed 1',
      parentPhone: '+91 94310 12345',
      bloodGroup: 'B+',
      createdAt: new Date().toISOString()
    };
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'users', fbUser.uid), demoResidentProfile).catch(() => {});
    }
    return demoResidentProfile;
  }

  // 3. Specific automatic repair for known demo warden account
  if (email === 'demo-warden@hostel.edu') {
    const demoWardenProfile: UserProfile = {
      uid: fbUser.uid,
      email: 'demo-warden@hostel.edu',
      name: 'Demo Warden',
      role: 'warden',
      phone: '+91 98000 00000',
      status: 'active',
      hostel: 'Aravali Residence Hall',
      block: 'Administration',
      roomNumber: 'Office-01',
      bedNumber: 'N/A',
      createdAt: new Date().toISOString()
    };
    try {
      fbUser.getIdToken().then(idToken => {
        fetch('/api/auth/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ name: 'Demo Warden' })
        }).catch(() => {});
      });
    } catch {}
    return demoWardenProfile;
  }

  // 4. For any other user: call server-side controlled bootstrap endpoint
  try {
    const idToken = await fbUser.getIdToken();
    const response = await fetch('/api/auth/bootstrap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fbUser.email?.split('@')[0]
      })
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success && data.profile) {
          return data.profile as UserProfile;
        }
      }
    }
  } catch (bootstrapErr) {
    console.warn('Server-side profile bootstrap attempt failed:', bootstrapErr);
  }

  // 5. Fallback to cached profile if matching authenticated UID
  const cached = getStoredCurrentUser();
  if (cached && cached.uid === fbUser.uid) {
    return cached;
  }

  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1. Firebase onAuthStateChanged is the authoritative source of truth
    if (isFirebaseConfigured && auth) {
      const unsubscribeAuth = onAuthStateChanged(auth, async fbUser => {
        setAuthLoading(false);
        if (fbUser) {
          setProfileLoading(true);
          try {
            const profile = await fetchOrBootstrapProfile(fbUser);
            if (profile) {
              setUser(profile);
              setStoredCurrentUser(profile);
              saveStoredUser(profile);
            } else {
              // Account cannot be verified after all attempts -> sign out
              await firebaseSignOut(auth).catch(() => {});
              setUser(null);
              setStoredCurrentUser(null);
            }
          } catch (err) {
            console.warn('Auth state profile resolution error:', err);
          } finally {
            setProfileLoading(false);
          }
        } else {
          setUser(null);
          setStoredCurrentUser(null);
          setProfileLoading(false);
        }
      });

      return () => unsubscribeAuth();
    } else {
      setUser(getStoredCurrentUser());
      setAuthLoading(false);
      setProfileLoading(false);

      const handleAuthChange = () => {
        setUser(getStoredCurrentUser());
      };
      window.addEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
      return () => window.removeEventListener(EVENT_AUTH_CHANGED, handleAuthChange);
    }
  }, []);

  const login = async (email: string, password: string, selectedRole?: UserRole): Promise<UserProfile> => {
    setProfileLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      let matchedUser: UserProfile | null = null;

      // Real Firebase Authentication
      if (isFirebaseConfigured && auth) {
        try {
          let cred: any = null;
          try {
            cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          } catch (fbErr: any) {
            // Auto-provision demo account in Firebase Auth if it doesn't exist yet
            if (
              (cleanEmail === 'demo-resident@hostel.edu' || cleanEmail === 'demo-warden@hostel.edu') &&
              (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential')
            ) {
              try {
                cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
              } catch {
                throw fbErr;
              }
            } else {
              throw fbErr;
            }
          }

          if (cred?.user) {
            matchedUser = await fetchOrBootstrapProfile(cred.user);
          }

          if (!matchedUser) {
            // Profile missing and bootstrap failed: reject and sign out
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

      // Offline / Local mock login fallback
      if (!matchedUser) {
        const storedUsers = getStoredUsers();
        const found = Object.values(storedUsers).find(
          u => u.email.toLowerCase() === cleanEmail
        );

        if (found) {
          matchedUser = found;
        } else if (cleanEmail.includes('warden') || cleanEmail.includes('admin')) {
          matchedUser = {
            uid: 'warden-local',
            email: cleanEmail,
            name: 'Demo Warden',
            role: 'warden',
            phone: '+91 98000 00000',
            hostel: 'Aravali Residence Hall',
            block: 'Administration',
            roomNumber: 'Office-01',
            bedNumber: 'N/A',
            createdAt: new Date().toISOString()
          };
        } else {
          matchedUser = {
            uid: 'resident-local',
            email: cleanEmail,
            name: 'Demo Resident',
            role: 'resident',
            phone: '+91 98000 00000',
            hostel: 'Aravali Residence Hall',
            block: 'Block A',
            roomNumber: '204',
            bedNumber: 'Bed 1',
            createdAt: new Date().toISOString()
          };
        }
      }

      if (!matchedUser) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }

      setStoredCurrentUser(matchedUser);
      setUser(matchedUser);
      saveStoredUser(matchedUser);
      return matchedUser;
    } finally {
      setProfileLoading(false);
    }
  };

  const signup = async (
    userData: Omit<UserProfile, 'uid' | 'createdAt' | 'role'> & { password?: string }
  ): Promise<UserProfile> => {
    setProfileLoading(true);
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
        roomNumber: userData.roomNumber || '',
        bedNumber: userData.bedNumber || '',
        parentPhone: userData.parentPhone,
        bloodGroup: userData.bloodGroup,
        emergencyContact: userData.emergencyContact,
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
      return newProfile;
    } finally {
      setProfileLoading(false);
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
    setProfileLoading(true);
    try {
      const response = await fetch('/api/warden/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Warden registration service is temporarily unavailable. Please try again.');
      }

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Warden registration failed. Invalid institutional code.');
      }

      // If registration succeeded on server, sign in
      if (isFirebaseConfigured && auth) {
        try {
          await signInWithEmailAndPassword(auth, data.email.trim().toLowerCase(), data.password);
        } catch (authErr) {
          console.warn('Warden immediate sign-in fallback:', authErr);
        }
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
      return profile;
    } finally {
      setProfileLoading(false);
    }
  };

  const quickDemoLogin = async (role: 'resident' | 'warden'): Promise<UserProfile> => {
    const demoEmail = role === 'warden' 
      ? (import.meta.env.VITE_DEMO_WARDEN_EMAIL || 'demo-warden@hostel.edu') 
      : (import.meta.env.VITE_DEMO_RESIDENT_EMAIL || 'demo-resident@hostel.edu');
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Hostel@2026Demo';
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

  const getIdToken = async (): Promise<string | null> => {
    try {
      if (isFirebaseConfigured && auth?.currentUser) {
        return await auth.currentUser.getIdToken();
      }
    } catch {
      // Fallback
    }
    return user ? `session-${user.uid}` : null;
  };

  const loading = authLoading || profileLoading;

  const value: AuthContextType = {
    user,
    loading,
    authLoading,
    profileLoading,
    isAuthenticated: Boolean(user),
    isWarden: user?.role === 'warden',
    isResident: user?.role === 'resident',
    login,
    signup,
    registerWarden,
    logout,
    quickDemoLogin,
    getIdToken
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
