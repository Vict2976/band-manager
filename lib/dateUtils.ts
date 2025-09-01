// Date utility functions to handle timezone issues consistently across the app

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable format
 * Parses the date in local timezone to avoid timezone conversion issues
 */
export const formatDateSafe = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Handle both ISO date strings and YYYY-MM-DD format
    if (dateString.includes('T')) {
      // ISO date string - parse and format in local timezone
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // Simple YYYY-MM-DD format - create date in local timezone
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a Date object to YYYY-MM-DD string
 * Used for creating date strings for storage and form inputs
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Creates a Date object from a date string (YYYY-MM-DD) in local timezone
 * Avoids timezone conversion issues that occur with new Date(dateString)
 */
export const parseDateSafe = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Checks if a date string matches today's date
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const todayString = formatDateToString(today);
  return dateString === todayString;
};

/**
 * Gets the current date as a YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};
