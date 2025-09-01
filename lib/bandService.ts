import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Band {
  id?: string;
  name: string;
  description?: string;
  genre?: string;
  location?: string;
  imageURL?: string;
  currentHoldings?: number; // Current band money in DKK
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

// Get the current user's band


// Get the current user's band
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
    
    // No band found for user
    throw new Error('User has no band associated. Please complete the setup process.');
  } catch (error) {
    console.error('Error getting current user band:', error);
    throw error;
  }
};

// Upload band photo
export const uploadBandPhoto = async (file: File, bandId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `band-photos/${bandId}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading band photo:', error);
    throw error;
  }
};

// Update band holdings
export const updateBandHoldings = async (bandId: string, newAmount: number): Promise<void> => {
  try {
    const bandRef = doc(db, 'bands', bandId);
    await updateDoc(bandRef, {
      currentHoldings: newAmount,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating band holdings:', error);
    throw error;
  }
};
