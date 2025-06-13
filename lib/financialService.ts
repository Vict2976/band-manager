import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface Expense {
  id?: string;
  eventId: string;
  userId: string; // Who incurred the expense
  type: 'transport' | 'accommodation' | 'food' | 'equipment' | 'other';
  amount: number; // Amount in DKK
  description: string;
  distance?: number; // For transport expenses (km)
  reimbursementRate?: number; // DKK per km for transport
  receiptUrl?: string; // Optional receipt image URL
  approved: boolean; // Whether the expense is approved for reimbursement
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFinancials {
  eventId: string;
  earnings: number; // Total earnings from the gig in DKK
  totalExpenses: number; // Total approved expenses
  netProfit: number; // Earnings minus expenses
  expenses: Expense[];
  reimbursements: Array<{
    userId: string;
    userName: string;
    totalAmount: number;
    expenses: Expense[];
  }>;
}

// Default transport rate in DKK per km (Danish standard rate)
export const DEFAULT_TRANSPORT_RATE = 2.04; // 2024 Danish tax-free rate

export const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
  try {
    const now = new Date();
    
    // Remove undefined fields to prevent Firebase errors
    const cleanedData = Object.fromEntries(
      Object.entries(expenseData).filter(([_, value]) => value !== undefined)
    );
    
    const newExpense = {
      ...cleanedData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'expenses'), newExpense);
    
    return {
      id: docRef.id,
      ...newExpense,
    } as Expense;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const getEventExpenses = async (eventId: string): Promise<Expense[]> => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);
    const expenses: Expense[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to Dates
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      } as Expense);
    });
    
    // Sort by creation date on client side
    return expenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching event expenses:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId: string, updates: Partial<Expense>): Promise<void> => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const calculateTransportExpense = (distance: number, rate: number = DEFAULT_TRANSPORT_RATE): number => {
  return Math.round(distance * rate * 100) / 100; // Round to 2 decimal places
};

export const calculateEventFinancials = async (eventId: string, gigEarnings: number = 0): Promise<EventFinancials> => {
  try {
    const expenses = await getEventExpenses(eventId);
    const approvedExpenses = expenses.filter(expense => expense.approved);
    
    const totalExpenses = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = gigEarnings - totalExpenses;
    
    // Group expenses by user for reimbursement calculation
    const reimbursementMap = new Map<string, Expense[]>();
    approvedExpenses.forEach(expense => {
      if (!reimbursementMap.has(expense.userId)) {
        reimbursementMap.set(expense.userId, []);
      }
      reimbursementMap.get(expense.userId)!.push(expense);
    });
    
    const reimbursements = Array.from(reimbursementMap.entries()).map(([userId, userExpenses]) => ({
      userId,
      userName: '', // Will be populated when displaying
      totalAmount: userExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      expenses: userExpenses,
    }));
    
    return {
      eventId,
      earnings: gigEarnings,
      totalExpenses,
      netProfit,
      expenses,
      reimbursements,
    };
  } catch (error) {
    console.error('Error calculating event financials:', error);
    throw error;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
  }).format(amount);
};

export const getExpenseTypeIcon = (type: string): string => {
  const iconMap: { [key: string]: string } = {
    'transport': '🚗',
    'accommodation': '🏨',
    'food': '🍕',
    'equipment': '🎸',
    'other': '💰',
  };
  return iconMap[type] || '💰';
};
