import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface Activity {
  id?: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  bandId: string;
  type: 'attendance_change' | 'event_create' | 'event_edit' | 'event_delete' | 'user_join' | 'expense_add' | 'holdings_update';
  action: string; // Human readable action description
  details?: {
    eventId?: string;
    eventTitle?: string;
    eventType?: 'rehearsal' | 'gig';
    attendanceStatus?: 'attending' | 'not_attending';
    [key: string]: any;
  };
  timestamp: Date;
}

export const createActivity = async (activityData: Omit<Activity, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const activity = {
      ...activityData,
      timestamp: new Date(),
    };

    // Filter out undefined values as Firestore doesn't accept them
    const cleanActivity = Object.fromEntries(
      Object.entries(activity).filter(([_, value]) => value !== undefined)
    );

    await addDoc(collection(db, 'activities'), cleanActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    // Don't throw error as activity tracking shouldn't break the main functionality
  }
};

export const getBandActivities = async (bandId: string, limitCount: number = 20): Promise<Activity[]> => {
  try {
    // Use a simpler query that doesn't require composite index
    // We'll filter by bandId and sort in memory instead of using orderBy with where
    const q = query(
      collection(db, 'activities'),
      where('bandId', '==', bandId)
    );

    const querySnapshot = await getDocs(q);
    const activities: Activity[] = [];

    querySnapshot.forEach((doc) => {
      const activityData = doc.data();
      activities.push({
        id: doc.id,
        ...activityData,
        timestamp: activityData.timestamp.toDate(),
      } as Activity);
    });

    // Sort by timestamp in descending order and limit in memory
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching band activities:', error);
    return [];
  }
};

export const getUserActivities = async (userId: string, limitCount: number = 10): Promise<Activity[]> => {
  try {
    // Use a simpler query that doesn't require composite index
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const activities: Activity[] = [];

    querySnapshot.forEach((doc) => {
      const activityData = doc.data();
      activities.push({
        id: doc.id,
        ...activityData,
        timestamp: activityData.timestamp.toDate(),
      } as Activity);
    });

    // Sort by timestamp in descending order and limit in memory
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

export const getActivityIcon = (type: Activity['type']): string => {
  const iconMap: { [key in Activity['type']]: string } = {
    'attendance_change': '👥',
    'event_create': '📅',
    'event_edit': '✏️',
    'event_delete': '🗑️',
    'user_join': '🎉',
    'expense_add': '💰',
    'holdings_update': '💳',
  };
  return iconMap[type] || '📋';
};

export const formatActivityTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return timestamp.toLocaleDateString();
};
