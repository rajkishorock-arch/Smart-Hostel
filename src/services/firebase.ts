import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Read Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoSmartHostelKey2026ValidMock',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-hostel-and-mess.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-hostel-and-mess',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-hostel-and-mess.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '829102938475',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:829102938475:web:7f6a9c1e2b3d4e5f'
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('your_api_key_here')
);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization note: using smart integrated store mode.', error);
  // Re-attempt minimal fallback
  app = initializeApp(firebaseConfig, 'SmartHostelAppFallback');
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
