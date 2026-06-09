import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// The whole band shares a single "what we have" gear document.
const gearDocRef = doc(db, 'gear', 'shared');

/** Subscribe to the shared gear text in real time. */
export function subscribeToGear(
  onChange: (text: string) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    gearDocRef,
    (snap) => onChange((snap.data()?.text as string) || ''),
    (err) => onError?.(err)
  );
}

export async function saveGear(text: string): Promise<void> {
  await setDoc(gearDocRef, { text, updatedAt: Timestamp.now() }, { merge: true });
}

// --- Per-member "what we need" notes ---
// Fixed band roster — one note document per member, keyed by name.
export const BAND_MEMBERS = [
  'Kasper',
  'Rune',
  'Adam',
  'Marius',
  'Victor',
  'Sara',
  'Emma',
  'Oliver',
  'Tobias',
] as const;

const needsRef = collection(db, 'gearNeeds');

/** Subscribe to all members' needs notes as a name → text map. */
export function subscribeToNeeds(
  onChange: (notes: Record<string, string>) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    needsRef,
    (snap) => {
      const notes: Record<string, string> = {};
      snap.forEach((d) => {
        notes[d.id] = (d.data().text as string) || '';
      });
      onChange(notes);
    },
    (err) => onError?.(err)
  );
}

export async function saveNeed(member: string, text: string): Promise<void> {
  await setDoc(doc(db, 'gearNeeds', member), { text, updatedAt: Timestamp.now() }, { merge: true });
}
