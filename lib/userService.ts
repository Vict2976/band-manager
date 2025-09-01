import { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './firebase';

export interface User {
  id?: string;
  uid?: string; // Firebase Auth UID
  name: string;
  email: string;
  photoURL?: string;
  role?: string; // Musical role like "Lead Vocalist", "Guitarist"
  permission?: 'admin' | 'member'; // Admin can manage others' attendance, members only their own
  instrument?: string;
  bandId?: string; // Band association
  isActive?: boolean; // Whether the user has activated their account
  joinedAt?: Date; // When they joined the band
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>, password: string) => {
  try {
    // Create user with email/password authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userDoc = {
      ...userData,
      createdAt: new Date(),
      uid: user.uid,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    
    return { id: user.uid, ...userDoc };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Create a user profile without authentication (for invited members)
export const createUserProfile = async (userData: Omit<User, 'id' | 'uid' | 'createdAt'>): Promise<string> => {
  try {
    // Create user document in Firestore with a generated ID
    const userDoc = {
      ...userData,
      createdAt: new Date(),
      isActive: false, // User needs to activate their account
    };

    const docRef = await addDoc(collection(db, 'users'), userDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        uid: userData.uid || doc.id, // Use uid if available, otherwise use doc ID
        ...userData,
      } as User);
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUsersByBandId = async (bandId: string): Promise<User[]> => {
  try {
    const usersQuery = query(collection(db, 'users'), where('bandId', '==', bandId));
    const querySnapshot = await getDocs(usersQuery);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        uid: userData.uid || doc.id,
        ...userData,
      } as User);
    });

    console.log(`Found ${users.length} users for band ${bandId}`);
    return users;
  } catch (error) {
    console.error('Error fetching users by band:', error);
    throw error;
  }
};

export const uploadUserPhoto = async (file: File, userId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `user-photos/${userId}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Ensure we don't overwrite important fields accidentally
    const allowedUpdates = {
      name: updates.name,
      role: updates.role,
      instrument: updates.instrument,
      photoURL: updates.photoURL,
      bandId: updates.bandId,
      updatedAt: updates.updatedAt || new Date()
    };
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    );
    
    await setDoc(userRef, cleanUpdates, { merge: true });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};



export const updateUsersWithBand = async (bandId: string) => {
  try {
    const users = await getAllUsers();
    const updatePromises = users
      .filter(user => !user.bandId) // Only update users without a band
      .map(user => {
        const userRef = doc(db, 'users', user.id || user.uid || '');
        return setDoc(userRef, { bandId }, { merge: true });
      });
    
    await Promise.all(updatePromises);
    console.log(`Updated ${updatePromises.length} users with band ID: ${bandId}`);
  } catch (error) {
    console.error('Error updating users with band:', error);
    throw error;
  }
};

// Permission utility functions
export const hasAdminPermission = (user: User | null): boolean => {
  return user?.permission === 'admin';
};

export const canManageAttendee = (currentUser: User | null, targetUserId: string): boolean => {
  if (!currentUser) return false;
  
  // Admins can manage anyone's attendance
  if (hasAdminPermission(currentUser)) return true;
  
  // Regular members can only manage their own attendance
  const currentUserId = currentUser.id || currentUser.uid || '';
  return currentUserId === targetUserId;
};

// Get all users without a band (available to be added to bands)
export const getAvailableUsers = async (): Promise<User[]> => {
  try {
    const usersQuery = query(
      collection(db, 'users'), 
      where('bandId', '==', null)
    );
    const querySnapshot = await getDocs(usersQuery);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        uid: userData.uid || doc.id,
        ...userData,
      } as User);
    });

    return users;
  } catch (error) {
    console.error('Error fetching available users:', error);
    throw error;
  }
};

// Search users by email or name (for admins to find and add users)
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    const allUsers = await getAllUsers();
    
    console.log('All users found:', allUsers.length);
    console.log('Search term:', searchTerm);
    
    // Find users that match the search term
    const matchingUsers = allUsers.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Users matching search term:', matchingUsers.length);
    matchingUsers.forEach(user => {
      console.log('Matching user:', {
        name: user.name,
        email: user.email,
        bandId: user.bandId,
        hasNoBand: !user.bandId
      });
    });
    
    // Filter users based on search term (email or name) and no band
    const filteredUsers = allUsers.filter(user => 
      !user.bandId && // Only users without a band
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    console.log('Final filtered users (no band):', filteredUsers.length);

    return filteredUsers;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Add a user to a band (for admin use)
export const addUserToBand = async (userId: string, bandId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      bandId: bandId,
      joinedAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error adding user to band:', error);
    throw error;
  }
};

// Remove a user from a band (for admin use)
export const removeUserFromBand = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      bandId: null,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error removing user from band:', error);
    throw error;
  }
};
