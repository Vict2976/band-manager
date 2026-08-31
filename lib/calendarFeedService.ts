import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * The subscription URL carries an unguessable token because Google and Apple
 * fetch it anonymously — there is no way to put a login in front of it, so the
 * URL itself is the secret. Treat it like a password: anyone holding it can
 * read the band's schedule.
 */

const feedRef = doc(db, 'config', 'calendarFeed');

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Read the current feed token, creating one on first use. */
export async function getOrCreateFeedToken(): Promise<string> {
  const snap = await getDoc(feedRef);
  const existing = snap.exists() ? (snap.data().token as string | undefined) : undefined;
  if (existing) return existing;

  const token = newToken();
  await setDoc(feedRef, { token, createdAt: Timestamp.now() }, { merge: true });
  return token;
}

/** Issue a new token. Every existing subscription stops updating. */
export async function rotateFeedToken(): Promise<string> {
  const token = newToken();
  await setDoc(feedRef, { token, rotatedAt: Timestamp.now() }, { merge: true });
  return token;
}

export function feedUrl(token: string, origin: string): string {
  return `${origin}/api/calendar/${token}.ics`;
}
