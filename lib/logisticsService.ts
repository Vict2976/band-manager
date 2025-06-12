import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface EventLogistics {
  id?: string;
  eventId: string;
  userId: string; // Who is providing the vehicle
  vehicleType: 'car' | 'van' | 'truck' | 'bus' | 'other';
  vehicleName?: string; // Optional name/description of the vehicle
  capacity: number; // How many people can fit
  departureLocation: string; // Where they're leaving from
  arrivalLocation?: string; // Where they're going (might be same as event location)
  departureTime?: string; // When they're leaving
  returnTime?: string; // When they're coming back
  notes?: string; // Additional notes about the ride
  passengers: string[]; // Array of user IDs who are riding along
  // Financial fields
  distance?: number; // Total distance in km (round trip)
  fuelCost?: number; // Estimated fuel cost in DKK
  tollCost?: number; // Road tolls in DKK
  wearAndTear?: number; // Vehicle wear compensation in DKK
  createdAt: Date;
  updatedAt: Date;
}

export interface LogisticsWithUserDetails extends EventLogistics {
  driverDetails?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    instrument?: string;
  };
  passengerDetails?: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
    instrument?: string;
  }>;
}

export const createEventLogistics = async (logisticsData: Omit<EventLogistics, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventLogistics> => {
  try {
    const now = new Date();
    const newLogistics = {
      ...logisticsData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'eventLogistics'), newLogistics);
    
    return {
      id: docRef.id,
      ...newLogistics,
    };
  } catch (error) {
    console.error('Error creating event logistics:', error);
    throw error;
  }
};

export const getEventLogistics = async (eventId: string): Promise<EventLogistics[]> => {
  try {
    const q = query(
      collection(db, 'eventLogistics'),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);
    const logistics: EventLogistics[] = [];
    
    querySnapshot.forEach((doc) => {
      logistics.push({
        id: doc.id,
        ...doc.data(),
      } as EventLogistics);
    });
    
    // Sort by departure time on the client side
    return logistics.sort((a, b) => {
      if (!a.departureTime && !b.departureTime) return 0;
      if (!a.departureTime) return 1;
      if (!b.departureTime) return -1;
      return a.departureTime.localeCompare(b.departureTime);
    });
  } catch (error) {
    console.error('Error fetching event logistics:', error);
    throw error;
  }
};

export const updateEventLogistics = async (logisticsId: string, updates: Partial<EventLogistics>): Promise<void> => {
  try {
    const logisticsRef = doc(db, 'eventLogistics', logisticsId);
    await updateDoc(logisticsRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating event logistics:', error);
    throw error;
  }
};

export const deleteEventLogistics = async (logisticsId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'eventLogistics', logisticsId));
  } catch (error) {
    console.error('Error deleting event logistics:', error);
    throw error;
  }
};

export const addPassengerToLogistics = async (logisticsId: string, userId: string): Promise<void> => {
  try {
    // First get the current logistics to avoid overwriting other fields
    const logisticsQuery = query(
      collection(db, 'eventLogistics'),
      where('__name__', '==', logisticsId)
    );
    const logisticsSnapshot = await getDocs(logisticsQuery);
    
    if (logisticsSnapshot.empty) {
      throw new Error('Logistics entry not found');
    }

    const logisticsDoc = logisticsSnapshot.docs[0];
    const logistics = logisticsDoc.data() as EventLogistics;
    
    // Check if user is already a passenger
    if (logistics.passengers.includes(userId)) {
      return; // Already a passenger
    }

    // Check capacity
    if (logistics.passengers.length >= logistics.capacity) {
      throw new Error('Vehicle is at full capacity');
    }

    const updatedPassengers = [...logistics.passengers, userId];
    
    await updateEventLogistics(logisticsId, {
      passengers: updatedPassengers,
    });
  } catch (error) {
    console.error('Error adding passenger to logistics:', error);
    throw error;
  }
};

export const removePassengerFromLogistics = async (logisticsId: string, userId: string): Promise<void> => {
  try {
    // First get the current logistics
    const logisticsQuery = query(
      collection(db, 'eventLogistics'),
      where('__name__', '==', logisticsId)
    );
    const logisticsSnapshot = await getDocs(logisticsQuery);
    
    if (logisticsSnapshot.empty) {
      throw new Error('Logistics entry not found');
    }

    const logisticsDoc = logisticsSnapshot.docs[0];
    const logistics = logisticsDoc.data() as EventLogistics;
    
    const updatedPassengers = logistics.passengers.filter(id => id !== userId);
    
    await updateEventLogistics(logisticsId, {
      passengers: updatedPassengers,
    });
  } catch (error) {
    console.error('Error removing passenger from logistics:', error);
    throw error;
  }
};

export const getUserLogisticsForEvent = async (eventId: string, userId: string): Promise<EventLogistics[]> => {
  try {
    const q = query(
      collection(db, 'eventLogistics'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const logistics: EventLogistics[] = [];
    
    querySnapshot.forEach((doc) => {
      logistics.push({
        id: doc.id,
        ...doc.data(),
      } as EventLogistics);
    });
    
    return logistics;
  } catch (error) {
    console.error('Error fetching user logistics for event:', error);
    throw error;
  }
};

export const getVehicleEmoji = (vehicleType: string): string => {
  const emojiMap: { [key: string]: string } = {
    'car': '🚗',
    'van': '🚐',
    'truck': '🚚',
    'bus': '🚌',
    'other': '🚙',
  };
  return emojiMap[vehicleType] || '🚙';
};
