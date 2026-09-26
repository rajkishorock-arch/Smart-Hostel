import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Active Firebase project configuration for Smart Hostel & Mess Administration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCKZIGqWceKfPef9ZO5E4-NX4rGujgAbF8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-hostel-and-mess.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-hostel-and-mess',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-hostel-and-mess.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '645112702234',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:645112702234:web:051c3f70f1ba34a872b8a3'
};

export const isFirebaseConfigured = true;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization error, retrying fallback:', error);
  app = initializeApp(firebaseConfig, 'SmartHostelAppFallback');
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
