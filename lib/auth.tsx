'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, authPersistenceReady } from './firebase';
import { sessionService, SessionUser } from './sessionService';

interface AuthContextType {
  user: User | null;
  sessionUser: SessionUser | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// @uxid lib/auth::AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const session = sessionService.getSession();
    if (session.isAuthenticated && session.user) {
      setSessionUser(session.user);
      setIsAuthenticated(true);
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Re-issue the session cookie on every load so its 400-day window keeps
        // rolling forward for as long as the band keeps using the app.
        const sessionUserData: SessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };
        
        setSessionUser(sessionUserData);
        setIsAuthenticated(true);
        sessionService.setSession(sessionUserData, true);
      } else {
        // No persisted credential — the stale cookie would only cause a
        // logged-in flash before bouncing to /login, so drop it.
        sessionService.clearSession();
        setSessionUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      // Make sure durable storage is selected before the credential is written,
      // otherwise it can land in a store that dies with the tab.
      await authPersistenceReady;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const sessionUserData: SessionUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      };
      
      setSessionUser(sessionUserData);
      setIsAuthenticated(true);
      sessionService.setSession(sessionUserData, rememberMe);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      sessionService.clearSession();
      setUser(null);
      setSessionUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    sessionUser,
    loading,
    signIn,
    signOut,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
