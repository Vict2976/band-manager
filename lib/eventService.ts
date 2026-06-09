import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type EventType = 'gig' | 'rehearsal';

export interface BandEvent {
  id: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (optional)
  text: string; // free text — "what it is"
  createdAt?: Date;
  updatedAt?: Date;
}

export type NewEvent = Omit<BandEvent, 'id' | 'createdAt' | 'updatedAt'>;

const eventsRef = collection(db, 'events');

/** Subscribe to all events in real time, sorted by date then time. */
export function subscribeToEvents(
  onChange: (events: BandEvent[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(eventsRef, orderBy('date', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          type: data.type,
          date: data.date,
          time: data.time || '',
          text: data.text || '',
        } as BandEvent;
      });
      events.sort(
        (a, b) =>
          a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')
      );
      onChange(events);
    },
    (err) => onError?.(err)
  );
}

/** Subscribe to a single event in real time. Calls back with null if it doesn't exist. */
export function subscribeToEvent(
  id: string,
  onChange: (event: BandEvent | null) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    doc(db, 'events', id),
    (snap) => {
      if (!snap.exists()) {
        onChange(null);
        return;
      }
      const data = snap.data();
      onChange({
        id: snap.id,
        type: data.type,
        date: data.date,
        time: data.time || '',
        text: data.text || '',
      });
    },
    (err) => onError?.(err)
  );
}

export async function createEvent(data: NewEvent): Promise<void> {
  const payload: Record<string, unknown> = {
    type: data.type,
    date: data.date,
    text: data.text.trim(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  if (data.time) payload.time = data.time;
  await addDoc(eventsRef, payload);
}

export async function updateEvent(id: string, data: NewEvent): Promise<void> {
  await updateDoc(doc(db, 'events', id), {
    type: data.type,
    date: data.date,
    time: data.time || '',
    text: data.text.trim(),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'events', id));
}
