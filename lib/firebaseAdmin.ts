import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { cert, getApps, initializeApp, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Server-side Firestore, used by the calendar feed route.
 *
 * The feed is fetched by Google and Apple, which can't sign in, so it can't go
 * through the client SDK's authenticated path — it reads with admin
 * credentials and is protected by the unguessable token in its URL instead.
 */

function loadCredentials(): ServiceAccount {
  // Preferred in deployment: the whole service-account JSON in one env var,
  // raw or base64-encoded (base64 avoids newline mangling in some dashboards).
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const json = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(json) as ServiceAccount;
  }

  // Local development: fall back to the service-account file in the repo root.
  // It's gitignored, so this path only ever exists on a developer's machine.
  const file = readdirSync(process.cwd()).find(
    (f) => f.includes('-firebase-adminsdk-') && f.endsWith('.json')
  );
  if (file) {
    return JSON.parse(readFileSync(join(process.cwd(), file), 'utf8')) as ServiceAccount;
  }

  throw new Error(
    'No Firebase admin credentials. Set FIREBASE_SERVICE_ACCOUNT to the ' +
      'service-account JSON (raw or base64) in your environment.'
  );
}

let cached: Firestore | null = null;

export function adminDb(): Firestore {
  if (cached) return cached;
  const app: App =
    getApps().find((a) => a.name === 'admin') ??
    initializeApp({ credential: cert(loadCredentials()) }, 'admin');
  cached = getFirestore(app);
  return cached;
}
