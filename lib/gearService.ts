import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface Gear {
  id?: string;
  name: string;
  type: 'microphone' | 'cable' | 'instrument' | 'amplifier' | 'percussion' | 'accessory' | 'audio-equipment' | 'lighting' | 'other';
  category: string; // More specific categorization
  brand?: string;
  model?: string;
  description?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs-repair';
  location?: string; // Where it's stored
  bandId: string;
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // New wishlist properties
  isWishlist?: boolean; // Whether this is a wishlist item or owned gear
  wishlistStatus?: 'wanted' | 'researching' | 'saving-for' | 'ready-to-buy' | 'ordered' | 'purchased';
  estimatedCost?: number; // For wishlist items
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // Priority for wishlist items
  notes?: string; // Additional notes for wishlist items
}

export interface EventGear {
  id?: string;
  eventId: string;
  gearId: string;
  quantity: number;
  notes?: string;
  assignedTo?: string; // User ID of who's responsible for bringing it
  status: 'planned' | 'packed' | 'delivered' | 'returned';
  createdAt?: Timestamp;
}

export interface GearBox {
  id?: string;
  name: string;
  description?: string;
  bandId: string;
  createdBy: string;
  gearIds: string[]; // Array of gear IDs contained in this box
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EventGearBox {
  id?: string;
  eventId: string;
  gearBoxId: string;
  quantity: number; // Usually 1 for boxes, but could be multiple sets
  notes?: string;
  assignedTo?: string; // User ID of who's responsible for bringing it
  status: 'planned' | 'packed' | 'delivered' | 'returned';
  createdAt?: Timestamp;
}

// Predefined gear types and categories for easy selection
export const GEAR_CATEGORIES = {
  microphone: [
    'Vocal Microphone',
    'Instrument Microphone', 
    'Wireless Microphone',
    'Condenser Microphone',
    'Dynamic Microphone',
    'Ribbon Microphone',
    'Lavalier Microphone',
    'Shotgun Microphone',
    'USB Microphone'
  ],
  cable: [
    'XLR Cable',
    'TRS Cable',
    'TS Cable', 
    'RCA Cable',
    'AUX Cable',
    'Instrument Cable',
    'Speaker Cable',
    'Power Cable',
    'MIDI Cable',
    'USB Cable',
    'Ethernet Cable',
    'Optical Cable',
    'Patch Cable',
    'Extension Cable',
    'Snake Cable'
  ],
  instrument: [
    'Electric Guitar',
    'Acoustic Guitar',
    'Classical Guitar',
    'Bass Guitar',
    'Electric Piano',
    'Acoustic Piano',
    'Keyboard',
    'Synthesizer',
    'Violin',
    'Viola', 
    'Cello',
    'Double Bass',
    'Saxophone',
    'Trumpet',
    'Trombone',
    'French Horn',
    'Tuba',
    'Clarinet',
    'Flute',
    'Oboe',
    'Bassoon',
    'Harmonica',
    'Accordion',
    'Mandolin',
    'Banjo',
    'Ukulele',
    'Harp'
  ],
  amplifier: [
    'Guitar Amplifier',
    'Bass Amplifier', 
    'Keyboard Amplifier',
    'Acoustic Amplifier',
    'PA System',
    'Monitor Speaker',
    'Studio Monitor',
    'Subwoofer',
    'Power Amplifier',
    'Preamp',
    'Tube Amplifier',
    'Solid State Amplifier'
  ],
  percussion: [
    'Drum Kit',
    'Snare Drum',
    'Bass Drum',
    'Tom-Tom',
    'Hi-Hat',
    'Crash Cymbal',
    'Ride Cymbal',
    'China Cymbal',
    'Splash Cymbal',
    'Tambourine',
    'Shaker',
    'Maracas',
    'Cajon',
    'Bongos',
    'Congas',
    'Timbales',
    'Cowbell',
    'Wood Block',
    'Triangle',
    'Chimes',
    'Gong',
    'Vibraphone',
    'Xylophone',
    'Marimba'
  ],
  'audio-equipment': [
    'Mixing Console',
    'Audio Interface',
    'Digital Mixer',
    'Monitor Controller',
    'Headphone Amplifier',
    'Direct Box (DI)',
    'Crossover',
    'Equalizer',
    'Compressor',
    'Reverb Unit',
    'Delay Unit',
    'Multi-Effects Processor',
    'Noise Gate',
    'Feedback Suppressor',
    'Wireless System',
    'In-Ear Monitor System',
    'Talkback System'
  ],
  accessory: [
    'Microphone Stand',
    'Boom Stand',
    'Guitar Stand',
    'Keyboard Stand',
    'Music Stand',
    'Stool',
    'Bench',
    'Tuner',
    'Metronome',
    'Guitar Pick',
    'Drumsticks',
    'Mallets',
    'Brushes',
    'Capo',
    'Guitar Strap',
    'Instrument Case',
    'Gig Bag',
    'Flight Case',
    'Rack Case',
    'Pedalboard',
    'Effects Pedal',
    'Power Supply',
    'Cable Organizer',
    'Pop Filter',
    'Windscreen',
    'Shock Mount',
    'Isolation Pad',
    'Acoustic Panel',
    'Mic Clip',
    'Cable Tie',
    'Gaffer Tape'
  ],
  lighting: [
    'LED Par Light',
    'Moving Head Light',
    'Strobe Light',
    'Laser Light',
    'Fog Machine',
    'Haze Machine',
    'Light Controller',
    'DMX Cable',
    'Light Stand',
    'Truss',
    'Clamp',
    'Safety Cable',
    'Color Filter',
    'Gobo'
  ],
  other: [
    'Power Strip',
    'Extension Cord',
    'Power Conditioner',
    'UPS Battery Backup',
    'Tool Kit',
    'Soldering Kit',
    'Cable Tester',
    'Sound Level Meter',
    'Storage Case',
    'Road Case',
    'Sheet Music',
    'Music Software',
    'Recording Device',
    'Click Track Device',
    'Stage Box',
    'Fan',
    'Backup Drive',
    'Laptop',
    'Tablet'
  ]
};

// Gear CRUD operations
export const createGear = async (gear: Omit<Gear, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'gear'), {
      ...gear,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating gear:', error);
    throw error;
  }
};

