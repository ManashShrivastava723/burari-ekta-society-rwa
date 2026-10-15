// ============================================================
// Auth Context — wraps Firebase Authentication
// In demo mode, simulates auth with clearly labeled demo user.
// ============================================================

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode
} from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  doc, getDoc
} from 'firebase/firestore';
import { auth, db, isDemoMode } from '../lib/firebase';
import type { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthorized: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_HIERARCHY: Record<UserRole, number> = {
  superAdmin: 4,
  rwaAdmin:   3,
  staff:      2,
  resident:   1,
};

// Demo admin — clearly labeled, no real Firebase involved
const DEMO_ADMIN_PROFILE: UserProfile = {
  uid:         'demo-admin-uid',
  email:       'demo-admin@example.com',
  displayName: '[DEMO] Admin User',
  role:        'rwaAdmin',
  isActive:    true,
  createdAt:   new Date('2024-01-01'),
  updatedAt:   new Date('2024-01-01'),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore (live mode only)
  const fetchProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          uid,
          email:       data.email       ?? '',
          displayName: data.displayName ?? '',
          role:        data.role        ?? 'resident',
          flatNumber:  data.flatNumber,
          phone:       data.phone,
          isActive:    data.isActive    ?? true,
          createdAt:   data.createdAt?.toDate() ?? new Date(),
          updatedAt:   data.updatedAt?.toDate() ?? new Date(),
        };
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
    return null;
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      // Not authenticated by default — admin must "log in" through demo modal
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await fetchProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode: accept demo credentials, set demo profile
      if (email === 'demo@admin.com' && password === 'demo1234') {
        setProfile(DEMO_ADMIN_PROFILE);
        return;
      }
      throw new Error('Demo mode: use demo@admin.com / demo1234');
    }
    if (!auth) throw new Error('Firebase not configured.');
    await signInWithEmailAndPassword(auth, email, password);
    // profile is set by onAuthStateChanged above
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setProfile(null);
      return;
    }
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (isDemoMode) {
      throw new Error('Password reset is not available in demo mode.');
    }
    if (!auth) throw new Error('Firebase not configured.');
    await sendPasswordResetEmail(auth, email);
  }, []);

  const isAuthorized = useCallback((requiredRole: UserRole): boolean => {
    if (!profile || !profile.isActive) return false;
    return ROLE_HIERARCHY[profile.role] >= ROLE_HIERARCHY[requiredRole];
  }, [profile]);

  const value: AuthContextValue = {
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    isDemoMode,
    signIn,
    signOut,
    resetPassword,
    isAuthorized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
