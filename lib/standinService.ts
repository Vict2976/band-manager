import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// One shared free-text list of stand-ins: names, contact, instrument/role.
const standinsDocRef = doc(db, 'standins', 'shared');

/** Subscribe to the shared stand-in list in real time. */
export function subscribeToStandins(
  onChange: (text: string) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    standinsDocRef,
    (snap) => onChange((snap.data()?.text as string) || ''),
    (err) => onError?.(err)
  );
}

export async function saveStandins(text: string): Promise<void> {
  await setDoc(standinsDocRef, { text, updatedAt: Timestamp.now() }, { merge: true });
}
