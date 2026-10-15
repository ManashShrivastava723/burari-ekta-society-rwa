// ============================================================
// Firebase initialization
// Uses environment variables — never hardcoded credentials.
// In demo mode (VITE_APP_MODE=demo) Firebase is not initialized.
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Check for live mode - if VITE_APP_MODE is explicitly set to "live", use live mode
// Otherwise, only use demo mode if explicitly set to "demo" or if API key is missing
const isDemoMode = import.meta.env.VITE_APP_MODE === 'live' 
  ? false 
  : (
    import.meta.env.VITE_APP_MODE === 'demo' ||
    !import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY === 'your-firebase-api-key'
  );

// Debug logging (only in dev)
if (import.meta.env.DEV) {
  console.log('🔧 Firebase Config Debug:', {
    isDemoMode,
    VITE_APP_MODE: import.meta.env.VITE_APP_MODE,
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    apiKeyPreview: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...'
  });
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!isDemoMode) {
  const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  app     = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, isDemoMode };