export const getGearByBandId = async (bandId: string): Promise<Gear[]> => {
  try {
    const q = query(
      collection(db, 'gear'),
      where('bandId', '==', bandId),
      orderBy('name') // Re-enabled once Firebase index is created
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Gear));
  } catch (error) {
    console.error('Error fetching gear:', error);
    throw error;
  }
};

export const updateGear = async (gearId: string, updates: Partial<Gear>): Promise<void> => {
  try {
    const gearRef = doc(db, 'gear', gearId);
    
    // Filter out undefined values to prevent Firebase errors
    const cleanUpdates: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });
    
    await updateDoc(gearRef, {
      ...cleanUpdates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating gear:', error);
    throw error;
  }
};

export const deleteGear = async (gearId: string): Promise<void> => {
  try {
    // First, remove the gear from all events
    await removeGearFromAllEvents(gearId);
    
    // Then delete the gear
    await deleteDoc(doc(db, 'gear', gearId));
  } catch (error) {
    console.error('Error deleting gear:', error);
    throw error;
  }
};

// Event Gear operations
export const addGearToEvent = async (eventGear: Omit<EventGear, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'eventGear'), {
      ...eventGear,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gear to event:', error);
    throw error;
  }
};

export const getEventGear = async (eventId: string): Promise<(EventGear & { gear: Gear })[]> => {
  try {
    const q = query(
      collection(db, 'eventGear'),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);
    
    const eventGearList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EventGear));

    // Fetch gear details for each event gear
    const gearDetails = await Promise.all(
      eventGearList.map(async (eventGear) => {
        const gearDoc = await getDocs(query(collection(db, 'gear'), where('__name__', '==', eventGear.gearId)));
        const gear = gearDoc.docs[0]?.data() as Gear;
        return {
          ...eventGear,
          gear: { ...gear, id: eventGear.gearId }
        };
      })
    );

    return gearDetails.filter(item => item.gear);
  } catch (error) {
    console.error('Error fetching event gear:', error);
    throw error;
  }
};

export const updateEventGear = async (eventGearId: string, updates: Partial<EventGear>): Promise<void> => {
  try {
    const eventGearRef = doc(db, 'eventGear', eventGearId);
    await updateDoc(eventGearRef, updates);
  } catch (error) {
    console.error('Error updating event gear:', error);
    throw error;
  }
};

export const removeGearFromEvent = async (eventGearId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'eventGear', eventGearId));
  } catch (error) {
    console.error('Error removing gear from event:', error);
    throw error;
  }
};

export const removeGearFromAllEvents = async (gearId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'eventGear'),
      where('gearId', '==', gearId)
    );
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error removing gear from all events:', error);
    throw error;
  }
};

// Gear Box CRUD Operations
export const createGearBox = async (gearBoxData: Omit<GearBox, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'gearBoxes'), {
      ...gearBoxData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating gear box:', error);
    throw error;
  }
};

