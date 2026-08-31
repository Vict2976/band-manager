import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Reuse the existing app across hot reloads instead of initializing twice.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Pin the session to durable, cross-restart storage.
 *
 * Firebase refresh tokens don't expire, so the only thing that ends a session
 * is the token going missing from browser storage. Left implicit, the SDK can
 * quietly fall back to in-memory persistence (e.g. when localStorage is
 * unavailable), which signs you out the moment the tab closes. Pinning it —
 * IndexedDB first, localStorage as a fallback — keeps the session alive
 * indefinitely across restarts.
 *
 * Await this before signing in so the credential is written to the right store.
 */
export const authPersistenceReady: Promise<void> =
  typeof window === 'undefined'
    ? Promise.resolve()
    : setPersistence(auth, indexedDBLocalPersistence)
        .catch(() => setPersistence(auth, browserLocalPersistence))
        .catch((err) => {
          console.error('Could not enable persistent auth storage:', err);
        });

export default app;
