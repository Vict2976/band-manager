import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface Event {
  id?: string;
  title: string;
  type: 'rehearsal' | 'gig';
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:MM format
  location?: string;
  description?: string;
  attendees: string[]; // Array of user IDs
  bandId?: string; // Band association
  createdBy: string; // User ID who created the event
  // Financial fields
  gigEarnings?: number; // Amount earned from gig in DKK (only for gigs)
  createdAt: Date;
  updatedAt: Date;
}

export interface EventWithUserDetails extends Event {
  attendeeDetails?: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
    instrument?: string;
  }>;
}

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
  try {
    const now = new Date();
    const newEvent = {
      ...eventData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    
    return {
      id: docRef.id,
      ...newEvent,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDocs(query(collection(db, 'events'), where('__name__', '==', eventId)));
    if (eventDoc.empty) {
      return null;
    }
    
    const doc = eventDoc.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Event;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

export const getEventsByBandId = async (bandId: string): Promise<Event[]> => {
  try {
    // Use simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'events'),
      where('bandId', '==', bandId)
    );
    
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      } as Event);
    });

    // Sort by date in memory
    events.sort((a, b) => a.date.localeCompare(b.date));

    return events;
  } catch (error) {
    console.error('Error fetching events by band:', error);
    throw error;
  }
};

export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, 'events'),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const addAttendeeToEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    // First get the current event to avoid overwriting other fields
    const events = await getAllEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    const updatedAttendees = [...new Set([...event.attendees, userId])]; // Use Set to avoid duplicates
    
    await updateEvent(eventId, {
      attendees: updatedAttendees,
    });
  } catch (error) {
    console.error('Error adding attendee to event:', error);
    throw error;
  }
};

export const removeAttendeeFromEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    // First get the current event
    const events = await getAllEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    const updatedAttendees = event.attendees.filter(id => id !== userId);
    
    await updateEvent(eventId, {
      attendees: updatedAttendees,
    });
  } catch (error) {
    console.error('Error removing attendee from event:', error);
    throw error;
  }
};
