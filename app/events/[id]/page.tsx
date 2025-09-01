'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { getEventById, updateEvent, deleteEvent, Event, addAttendeeToEvent, removeAttendeeFromEvent } from '../../../lib/eventService';
import { getUsersByBandId, User, canManageAttendee, hasAdminPermission } from '../../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../../lib/bandService';
import { getEventLogistics, createEventLogistics, updateEventLogistics, deleteEventLogistics, addPassengerToLogistics, removePassengerFromLogistics, EventLogistics, getVehicleEmoji } from '../../../lib/logisticsService';
import { getEventExpenses, createExpense, updateExpense, deleteExpense, calculateEventFinancials, formatCurrency, getExpenseTypeIcon, Expense, EventFinancials } from '../../../lib/financialService';
import { createActivity } from '../../../lib/activityService';
import ProtectedRoute from '../../../lib/ProtectedRoute';
import AuthNav from '../../../lib/AuthNav';
import { formatDateSafe } from '../../../lib/dateUtils';

export default function EventPage() {
  const { user, sessionUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [eventLogistics, setEventLogistics] = useState<EventLogistics[]>([]);
  const [eventFinancials, setEventFinancials] = useState<EventFinancials | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Agreements state for real-time editing
  const [agreements, setAgreements] = useState('');
  const [isEditingAgreements, setIsEditingAgreements] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Form state for editing
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'rehearsal' as 'rehearsal' | 'gig',
    date: '',
    time: '',
    location: '',
    description: '',
    agreements: '',
    attendees: [] as string[],
    gigEarnings: 0, // Add gig earnings field
  });

  // Logistics state
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [logisticsForm, setLogisticsForm] = useState({
    capacity: 4,
    notes: '',
  });

  // Expense state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    type: 'transport' as 'transport' | 'food' | 'accommodation' | 'other',
    amount: 0,
    description: '',
  });

  // Earnings modal state
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earningsForm, setEarningsForm] = useState({
    gigEarnings: 0,
  });

  // Toast notification function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      try {
        const eventData = await getEventById(eventId);
        if (!eventData) {
          console.error('Event not found');
          router.push('/calendar');
          return;
        }

        setEvent(eventData);
        setAgreements(eventData.agreements || '');

        // Set form data for editing
        // Handle both ISO date strings and YYYY-MM-DD format
        let dateString: string;
        let timeString: string;
        
        if (eventData.date.includes('T')) {
          // ISO date string - extract date and time
          const eventDate = new Date(eventData.date);
          dateString = eventDate.getFullYear() + '-' + 
            String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
            String(eventDate.getDate()).padStart(2, '0');
          timeString = String(eventDate.getHours()).padStart(2, '0') + ':' + 
            String(eventDate.getMinutes()).padStart(2, '0');
        } else {
          // Already in YYYY-MM-DD format
          dateString = eventData.date;
          timeString = eventData.time || '';
        }
        
        setEventForm({
          title: eventData.title,
          type: eventData.type,
          date: dateString,
          time: timeString,
          location: eventData.location || '',
          description: eventData.description || '',
          agreements: eventData.agreements || '',
          attendees: eventData.attendees,
          gigEarnings: eventData.gigEarnings || 0,
        });

        // Get band information
        const bandId = await getCurrentUserBand(user?.uid || sessionUser?.uid || '');
        if (!bandId) {
          console.error('User not in any band');
          router.push('/setup');
          return;
        }

        const currentBand = await getBandById(bandId);
        setBand(currentBand);

        // Fetch users for attendee management
        const usersData = await getUsersByBandId(bandId);
        setUsers(usersData);

        // Fetch event logistics
        const logisticsData = await getEventLogistics(eventId);
        setEventLogistics(logisticsData);

        // Fetch expenses
        const expensesData = await getEventExpenses(eventId);
        setExpenses(expensesData);

        // Calculate financial overview for gigs
        if (eventData.type === 'gig') {
          const financials = await calculateEventFinancials(eventId, eventData.gigEarnings || 0);
          setEventFinancials(financials);
        }

      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && (user || sessionUser)) {
      fetchEventData();
    }
  }, [eventId, user, sessionUser, authLoading, router]);

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => (u.id || u.uid) === userId);
    return foundUser?.name || 'Unknown User';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    try {
      const updatedEvent = {
        ...event,
        title: eventForm.title,
        type: eventForm.type,
        date: eventForm.date, // Keep date in YYYY-MM-DD format
        time: eventForm.time, // Keep time separate
        location: eventForm.location,
        description: eventForm.description,
        attendees: eventForm.attendees,
        gigEarnings: eventForm.gigEarnings,
      };

      await updateEvent(event.id!, updatedEvent);
      setEvent(updatedEvent);
      setIsEditing(false);
      
      // Track event edit activity
      const currentUser = user || sessionUser;
      if (band?.id && currentUser) {
        await createActivity({
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || 'Unknown User',
          ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
          bandId: band.id,
          type: 'event_edit',
          action: `Updated event "${updatedEvent.title}"`,
          details: {
            eventId: event.id,
            eventTitle: updatedEvent.title,
            eventType: updatedEvent.type
          }
        });
      }
      
      // Recalculate financials if it's a gig and earnings changed
      if (updatedEvent.type === 'gig') {
        const financials = await calculateEventFinancials(event.id!, updatedEvent.gigEarnings || 0);
        setEventFinancials(financials);
      }
      
      showToast('Event updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('Failed to update event. Please try again.', 'error');
    }
  };

  const handleSaveAgreements = async () => {
    if (!event) return;

    try {
      const updatedEvent = {
        ...event,
        agreements: agreements,
      };

      await updateEvent(event.id!, updatedEvent);
      setEvent(updatedEvent);
      setIsEditingAgreements(false);
      showToast('Agreements updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating agreements:', error);
      showToast('Failed to update agreements. Please try again.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      // Track event deletion activity before deleting
      const currentUser = user || sessionUser;
      if (band?.id && currentUser) {
        await createActivity({
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || 'Unknown User',
          ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
          bandId: band.id,
          type: 'event_delete',
          action: `Deleted event "${event.title}"`,
          details: {
            eventTitle: event.title,
            eventType: event.type
          }
        });
      }

      await deleteEvent(event.id!);
      router.push('/calendar');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event. Please try again.', 'error');
    }
  };

  const handleAttendeeToggle = async (userId: string) => {
    if (!event) return;

    try {
      const currentUser = user || sessionUser;
      if (!currentUser) return;

      const isAttending = event.attendees.includes(userId);
      const targetUser = users.find(u => (u.id || u.uid) === userId);
      
      if (!isAttending) {
        await addAttendeeToEvent(event.id!, userId);
        setEvent({
          ...event,
          attendees: [...event.attendees, userId]
        });

        // Track attendance activity
        if (band?.id) {
          await createActivity({
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email || 'Unknown User',
            ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
            bandId: band.id,
            type: 'attendance_change',
            action: `${targetUser?.name || 'Someone'} is now attending ${event.title}`,
            details: {
              eventId: event.id,
              eventTitle: event.title,
              eventType: event.type,
              attendanceStatus: 'attending'
            }
          });
        }
      } else {
        await removeAttendeeFromEvent(event.id!, userId);
        setEvent({
          ...event,
          attendees: event.attendees.filter(id => id !== userId)
        });

        // Track attendance activity
        if (band?.id) {
          await createActivity({
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email || 'Unknown User',
            ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
            bandId: band.id,
            type: 'attendance_change',
            action: `${targetUser?.name || 'Someone'} is no longer attending ${event.title}`,
            details: {
              eventId: event.id,
              eventTitle: event.title,
              eventType: event.type,
              attendanceStatus: 'not_attending'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error toggling attendee:', error);
      showToast('Failed to update attendance. Please try again.', 'error');
    }
  };

  // Logistics functions
  const handleAddLogistics = async () => {
    if (!event) return;

    const currentUser = user || sessionUser;
    if (!currentUser) return;

    try {
      await createEventLogistics({
        eventId: event.id!,
        userId: currentUser.uid,
        vehicleType: 'car', // Default vehicle type
        vehicleName: 'Vehicle', // Default vehicle name
        capacity: logisticsForm.capacity,
        departureLocation: 'To be arranged', // Default departure location
        arrivalLocation: '', // Optional
        departureTime: '', // Optional
        returnTime: '', // Optional
        notes: logisticsForm.notes,
        passengers: [],
        distance: 0,
      });

      // Refresh logistics data
      const logisticsData = await getEventLogistics(event.id!);
      setEventLogistics(logisticsData);
      setShowLogisticsModal(false);
      setLogisticsForm({
        capacity: 4,
        notes: '',
      });
      showToast('Vehicle added successfully!', 'success');
    } catch (error) {
      console.error('Error adding logistics:', error);
      showToast('Failed to add vehicle. Please try again.', 'error');
    }
  };

  const handleTogglePassenger = async (logisticsId: string, userId: string) => {
    try {
      const logistics = eventLogistics.find(l => l.id === logisticsId);
      if (!logistics) return;

      if (logistics.passengers.includes(userId)) {
        await removePassengerFromLogistics(logisticsId, userId);
      } else {
        await addPassengerToLogistics(logisticsId, userId);
      }

      // Refresh logistics data
      const logisticsData = await getEventLogistics(event!.id!);
      setEventLogistics(logisticsData);
    } catch (error) {
      console.error('Error toggling passenger:', error);
      alert('Failed to update passenger list. Please try again.');
    }
  };

  const handleRemoveLogistics = async (logisticsId: string) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;

    try {
      await deleteEventLogistics(logisticsId);
      setEventLogistics(eventLogistics.filter(l => l.id !== logisticsId));
    } catch (error) {
      console.error('Error removing logistics:', error);
      alert('Failed to remove vehicle. Please try again.');
    }
  };

  // Expense functions
  const handleAddExpense = async () => {
    if (!event) return;

    const currentUser = user || sessionUser;
    if (!currentUser) return;

    try {
      await createExpense({
        eventId: event.id!,
        userId: currentUser.uid,
        type: expenseForm.type,
        amount: expenseForm.amount,
        description: expenseForm.description,
        approved: true, // Auto-approve all expenses
      });

      // Refresh expenses and financials
      const expensesData = await getEventExpenses(event.id!);
      setExpenses(expensesData);

      if (event.type === 'gig') {
        const financials = await calculateEventFinancials(event.id!, event.gigEarnings || 0);
        setEventFinancials(financials);
      }

      setShowExpenseModal(false);
      setExpenseForm({
        type: 'transport',
        amount: 0,
        description: '',
      });
      
      // Track expense activity
      if (band?.id) {
        await createActivity({
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || 'Unknown User',
          ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
          bandId: band.id,
          type: 'expense_add',
          action: `Added ${expenseForm.type} expense: ${expenseForm.amount} DKK for ${event.title}`,
          details: {
            eventId: event.id,
            eventTitle: event.title,
            eventType: event.type,
            expenseType: expenseForm.type,
            amount: expenseForm.amount
          }
        });
      }

      showToast('Expense added successfully!', 'success');
    } catch (error) {
      console.error('Error adding expense:', error);
      showToast('Failed to add expense. Please try again.', 'error');
    }
  };

  const handleRemoveExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to remove this expense?')) return;

    try {
      await deleteExpense(expenseId);
      
      // Refresh expenses and financials
      setExpenses(expenses.filter(e => e.id !== expenseId));
      
      if (event?.type === 'gig') {
        const financials = await calculateEventFinancials(event.id!, event.gigEarnings || 0);
        setEventFinancials(financials);
      }
    } catch (error) {
      console.error('Error removing expense:', error);
      showToast('Failed to remove expense. Please try again.', 'error');
    }
  };

  const handleUpdateEarnings = async () => {
    if (!event) return;

    try {
      const updatedEvent = {
        ...event,
        gigEarnings: earningsForm.gigEarnings,
      };

      await updateEvent(event.id!, updatedEvent);
      setEvent(updatedEvent);
      
      // Recalculate financials
      const financials = await calculateEventFinancials(event.id!, earningsForm.gigEarnings);
      setEventFinancials(financials);
      
      setShowEarningsModal(false);
      alert('Earnings updated successfully!');
    } catch (error) {
      console.error('Error updating earnings:', error);
      alert('Failed to update earnings. Please try again.');
    }
  };

  const getEventTypeIcon = (type: string) => {
    return type === 'gig' ? '🪩' : '🎼';
  };

  const getEventTypeColor = (type: string) => {
    return type === 'gig' ? 'bg-yellow-600' : 'bg-blue-600';
  };

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p>Loading event...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <button 
              onClick={() => router.push('/calendar')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Return to Calendar
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AuthNav />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Event Header */}
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">{event.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)} inline-block w-fit`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className="text-gray-400 text-sm sm:text-base">{formatDateSafe(event.date)}</span>
                    {event.location && <span className="text-gray-400 text-sm sm:text-base truncate">📍 {event.location}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>

            {event.description && !isEditing && (
              <p className="text-gray-300 mb-4 text-sm sm:text-base">{event.description}</p>
            )}

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleSave} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Event Title *</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type *</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({...eventForm, type: e.target.value as 'rehearsal' | 'gig'})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                    >
                      <option value="rehearsal">Rehearsal</option>
                      <option value="gig">Gig</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Date *</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Time *</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                      placeholder="Venue or rehearsal space"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                      rows={3}
                      placeholder="Additional details about the event"
                    />
                  </div>
                  {eventForm.type === 'gig' && (
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm mb-2">Expected Earnings (DKK)</label>
                      <input
                        type="number"
                        value={eventForm.gigEarnings}
                        onChange={(e) => setEventForm({...eventForm, gigEarnings: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Event Agreements & Coordination */}
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">📋</span>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Event Coordination & Agreements</h2>
              </div>
              <button
                onClick={() => {
                  if (isEditingAgreements) {
                    handleSaveAgreements();
                  } else {
                    setIsEditingAgreements(true);
                  }
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isEditingAgreements
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isEditingAgreements ? 'Save Changes' : 'Edit'}
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              {isEditingAgreements ? (
                <div>
                  <textarea
                    value={agreements}
                    onChange={(e) => setAgreements(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Write coordination notes here... Who's bringing gear? Transportation arrangements? Special instructions? etc."
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleSaveAgreements}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingAgreements(false);
                        setAgreements(event?.agreements || '');
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[120px]">
                  {agreements ? (
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {agreements}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      <span className="text-3xl mb-2 block">📝</span>
                      <p>No coordination notes yet.</p>
                      <p className="text-sm mt-2">Click "Edit" to add agreements, transportation plans, or other coordination details.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-3 text-xs text-gray-400">
              💡 Use this space to coordinate who brings what gear, transportation arrangements, special instructions, or any agreements made for this event.
            </div>
          </div>

          {/* Attendance Management */}
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">👥 Band Member Attendance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Attending Members */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-4">
                  Attending ({event.attendees.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {event.attendees.map(userId => {
                    const bandUser = users.find(u => (u.id || u.uid) === userId);
                    if (!bandUser) return null;

                    const currentUser = user || sessionUser;
                    const currentUserData = users.find(u => (u.id || u.uid) === currentUser?.uid);
                    const canManage = canManageAttendee(currentUserData || null, userId);
                    const isCurrentUser = (currentUser?.uid === userId);

                    return (
                      <div key={userId} className={`p-3 rounded-lg border transition-all ${
                        isCurrentUser 
                          ? 'border-yellow-500 bg-yellow-500/5' 
                          : 'border-green-500 bg-green-500/5'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <p className="font-medium text-sm sm:text-base truncate">{bandUser.name}</p>
                                <div className="flex items-center gap-1">
                                  {isCurrentUser && (
                                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">YOU</span>
                                  )}
                                  {bandUser.permission === 'admin' && (
                                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">ADMIN</span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-400 truncate">{bandUser.instrument || bandUser.role}</p>
                            </div>
                          </div>
                          {canManage && (
                            <button
                              onClick={() => handleAttendeeToggle(userId)}
                              className="px-2 sm:px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded transition-colors flex-shrink-0"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {event.attendees.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm sm:text-base">No one is attending yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Not Attending Members */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-400 mb-4">
                  Not Attending ({users.length - event.attendees.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {users
                    .filter(bandUser => !event.attendees.includes(bandUser.id || bandUser.uid || ''))
                    .map(bandUser => {
                      const userId = bandUser.id || bandUser.uid || '';
                      const currentUser = user || sessionUser;
                      const currentUserData = users.find(u => (u.id || u.uid) === currentUser?.uid);
                      const canManage = canManageAttendee(currentUserData || null, userId);
                      const isCurrentUser = (currentUser?.uid === userId);
                      
                      return (
                        <div key={userId} className={`p-3 rounded-lg border transition-all ${
                          isCurrentUser 
                            ? 'border-yellow-500 bg-yellow-500/5' 
                            : 'border-gray-600 bg-gray-800/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{bandUser.name}</p>
                                  {isCurrentUser && (
                                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">YOU</span>
                                  )}
                                  {bandUser.permission === 'admin' && (
                                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">ADMIN</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{bandUser.instrument || bandUser.role}</p>
                              </div>
                            </div>
                            {canManage && (
                              <button
                                onClick={() => handleAttendeeToggle(userId)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                {users.length - event.attendees.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>Everyone is attending!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logistics Section - Only show for gigs */}
          {event.type === 'gig' && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🚗 Transportation & Logistics</h2>
                <button
                  onClick={() => setShowLogisticsModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  + Add Vehicle
                </button>
              </div>

            {eventLogistics.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No transportation arranged yet.</p>
                <p className="text-sm mt-2">Band members can offer rides and coordinate carpooling here.</p>
                <button
                  onClick={() => setShowLogisticsModal(true)}
                  className="mt-3 text-purple-400 hover:text-purple-300"
                >
                  Click here to add your vehicle
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {eventLogistics.map(logistics => (
                  <div key={logistics.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getVehicleEmoji(logistics.vehicleType)}</span>
                        <div>
                          <h3 className="font-medium">
                            {getUserName(logistics.userId)}'s {logistics.vehicleName || logistics.vehicleType}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Capacity: {logistics.passengers.length + 1}/{logistics.capacity}
                          </p>
                          {logistics.departureLocation && (
                            <p className="text-sm text-gray-400">
                              📍 From: {logistics.departureLocation}
                            </p>
                          )}
                          {logistics.departureTime && (
                            <p className="text-sm text-gray-400">
                              🕐 Departure: {logistics.departureTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {logistics.userId === (user?.uid || sessionUser?.uid) && (
                          <button
                            onClick={() => handleRemoveLogistics(logistics.id!)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Passengers:</span>
                        {logistics.passengers.map(passengerId => (
                          <span key={passengerId} className="text-sm bg-purple-900/50 px-2 py-1 rounded flex items-center gap-1">
                            {getUserName(passengerId)}
                            {logistics.userId === (user?.uid || sessionUser?.uid) && (
                              <button
                                onClick={() => handleTogglePassenger(logistics.id!, passengerId)}
                                className="text-red-400 hover:text-red-300 ml-1"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Add passenger buttons for attending users */}
                      {logistics.passengers.length < logistics.capacity - 1 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {users
                            .filter(bandUser => {
                              const userId = bandUser.id || bandUser.uid || '';
                              return event.attendees.includes(userId) && 
                                     userId !== logistics.userId && 
                                     !logistics.passengers.includes(userId);
                            })
                            .map(bandUser => {
                              const userId = bandUser.id || bandUser.uid || '';
                              const isCurrentUser = (user?.uid || sessionUser?.uid) === userId;
                              
                              return (
                                <button
                                  key={userId}
                                  onClick={() => handleTogglePassenger(logistics.id!, userId)}
                                  className={`px-3 py-1 rounded-full text-sm border border-dashed transition-colors ${
                                    isCurrentUser 
                                      ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' 
                                      : 'border-gray-500 text-gray-400 hover:bg-gray-600 hover:text-white'
                                  }`}
                                >
                                  + {bandUser.name} {isCurrentUser ? '(You)' : ''}
                                </button>
                              );
                            })
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Financial Overview Section - Only show for gigs */}
          {event.type === 'gig' && (
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold">💰 Financial Overview</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setEarningsForm({ gigEarnings: event.gigEarnings || 0 });
                      setShowEarningsModal(true);
                    }}
                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    💰 Edit Earnings
                  </button>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    + Add Expense
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              {eventFinancials && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-2 text-sm sm:text-base">Total Earnings</h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-400">
                      {formatCurrency(eventFinancials.earnings)}
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                    <h3 className="text-red-400 font-medium mb-2 text-sm sm:text-base">Total Expenses</h3>
                    <p className="text-xl sm:text-2xl font-bold text-red-400">
                      {formatCurrency(eventFinancials.totalExpenses)}
                    </p>
                  </div>
                  <div className={`${eventFinancials.netProfit >= 0 ? 'bg-green-900/20 border-green-800/30' : 'bg-red-900/20 border-red-800/30'} border rounded-lg p-4 sm:col-span-2 lg:col-span-1`}>
                    <h3 className={`${eventFinancials.netProfit >= 0 ? 'text-green-400' : 'text-red-400'} font-medium mb-2 text-sm sm:text-base`}>Net Profit</h3>
                    <p className={`text-xl sm:text-2xl font-bold ${eventFinancials.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(eventFinancials.netProfit)}
                    </p>
                  </div>
                </div>
              )}

              {/* Expenses List */}
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-3">Expenses</h3>
                {expenses.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm sm:text-base">No expenses recorded yet.</p>
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="mt-2 text-red-400 hover:text-red-300 text-sm sm:text-base"
                    >
                      Add the first expense
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map(expense => (
                      <div key={expense.id} className="bg-gray-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <span className="text-lg sm:text-xl flex-shrink-0">{getExpenseTypeIcon(expense.type)}</span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm sm:text-base truncate">{expense.description}</h4>
                              <p className="text-xs sm:text-sm text-gray-400 truncate">
                                By {getUserName(expense.userId)} • {expense.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-red-400 text-sm sm:text-base">{formatCurrency(expense.amount)}</p>
                            {expense.userId === (user?.uid || sessionUser?.uid) && (
                              <button
                                onClick={() => handleRemoveExpense(expense.id!)}
                                className="text-xs text-gray-400 hover:text-red-400 mt-1"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <div>
          {/* Logistics Modal */}
          {showLogisticsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Add Your Vehicle</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Capacity (including driver) *</label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={logisticsForm.capacity}
                      onChange={(e) => setLogisticsForm({...logisticsForm, capacity: parseInt(e.target.value) || 2})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Additional Notes</label>
                    <textarea
                      value={logisticsForm.notes}
                      onChange={(e) => setLogisticsForm({...logisticsForm, notes: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      rows={3}
                      placeholder="Any special instructions or requirements"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddLogistics}
                    disabled={logisticsForm.capacity < 2}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Add Vehicle
                  </button>
                  <button
                    onClick={() => {
                      setShowLogisticsModal(false);
                      setLogisticsForm({
                        capacity: 4,
                        notes: '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Expense Modal */}
          {showExpenseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Add Expense</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Expense Type *</label>
                    <select
                      value={expenseForm.type}
                      onChange={(e) => setExpenseForm({
                        ...expenseForm,
                        type: e.target.value as 'transport' | 'food' | 'accommodation' | 'other'
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="transport">Transport</option>
                      <option value="food">Food & Drinks</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Description *</label>
                    <input
                      type="text"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="What was this expense for?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Amount (DKK) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={expenseForm.amount || ''}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddExpense}
                    disabled={!expenseForm.description || expenseForm.amount <= 0}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Add Expense
                  </button>
                  <button
                    onClick={() => {
                      setShowExpenseModal(false);
                      setExpenseForm({
                        type: 'transport',
                        amount: 0,
                        description: '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Modal */}
          {showEarningsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Update Gig Earnings</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Total Earnings (DKK)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={earningsForm.gigEarnings || ''}
                    onChange={(e) => setEarningsForm({gigEarnings: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateEarnings}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Update Earnings
                  </button>
                  <button
                    onClick={() => setShowEarningsModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className={`px-6 py-4 rounded-lg shadow-lg border max-w-md ${
                toast.type === 'success' 
                  ? 'bg-green-900 border-green-700 text-green-100' 
                  : toast.type === 'error'
                  ? 'bg-red-900 border-red-700 text-red-100'
                  : 'bg-blue-900 border-blue-700 text-blue-100'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
                  </span>
                  <p className="font-medium">{toast.message}</p>
                  <button
                    onClick={() => setToast(null)}
                    className="ml-auto text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
