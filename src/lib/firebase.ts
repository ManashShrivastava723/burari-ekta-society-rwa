// ============================================================
// Firebase initialization
// Uses environment variables — never hardcoded credentials.
// In demo mode (VITE_APP_MODE=demo) Firebase is not initialized.
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// FORCE LIVE MODE - environment variables not working in build
const isDemoMode = false;

// Debug logging
console.log('🔧 Firebase Mode: LIVE (forced)');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!isDemoMode) {
  const firebaseConfig = {
    apiKey:            "AIzaSyAx1fU2G88K-IiOEjnfsFDiTCxGwt_DArQ",
    authDomain:        "burari-ekta-society-rwa.firebaseapp.com",
    projectId:         "burari-ekta-society-rwa",
    storageBucket:     "burari-ekta-society-rwa.firebasestorage.app",
    messagingSenderId: "1051927920323",
    appId:             "1:1051927920323:web:48bea42053dfc72f7d2c76",
  };

  app     = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, isDemoMode };
