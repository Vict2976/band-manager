import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if a user already has a band associated with their account
 * @param userId - The user's UID
 * @returns Promise<boolean> - true if user has a band, false otherwise
 */
export const userHasBand = async (userId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return !!userData.bandId;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if user has band:', error);
    return false;
  }
};
