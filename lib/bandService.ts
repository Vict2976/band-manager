import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export interface Band {
  id?: string;
  name: string;
  description?: string;
  genre?: string;
  location?: string;
  founded?: Date;
  imageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export const createBand = async (bandData: Omit<Band, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const bandDoc = {
      ...bandData,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'bands'), bandDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating band:', error);
    throw error;
  }
};

export const getAllBands = async (): Promise<Band[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bands'));
    const bands: Band[] = [];
    
    querySnapshot.forEach((doc) => {
      const bandData = doc.data();
      bands.push({
        id: doc.id,
        ...bandData,
      } as Band);
    });

    return bands;
  } catch (error) {
    console.error('Error fetching bands:', error);
    throw error;
  }
};

export const getBandById = async (bandId: string): Promise<Band | null> => {
  try {
    const docRef = doc(db, 'bands', bandId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Band;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching band:', error);
    throw error;
  }
};

export const updateBand = async (bandId: string, bandData: Partial<Band>) => {
  try {
    const docRef = doc(db, 'bands', bandId);
    await setDoc(docRef, bandData, { merge: true });
    return { id: bandId, ...bandData };
  } catch (error) {
    console.error('Error updating band:', error);
    throw error;
  }
};

// Initialize default band
export const initializeDefaultBand = async (): Promise<string> => {
  try {
    // Check if "Olis Orkester" already exists
    const bandsQuery = query(collection(db, 'bands'), where('name', '==', 'Olis Orkester'));
    const querySnapshot = await getDocs(bandsQuery);
    
    if (!querySnapshot.empty) {
      // Band already exists, return its ID
      return querySnapshot.docs[0].id;
    }

    // Create the default band
    const defaultBandId = await createBand({
      name: 'Olis Orkester',
      description: 'A passionate group of musicians creating amazing music together',
      genre: 'Rock/Pop',
      founded: new Date('2023-01-01'),
    });

    return defaultBandId;
  } catch (error) {
    console.error('Error initializing default band:', error);
    throw error;
  }
};

// Get the current user's band (with fallback to default)
export const getCurrentUserBand = async (userId: string): Promise<string> => {
  try {
    // Get user profile from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // If user has a bandId, verify the band exists
      if (userData.bandId) {
        const userBand = await getBandById(userData.bandId);
        if (userBand) {
          return userData.bandId;
        } else {
          console.warn('User has bandId but band not found:', userData.bandId);
        }
      }
    }
    
    // Fallback to default band if user has no band or band doesn't exist
    console.log('Falling back to default band for user:', userId);
    return await initializeDefaultBand();
  } catch (error) {
    console.error('Error getting current user band:', error);
    // Fallback to default band on error
    return await initializeDefaultBand();
  }
};