export const getGearBoxesByBandId = async (bandId: string): Promise<GearBox[]> => {
  try {
    const q = query(
      collection(db, 'gearBoxes'),
      where('bandId', '==', bandId),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const gearBoxes: GearBox[] = [];
    querySnapshot.forEach((doc) => {
      gearBoxes.push({
        id: doc.id,
        ...doc.data()
      } as GearBox);
    });
    return gearBoxes;
  } catch (error) {
    console.error('Error fetching gear boxes:', error);
    throw error;
  }
};

export const updateGearBox = async (gearBoxId: string, updates: Partial<GearBox>): Promise<void> => {
  try {
    const gearBoxRef = doc(db, 'gearBoxes', gearBoxId);
    await updateDoc(gearBoxRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating gear box:', error);
    throw error;
  }
};

export const deleteGearBox = async (gearBoxId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'gearBoxes', gearBoxId));
  } catch (error) {
    console.error('Error deleting gear box:', error);
    throw error;
  }
};

// Event Gear Box Operations
export const addGearBoxToEvent = async (eventGearBoxData: Omit<EventGearBox, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'eventGearBoxes'), {
      ...eventGearBoxData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gear box to event:', error);
    throw error;
  }
};

export const getEventGearBoxes = async (eventId: string): Promise<(EventGearBox & { gearBox: GearBox })[]> => {
  try {
    const q = query(
      collection(db, 'eventGearBoxes'),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);
    const eventGearBoxes: (EventGearBox & { gearBox: GearBox })[] = [];
    
    for (const docSnap of querySnapshot.docs) {
      const eventGearBoxData = {
        id: docSnap.id,
        ...docSnap.data()
      } as EventGearBox;
      
      // Fetch the associated gear box
      const gearBoxDoc = await doc(db, 'gearBoxes', eventGearBoxData.gearBoxId);
      const gearBoxSnap = await getDocs(query(collection(db, 'gearBoxes'), where('__name__', '==', eventGearBoxData.gearBoxId)));
      
      if (!gearBoxSnap.empty) {
        const gearBoxData = {
          id: gearBoxSnap.docs[0].id,
          ...gearBoxSnap.docs[0].data()
        } as GearBox;
        
        eventGearBoxes.push({
          ...eventGearBoxData,
          gearBox: gearBoxData
        });
      }
    }
    
    return eventGearBoxes;
  } catch (error) {
    console.error('Error fetching event gear boxes:', error);
    throw error;
  }
};

export const updateEventGearBox = async (eventGearBoxId: string, updates: Partial<EventGearBox>): Promise<void> => {
  try {
    const eventGearBoxRef = doc(db, 'eventGearBoxes', eventGearBoxId);
    await updateDoc(eventGearBoxRef, updates);
  } catch (error) {
    console.error('Error updating event gear box:', error);
    throw error;
  }
};

export const removeGearBoxFromEvent = async (eventGearBoxId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'eventGearBoxes', eventGearBoxId));
  } catch (error) {
    console.error('Error removing gear box from event:', error);
    throw error;
  }
};

// Utility functions
export const getGearByType = (gear: Gear[], type: string): Gear[] => {
  return gear.filter(item => item.type === type);
};

export const getGearByCondition = (gear: Gear[], condition: string): Gear[] => {
  return gear.filter(item => item.condition === condition);
};

export const searchGear = (gear: Gear[], searchTerm: string): Gear[] => {
  const term = searchTerm.toLowerCase();
  return gear.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    item.brand?.toLowerCase().includes(term) ||
    item.model?.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term)
  );
};

// New utility functions for wishlist functionality
export const getOwnedGear = (gear: Gear[]): Gear[] => {
  return gear.filter(item => !item.isWishlist);
};

export const getWishlistGear = (gear: Gear[]): Gear[] => {
  return gear.filter(item => item.isWishlist);
};

export const getGearByWishlistStatus = (gear: Gear[], status: string): Gear[] => {
  return gear.filter(item => item.isWishlist && item.wishlistStatus === status);
};

export const getGearByPriority = (gear: Gear[], priority: string): Gear[] => {
  return gear.filter(item => item.isWishlist && item.priority === priority);
};

// Utility function to check if gear is available (not wishlist, but can be in a box)
export const getAvailableGear = async (bandId: string, eventId?: string): Promise<Gear[]> => {
  try {
    const allGear = await getGearByBandId(bandId);
    // Do not filter out gear that's in boxes
    const availableGear = allGear.filter(gear => !gear.isWishlist);
    // If eventId is provided, also filter out gear already assigned to that event
    if (eventId) {
      const eventGear = await getEventGear(eventId);
      const assignedGearIds = new Set(eventGear.map(eg => eg.gearId));
      return availableGear.filter(gear => !assignedGearIds.has(gear.id!));
    }
    return availableGear;
  } catch (error) {
    console.error('Error getting available gear:', error);
    throw error;
  }
};

// Utility function to get gear items in a box with full gear details
export const getGearInBox = async (gearBox: GearBox): Promise<Gear[]> => {
  try {
    const allGear = await getGearByBandId(gearBox.bandId);
    return allGear.filter(gear => gearBox.gearIds.includes(gear.id!));
  } catch (error) {
    console.error('Error getting gear in box:', error);
    throw error;
  }
};
