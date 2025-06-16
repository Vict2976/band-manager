'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { getEventById, updateEvent, deleteEvent, Event, addAttendeeToEvent, removeAttendeeFromEvent, getAttendanceNote, hasAttendanceNote } from '../../../lib/eventService';
import { getUsersByBandId, User, canManageAttendee, hasAdminPermission } from '../../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../../lib/bandService';
import { getGearByBandId, addGearToEvent, getEventGear, removeGearFromEvent, updateEventGear, Gear, EventGear, GearBox, EventGearBox, getGearBoxesByBandId, addGearBoxToEvent, getEventGearBoxes, removeGearBoxFromEvent, getAvailableGear } from '../../../lib/gearService';
import { getEventLogistics, createEventLogistics, updateEventLogistics, deleteEventLogistics, addPassengerToLogistics, removePassengerFromLogistics, EventLogistics, getVehicleEmoji } from '../../../lib/logisticsService';
import { getEventExpenses, createExpense, updateExpense, deleteExpense, calculateEventFinancials, formatCurrency, getExpenseTypeIcon, calculateTransportExpense, DEFAULT_TRANSPORT_RATE, Expense, EventFinancials } from '../../../lib/financialService';
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
  const [gear, setGear] = useState<Gear[]>([]);
  const [eventGear, setEventGear] = useState<(EventGear & { gear: Gear })[]>([]);
  const [eventLogistics, setEventLogistics] = useState<EventLogistics[]>([]);
  const [eventFinancials, setEventFinancials] = useState<EventFinancials | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'rehearsal' as 'rehearsal' | 'gig',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: [] as string[],
    gigEarnings: 0, // Add gig earnings field
  });

  // Gear assignment state
  const [showGearModal, setShowGearModal] = useState(false);
  const [selectedGear, setSelectedGear] = useState<{gearId: string, quantity: number, assignedTo?: string}[]>([]);
  
  // Gear Box state
  const [gearBoxes, setGearBoxes] = useState<GearBox[]>([]);
  const [eventGearBoxes, setEventGearBoxes] = useState<(EventGearBox & { gearBox: GearBox })[]>([]);
  const [selectedGearBoxes, setSelectedGearBoxes] = useState<{gearBoxId: string, assignedTo?: string}[]>([]);
  const [availableGear, setAvailableGear] = useState<Gear[]>([]);
  const [gearAssignmentTab, setGearAssignmentTab] = useState<'individual' | 'boxes'>('individual');
  const [expandedGearBoxes, setExpandedGearBoxes] = useState<Set<string>>(new Set());

  // Logistics state
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [logisticsForm, setLogisticsForm] = useState({
    vehicleType: 'car' as 'car' | 'van' | 'truck' | 'bus' | 'other',
    vehicleName: '',
    capacity: 4,
    departureLocation: '',
    arrivalLocation: '',
    departureTime: '',
    returnTime: '',
    notes: '',
    distance: 0, // Add distance field
  });

  // Expense state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    type: 'transport' as 'transport' | 'accommodation' | 'food' | 'equipment' | 'other',
    amount: 0,
    description: '',
    distance: 0,
  });

  // Earnings state
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earningsForm, setEarningsForm] = useState({
    gigEarnings: 0,
  });

  // Attendance note state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteModalData, setNoteModalData] = useState<{
    userId: string;
    userName: string;
    currentNote: string;
    isAttending: boolean;
  } | null>(null);

  useEffect(() => {
    const currentUser = user || sessionUser;
    if (!authLoading && !currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser && eventId) {
      fetchEventData();
    }
  }, [user, sessionUser, authLoading, router, eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);

      // Get the current user
      const currentUser = user || sessionUser;
      if (!currentUser) return;

      // Get current user's band
      const bandId = await getCurrentUserBand(currentUser.uid);
      
      // Fetch band info
      const bandData = await getBandById(bandId);
      setBand(bandData);

      // Fetch event details
      const eventData = await getEventById(eventId);
      if (!eventData) {
        router.push('/calendar');
        return;
      }
      setEvent(eventData);
      setEventForm({
        title: eventData.title,
        type: eventData.type,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location || '',
        description: eventData.description || '',
        attendees: eventData.attendees,
        gigEarnings: eventData.gigEarnings || 0,
      });

      // Initialize earnings form
      setEarningsForm({
        gigEarnings: eventData.gigEarnings || 0,
      });

      // Fetch users for attendee management
      const usersData = await getUsersByBandId(bandId);
      setUsers(usersData);

      // Fetch gear for gear assignment
      const gearData = await getGearByBandId(bandId);
      setGear(gearData);

      // Fetch gear boxes
      const gearBoxData = await getGearBoxesByBandId(bandId);
      setGearBoxes(gearBoxData);

      // Fetch available gear (not in boxes)
      const availableGearData = await getAvailableGear(bandId, eventId);
      setAvailableGear(availableGearData);

      // Fetch event gear assignments
      const eventGearData = await getEventGear(eventId);
      setEventGear(eventGearData);

      // Fetch event gear box assignments
      const eventGearBoxData = await getEventGearBoxes(eventId);
      setEventGearBoxes(eventGearBoxData);

      // Fetch event logistics
      const logisticsData = await getEventLogistics(eventId);
      setEventLogistics(logisticsData);

      // Fetch event expenses and calculate financials
      const expensesData = await getEventExpenses(eventId);
      setExpenses(expensesData);
      
      const financialsData = await calculateEventFinancials(eventId, eventData.gigEarnings || 0);
      setEventFinancials(financialsData);

    } catch (error) {
      console.error('Error fetching event data:', error);
      router.push('/calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!event) return;

    try {
      await updateEvent(event.id!, eventForm);
      
      // Update local state
      setEvent({
        ...event,
        ...eventForm
      });

      // Refresh financials if it's a gig and earnings changed
      if (event.type === 'gig' && eventForm.gigEarnings !== event.gigEarnings) {
        refreshFinancials();
      }

      setIsEditing(false);
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    const confirmed = confirm(`Are you sure you want to delete "${event.title}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteEvent(event.id!);
      router.push('/calendar');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleAttendeeToggle = async (userId: string) => {
    if (!event) return;

    const currentUser = user || sessionUser;
    if (!currentUser) return;

    // Get current user's data to check permissions
    const currentUserData = users.find(u => (u.id || u.uid) === currentUser.uid);
    
    // Check if current user can manage this attendee
    if (!canManageAttendee(currentUserData || null, userId)) {
      alert('You can only manage your own attendance. Admins can manage everyone\'s attendance.');
      return;
    }

    // Get user name for the modal
    const targetUser = users.find(u => (u.id || u.uid) === userId);
    const userName = targetUser ? targetUser.name : 'Unknown User';
    
    const isCurrentlyAttending = event.attendees.includes(userId);
    const currentNote = getAttendanceNote(event, userId) || '';

    // Show note modal
    setNoteModalData({
      userId,
      userName,
      currentNote,
      isAttending: !isCurrentlyAttending // Will be the new status
    });
    setShowNoteModal(true);
  };

  const handleAttendanceWithNote = async (userId: string, note: string, isAttending: boolean) => {
    if (!event) return;

    try {
      if (isAttending) {
        await addAttendeeToEvent(event.id!, userId, note);
        const newAttendingEntry: any = {
          userId,
          status: 'attending' as const,
          timestamp: new Date()
        };
        
        // Only add note field if it has a value
        if (note && note.trim().length > 0) {
          newAttendingEntry.note = note.trim();
        }

        setEvent({
          ...event,
          attendees: [...event.attendees, userId],
          attendanceEntries: [
            ...(event.attendanceEntries || []).filter(entry => entry.userId !== userId),
            newAttendingEntry
          ]
        });
        setEventForm({
          ...eventForm,
          attendees: [...eventForm.attendees, userId]
        });
      } else {
        await removeAttendeeFromEvent(event.id!, userId, note);
        const newNotAttendingEntry: any = {
          userId,
          status: 'not_attending' as const,
          timestamp: new Date()
        };
        
        // Only add note field if it has a value
        if (note && note.trim().length > 0) {
          newNotAttendingEntry.note = note.trim();
        }

        setEvent({
          ...event,
          attendees: event.attendees.filter(id => id !== userId),
          attendanceEntries: [
            ...(event.attendanceEntries || []).filter(entry => entry.userId !== userId),
            newNotAttendingEntry
          ]
        });
        setEventForm({
          ...eventForm,
          attendees: eventForm.attendees.filter(id => id !== userId)
        });
      }
      
      setShowNoteModal(false);
      setNoteModalData(null);
    } catch (error) {
      console.error('Error updating attendees:', error);
      alert('Failed to update attendees. Please try again.');
    }
  };

  const handleAddGear = async () => {
    if (!event) return;

    try {
      for (const gearAssignment of selectedGear) {
        await addGearToEvent({
          eventId: event.id!,
          gearId: gearAssignment.gearId,
          quantity: gearAssignment.quantity,
          assignedTo: gearAssignment.assignedTo,
          status: 'planned'
        });
      }

      // Refresh event gear
      const eventGearData = await getEventGear(event.id!);
      setEventGear(eventGearData);
      setSelectedGear([]);
      setShowGearModal(false);
      alert('Gear assignments added successfully!');
    } catch (error) {
      console.error('Error adding gear:', error);
      alert('Failed to add gear assignments. Please try again.');
    }
  };

  const handleRemoveGear = async (eventGearId: string) => {
    try {
      await removeGearFromEvent(eventGearId);
      setEventGear(eventGear.filter(eg => eg.id !== eventGearId));
    } catch (error) {
      console.error('Error removing gear:', error);
      alert('Failed to remove gear assignment. Please try again.');
    }
  };

  // Gear Box functions
  const handleAddGearBoxes = async () => {
    if (!event) return;

    const currentUser = user || sessionUser;
    if (!currentUser) return;

    try {
      // Get all gear IDs that will be added via boxes
      const gearIdsInNewBoxes = new Set<string>();
      for (const gearBoxAssignment of selectedGearBoxes) {
        const box = gearBoxes.find(gb => gb.id === gearBoxAssignment.gearBoxId);
        if (box) {
          box.gearIds.forEach(gearId => gearIdsInNewBoxes.add(gearId));
        }
      }

      // Remove any individual gear assignments that are now covered by the boxes
      const currentEventGear = await getEventGear(event.id!);
      for (const eventGearItem of currentEventGear) {
        if (gearIdsInNewBoxes.has(eventGearItem.gearId)) {
          await removeGearFromEvent(eventGearItem.id!);
        }
      }

      for (const gearBoxAssignment of selectedGearBoxes) {
        await addGearBoxToEvent({
          eventId: event.id!,
          gearBoxId: gearBoxAssignment.gearBoxId,
          quantity: 1, // Usually 1 for gear boxes
          assignedTo: gearBoxAssignment.assignedTo,
          status: 'planned'
        });
      }

      // Refresh both event gear and event gear boxes
      const [eventGearData, eventGearBoxData] = await Promise.all([
        getEventGear(event.id!),
        getEventGearBoxes(event.id!)
      ]);
      setEventGear(eventGearData);
      setEventGearBoxes(eventGearBoxData);
      setSelectedGearBoxes([]);
      setShowGearModal(false);
      alert('Gear box assignments added successfully!');
    } catch (error) {
      console.error('Error adding gear boxes:', error);
      alert('Failed to add gear box assignments. Please try again.');
    }
  };

  const handleRemoveGearBox = async (eventGearBoxId: string) => {
    try {
      await removeGearBoxFromEvent(eventGearBoxId);
      setEventGearBoxes(eventGearBoxes.filter(egb => egb.id !== eventGearBoxId));
    } catch (error) {
      console.error('Error removing gear box:', error);
      alert('Failed to remove gear box assignment. Please try again.');
    }
  };

  const handleGearAssignment = async () => {
    if (gearAssignmentTab === 'individual') {
      await handleAddGear();
    } else {
      await handleAddGearBoxes();
    }
  };

  const getEventTypeIcon = (type: string) => {
    return type === 'gig' ? '🎤' : '🎸';
  };

  const getEventTypeColor = (type: string) => {
    return type === 'gig' ? 'bg-yellow-600' : 'bg-blue-600';
  };

  // Helper function to toggle gear box expansion
  const toggleGearBoxExpansion = (gearBoxId: string) => {
    setExpandedGearBoxes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(gearBoxId)) {
        newSet.delete(gearBoxId);
      } else {
        newSet.add(gearBoxId);
      }
      return newSet;
    });
  };

  // Helper function to get category icon (same as in gear page)
  const getCategoryIcon = (category: string, fallbackType: string) => {
    // Microphones
    if (category.includes('Vocal') || category.includes('Dynamic')) return '🎤';
    if (category.includes('Condenser') || category.includes('USB')) return '🎙️';
    if (category.includes('Wireless') || category.includes('Lavalier')) return '📡';
    
    // Cables
    if (category.includes('XLR') || category.includes('TRS') || category.includes('TS')) return '🔌';
    if (category.includes('Power') || category.includes('Extension')) return '⚡';
    if (category.includes('MIDI') || category.includes('USB')) return '🔗';
    
    // Instruments
    if (category.includes('Guitar') && !category.includes('Amplifier')) return '🎸';
    if (category.includes('Bass') && !category.includes('Amplifier')) return '🎸';
    if (category.includes('Piano') || category.includes('Keyboard')) return '🎹';
    
    // Default fallback based on type
    switch (fallbackType) {
      case 'microphone': return '🎤';
      case 'cable': return '🔌';
      case 'instrument': return '🎸';
      case 'amplifier': return '🔊';
      case 'percussion': return '🥁';
      case 'audio-equipment': return '🎚️';
      case 'accessory': return '🎵';
      case 'lighting': return '💡';
      default: return '📦';
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
        vehicleType: logisticsForm.vehicleType,
        vehicleName: logisticsForm.vehicleName,
        capacity: logisticsForm.capacity,
        departureLocation: logisticsForm.departureLocation,
        arrivalLocation: logisticsForm.arrivalLocation || event.location || '',
        departureTime: logisticsForm.departureTime,
        returnTime: logisticsForm.returnTime,
        notes: logisticsForm.notes,
        passengers: [], // Start with no passengers
        distance: logisticsForm.distance || undefined,
      });

      // Refresh logistics data
      if (!event || !event.id) return;
      const logisticsData = await getEventLogistics(event.id);
      setEventLogistics(logisticsData);
      
      // Auto-create transport expense if distance is provided
      if (logisticsForm.distance > 0) {
        await createExpense({
          eventId: event.id,
          userId: currentUser.uid,
          type: 'transport',
          amount: calculateTransportExpense(logisticsForm.distance),
          description: `Transport to ${event.title} (${logisticsForm.distance}km)`,
          distance: logisticsForm.distance,
          reimbursementRate: DEFAULT_TRANSPORT_RATE,
          approved: false,
        });
        
        // Refresh expenses and financials
        const expensesData = await getEventExpenses(event.id);
        setExpenses(expensesData);
        
        const financialsData = await calculateEventFinancials(event.id, event.gigEarnings || 0);
        setEventFinancials(financialsData);
      }
      
      // Reset form
      setLogisticsForm({
        vehicleType: 'car',
        vehicleName: '',
        capacity: 4,
        departureLocation: '',
        arrivalLocation: '',
        departureTime: '',
        returnTime: '',
        notes: '',
        distance: 0,
      });
      setShowLogisticsModal(false);
      alert('Vehicle logistics added successfully!');
    } catch (error) {
      console.error('Error adding logistics:', error);
      alert('Failed to add vehicle logistics. Please try again.');
    }
  };

  // Expense functions
  const handleAddExpense = async () => {
    if (!event) return;

    const currentUser = user || sessionUser;
    if (!currentUser) return;

    try {
      // Calculate amount based on expense type
      let finalAmount = expenseForm.amount;
      if (expenseForm.type === 'transport' && expenseForm.distance > 0) {
        finalAmount = calculateTransportExpense(expenseForm.distance);
      }

      // Create expense object with only defined fields
      const expenseData: any = {
        eventId: event.id!,
        userId: currentUser.uid,
        type: expenseForm.type,
        amount: finalAmount,
        description: expenseForm.description,
        approved: false, // Expenses need approval
      };

      // Only add transport-specific fields if it's a transport expense
      if (expenseForm.type === 'transport' && expenseForm.distance > 0) {
        expenseData.distance = expenseForm.distance;
        expenseData.reimbursementRate = DEFAULT_TRANSPORT_RATE;
      }

      await createExpense(expenseData);

      // Refresh expenses and financials
      if (!event || !event.id) return;
      const expensesData = await getEventExpenses(event.id);
      setExpenses(expensesData);
      
      const financialsData = await calculateEventFinancials(event.id, event.gigEarnings || 0);
      setEventFinancials(financialsData);
      
      // Reset form
      setExpenseForm({
        type: 'transport',
        amount: 0,
        description: '',
        distance: 0,
      });
      setShowExpenseModal(false);
      alert('Expense added successfully! It needs approval for reimbursement.');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleApproveExpense = async (expenseId: string) => {
    try {
      await updateExpense(expenseId, { approved: true });
      
      // Refresh expenses and financials
      if (!event || !event.id) return;
      const expensesData = await getEventExpenses(event.id);
      setExpenses(expensesData);
      
      const financialsData = await calculateEventFinancials(event.id, event.gigEarnings || 0);
      setEventFinancials(financialsData);
    } catch (error) {
      console.error('Error approving expense:', error);
      alert('Failed to approve expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      
      // Refresh expenses and financials
      if (!event || !event.id) return;
      const expensesData = await getEventExpenses(event.id);
      setExpenses(expensesData);
      
      const financialsData = await calculateEventFinancials(event.id, event.gigEarnings || 0);
      setEventFinancials(financialsData);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleUpdateEarnings = async () => {
    if (!event) return;

    try {
      await updateEvent(event.id!, { gigEarnings: earningsForm.gigEarnings });
      
      // Update local state
      setEvent({
        ...event,
        gigEarnings: earningsForm.gigEarnings
      });

      // Refresh financials
      if (event.id) {
        const financialsData = await calculateEventFinancials(event.id, earningsForm.gigEarnings);
        setEventFinancials(financialsData);
      }

      setShowEarningsModal(false);
      alert('Gig earnings updated successfully!');
    } catch (error) {
      console.error('Error updating earnings:', error);
      alert('Failed to update earnings. Please try again.');
    }
  };

  const refreshFinancials = async () => {
    if (!event || !event.id) return;
    try {
      const financialsData = await calculateEventFinancials(event.id, event.gigEarnings || 0);
      setEventFinancials(financialsData);
    } catch (error) {
      console.error('Error refreshing financials:', error);
    }
  };

  const handleRemoveLogistics = async (logisticsId: string) => {
    try {
      await deleteEventLogistics(logisticsId);
      setEventLogistics(eventLogistics.filter(l => l.id !== logisticsId));
    } catch (error) {
      console.error('Error removing logistics:', error);
      alert('Failed to remove vehicle logistics. Please try again.');
    }
  };

  const handleTogglePassenger = async (logisticsId: string, userId: string) => {
    try {
      const logistics = eventLogistics.find(l => l.id === logisticsId);
      if (!logistics) return;

      const isCurrentlyPassenger = logistics.passengers.includes(userId);
      
      if (isCurrentlyPassenger) {
        await removePassengerFromLogistics(logisticsId, userId);
      } else {
        await addPassengerToLogistics(logisticsId, userId);
      }

      // Refresh logistics data
      if (!event || !event.id) return;
      const logisticsData = await getEventLogistics(event.id);
      setEventLogistics(logisticsData);
    } catch (error) {
      console.error('Error updating passenger:', error);
      alert(error instanceof Error ? error.message : 'Failed to update passenger. Please try again.');
    }
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => (u.id || u.uid) === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  // Remove the old formatDate function since we're using the utility now

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <AuthNav currentPage="calendar" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading event...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <AuthNav currentPage="calendar" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 mb-4">Event not found</p>
              <button
                onClick={() => router.push('/calendar')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <AuthNav currentPage="calendar" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/calendar')}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4"
              >
                ← Back to Calendar
              </button>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    ✏️ Edit Event
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveEvent}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${getEventTypeColor(event.type)}`}>
                <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    className="text-3xl font-bold bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{event.title}</h1>
                )}
                <p className="text-gray-400 capitalize">{event.type}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Basic Info */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    />
                  ) : (
                    <p className="text-white">{formatDateSafe(event.date)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Time</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    />
                  ) : (
                    <p className="text-white">{event.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      placeholder="Event location"
                    />
                  ) : (
                    <p className="text-white">{event.location || 'No location specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Type</label>
                  {isEditing ? (
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({...eventForm, type: e.target.value as 'rehearsal' | 'gig'})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    >
                      <option value="rehearsal">Rehearsal</option>
                      <option value="gig">Gig</option>
                    </select>
                  ) : (
                    <p className="text-white capitalize">{event.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Description</label>
                  {isEditing ? (
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                      rows={3}
                      placeholder="Event description"
                    />
                  ) : (
                    <p className="text-white">{event.description || 'No description provided'}</p>
                  )}
                </div>

                {/* Gig Earnings Field - Only show for gigs */}
                {(event.type === 'gig' || (isEditing && eventForm.type === 'gig')) && (
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <label className="block text-green-400 text-sm font-medium mb-2">
                      💰 Gig Earnings (DKK) *
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={eventForm.gigEarnings}
                          onChange={(e) => setEventForm({...eventForm, gigEarnings: parseFloat(e.target.value) || 0})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg font-medium focus:border-green-500 focus:outline-none"
                          placeholder="0.00"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Enter the total amount earned for this gig in Danish Kroner (DKK)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white text-2xl font-bold">{formatCurrency(event.gigEarnings || 0)}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Total earnings for this gig
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Attendees</h2>
                  <p className="text-gray-400 text-sm">
                    {event.attendees.length} of {users.length} members attending
                  </p>
                </div>
                <div className="text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded-lg">
                  {(() => {
                    const currentUser = user || sessionUser;
                    const currentUserData = users.find(u => (u.id || u.uid) === currentUser?.uid);
                    return hasAdminPermission(currentUserData || null) 
                      ? '👑 Admin Access' 
                      : '👤 Member Access';
                  })()}
                </div>
              </div>

              {/* Attending Members */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-green-400 mb-4">
                  Attending ({event.attendees.length})
                </h3>
                <div className="space-y-2">
                  {users
                    .filter(bandUser => event.attendees.includes(bandUser.id || bandUser.uid || ''))
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
                            : 'border-green-500/30 bg-green-500/5'
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
                                  {hasAttendanceNote(event, userId) && (
                                    <button
                                      onClick={() => {
                                        const note = getAttendanceNote(event, userId);
                                        alert(`Note: ${note}`);
                                      }}
                                      className="text-blue-400 hover:text-blue-300 text-sm"
                                      title="View attendance note"
                                    >
                                      💬
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{bandUser.instrument || bandUser.role}</p>
                              </div>
                            </div>
                            {canManage && (
                              <button
                                onClick={() => handleAttendeeToggle(userId)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
                {event.attendees.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No one is attending yet</p>
                  </div>
                )}
              </div>

              {/* Not Attending Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-4">
                  Not Attending ({users.length - event.attendees.length})
                </h3>
                <div className="space-y-2">
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
                                  {hasAttendanceNote(event, userId) && (
                                    <button
                                      onClick={() => {
                                        const note = getAttendanceNote(event, userId);
                                        alert(`Note: ${note}`);
                                      }}
                                      className="text-blue-400 hover:text-blue-300 text-sm"
                                      title="View attendance note"
                                    >
                                      💬
                                    </button>
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

          {/* Gear Section - Only show for gigs */}
          {event.type === 'gig' && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Gear & Equipment</h2>
                <button
                  onClick={() => setShowGearModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  + Add Gear
                </button>
              </div>

            {eventGear.length === 0 && eventGearBoxes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No gear assigned to this event yet.</p>
                <button
                  onClick={() => setShowGearModal(true)}
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  Click here to add gear
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Individual Gear */}
                {eventGear.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      🎸 Individual Gear ({eventGear.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventGear.map(item => (
                        <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.gear.name}</h4>
                            <button
                              onClick={() => handleRemoveGear(item.id!)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">Quantity: {item.quantity}</p>
                          {item.assignedTo && (
                            <p className="text-sm text-gray-400">
                              Assigned to: {users.find(u => u.id === item.assignedTo)?.name || 'Unknown'}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.status === 'delivered' ? 'bg-green-600' :
                              item.status === 'packed' ? 'bg-yellow-600' :
                              item.status === 'returned' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gear Boxes */}
                {eventGearBoxes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      📦 Gear Boxes ({eventGearBoxes.length})
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventGearBoxes.map(item => {
                        const isExpanded = expandedGearBoxes.has(item.gearBox.id!);
                        const boxGear = gear.filter(g => item.gearBox.gearIds.includes(g.id!));
                        
                        return (
                          <div 
                            key={item.id} 
                            className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4 hover:bg-purple-900/30 transition-colors cursor-pointer"
                            onClick={() => toggleGearBoxExpansion(item.gearBox.id!)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium flex items-center gap-2">
                                📦 {item.gearBox.name}
                              </h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveGearBox(item.id!);
                                  }}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">
                              Contains {item.gearBox.gearIds.length} item{item.gearBox.gearIds.length !== 1 ? 's' : ''}
                            </p>
                            {item.gearBox.description && (
                              <p className="text-sm text-gray-400 mb-2">{item.gearBox.description}</p>
                            )}
                            
                            {/* Expandable Contents */}
                            {isExpanded && boxGear.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-purple-800/30">
                                <div className="text-xs text-purple-400 font-medium uppercase tracking-wide mb-2">
                                  Contents:
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {boxGear.map(gearItem => (
                                    <div key={gearItem.id} className="flex items-center gap-2 p-1 bg-gray-800/30 rounded text-xs">
                                      <span className="text-sm">{getCategoryIcon(gearItem.category || '', gearItem.type)}</span>
                                      <div className="flex-1">
                                        <div className="text-white font-medium">{gearItem.name}</div>
                                        {(gearItem.brand || gearItem.model) && (
                                          <div className="text-gray-400">
                                            {gearItem.brand && `${gearItem.brand} `}{gearItem.model}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {item.assignedTo && (
                              <p className="text-sm text-gray-400 mt-2">
                                Assigned to: {users.find(u => u.id === item.assignedTo)?.name || 'Unknown'}
                              </p>
                            )}
                            <div className="mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.status === 'delivered' ? 'bg-green-600' :
                                item.status === 'packed' ? 'bg-yellow-600' :
                                item.status === 'returned' ? 'bg-blue-600' :
                                'bg-gray-600'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          )}

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
                        </div>
                      </div>
                      {(user?.uid || sessionUser?.uid) === logistics.userId && (
                        <button
                          onClick={() => handleRemoveLogistics(logistics.id!)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="text-sm">{logistics.departureLocation}</p>
                        {logistics.departureTime && (
                          <p className="text-sm text-gray-400">{logistics.departureTime}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="text-sm">{logistics.arrivalLocation || event.location || 'Event location'}</p>
                        {logistics.returnTime && (
                          <p className="text-sm text-gray-400">Return: {logistics.returnTime}</p>
                        )}
                      </div>
                    </div>

                    {logistics.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-sm text-gray-300">{logistics.notes}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Passengers</h4>
                        <span className="text-sm text-gray-400">
                          {logistics.capacity - logistics.passengers.length - 1} seats available
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Driver */}
                        <div className="flex items-center gap-2 bg-yellow-600 text-black px-3 py-1 rounded-full text-sm">
                          <span>👤</span>
                          <span>{getUserName(logistics.userId)} (Driver)</span>
                        </div>

                        {/* Passengers */}
                        {logistics.passengers.map(passengerId => (
                          <div key={passengerId} className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                            <span>👤</span>
                            <span>{getUserName(passengerId)}</span>
                            {((user?.uid || sessionUser?.uid) === passengerId || 
                              (user?.uid || sessionUser?.uid) === logistics.userId) && (
                              <button
                                onClick={() => handleTogglePassenger(logistics.id!, passengerId)}
                                className="text-red-200 hover:text-white text-xs ml-1"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add passenger buttons for attending users */}
                        {users
                          .filter(bandUser => {
                            const userId = bandUser.id || bandUser.uid || '';
                            return event.attendees.includes(userId) && 
                                   userId !== logistics.userId && 
                                   !logistics.passengers.includes(userId) &&
                                   logistics.passengers.length < logistics.capacity - 1;
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
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Financial Overview Section - Only show for gigs */}
          {event.type === 'gig' && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">💰 Financial Overview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEarningsForm({ gigEarnings: event.gigEarnings || 0 });
                      setShowEarningsModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    💰 Edit Earnings
                  </button>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    + Add Expense
                  </button>
                </div>
              </div>

              {/* Current Earnings Display */}
              <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-400 font-medium mb-1">🎤 Gig Earnings</h3>
                    <p className="text-3xl font-bold text-blue-300">{formatCurrency(event.gigEarnings || 0)}</p>
                    {(event.gigEarnings || 0) === 0 && (
                      <p className="text-sm text-gray-400 mt-1">Click "Edit Earnings" to add gig income</p>
                    )}
                  </div>
                  {(event.gigEarnings || 0) > 0 && (
                    <div className="text-sm text-blue-400 bg-blue-600/20 px-3 py-2 rounded-lg">
                      ✓ Earnings Set
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              {eventFinancials && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2">💰 Total Earnings</h3>
                    <p className="text-2xl font-bold text-blue-300">{formatCurrency(eventFinancials.earnings)}</p>
                  </div>
                  
                  <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4">
                    <h3 className="text-orange-400 font-medium mb-2">💸 Total Expenses</h3>
                    <p className="text-2xl font-bold text-orange-300">{formatCurrency(eventFinancials.totalExpenses)}</p>
                  </div>
                  
                  <div className={`border rounded-lg p-4 ${
                    eventFinancials.netProfit >= 0 
                      ? 'bg-green-600/20 border-green-600/30' 
                      : 'bg-red-600/20 border-red-600/30'
                  }`}>
                    <h3 className={`font-medium mb-2 ${
                      eventFinancials.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      📊 Net Profit
                    </h3>
                    <p className={`text-2xl font-bold ${
                      eventFinancials.netProfit >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {formatCurrency(eventFinancials.netProfit)}
                    </p>
                  </div>
                </div>
              )}

              {/* Expenses List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No expenses recorded yet.</p>
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="mt-2 text-green-400 hover:text-green-300"
                    >
                      Click here to add an expense
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map(expense => {
                      const expenseUser = users.find(u => (u.id || u.uid) === expense.userId);
                      const currentUser = user || sessionUser;
                      const currentUserData = users.find(u => (u.id || u.uid) === currentUser?.uid);
                      const canManageExpense = (currentUser?.uid === expense.userId) || hasAdminPermission(currentUserData || null);
                      
                      return (
                        <div key={expense.id} className={`bg-gray-800 rounded-lg p-4 border ${
                          expense.approved ? 'border-green-600/30' : 'border-yellow-600/30'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{getExpenseTypeIcon(expense.type)}</span>
                              <div>
                                <h4 className="font-medium">{expense.description}</h4>
                                <p className="text-sm text-gray-400">
                                  {expenseUser?.name || 'Unknown User'} • {expense.type}
                                  {expense.distance && ` • ${expense.distance}km`}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-bold">{formatCurrency(expense.amount)}</span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    expense.approved 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-yellow-600 text-black'
                                  }`}>
                                    {expense.approved ? 'Approved' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {!expense.approved && hasAdminPermission(currentUserData || null) && (
                                <button
                                  onClick={() => handleApproveExpense(expense.id!)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                                >
                                  Approve
                                </button>
                              )}
                              {canManageExpense && (
                                <button
                                  onClick={() => handleDeleteExpense(expense.id!)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reimbursements */}
              {eventFinancials && eventFinancials.reimbursements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Reimbursements Due</h3>
                  <div className="space-y-3">
                    {eventFinancials.reimbursements.map(reimbursement => {
                      const reimbursementUser = users.find(u => (u.id || u.uid) === reimbursement.userId);
                      return (
                        <div key={reimbursement.userId} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{reimbursementUser?.name || 'Unknown User'}</h4>
                              <p className="text-sm text-gray-400">
                                {reimbursement.expenses.length} expense{reimbursement.expenses.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-400">{formatCurrency(reimbursement.totalAmount)}</p>
                              <p className="text-xs text-gray-400">to be reimbursed</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logistics Modal */}
          {showLogisticsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Add Your Vehicle</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Vehicle Type *</label>
                      <select
                        value={logisticsForm.vehicleType}
                        onChange={(e) => setLogisticsForm({
                          ...logisticsForm,
                          vehicleType: e.target.value as 'car' | 'van' | 'truck' | 'bus' | 'other'
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      >
                        <option value="car">🚗 Car</option>
                        <option value="van">🚐 Van</option>
                        <option value="truck">🚚 Truck</option>
                        <option value="bus">🚌 Bus</option>
                        <option value="other">🚙 Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Vehicle Name (Optional)</label>
                      <input
                        type="text"
                        value={logisticsForm.vehicleName}
                        onChange={(e) => setLogisticsForm({...logisticsForm, vehicleName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        placeholder="e.g., Honda Civic, Red Van..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Total Capacity (including driver) *</label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={logisticsForm.capacity}
                      onChange={(e) => setLogisticsForm({...logisticsForm, capacity: parseInt(e.target.value) || 4})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="4"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Departure Location *</label>
                    <input
                      type="text"
                      value={logisticsForm.departureLocation}
                      onChange={(e) => setLogisticsForm({...logisticsForm, departureLocation: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Where are you leaving from?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Destination (Optional)</label>
                    <input
                      type="text"
                      value={logisticsForm.arrivalLocation}
                      onChange={(e) => setLogisticsForm({...logisticsForm, arrivalLocation: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder={`Event location: ${event.location || 'Not specified'}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Departure Time</label>
                      <input
                        type="time"
                        value={logisticsForm.departureTime}
                        onChange={(e) => setLogisticsForm({...logisticsForm, departureTime: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Return Time</label>
                      <input
                        type="time"
                        value={logisticsForm.returnTime}
                        onChange={(e) => setLogisticsForm({...logisticsForm, returnTime: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Total Distance (km) - For expense tracking</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={logisticsForm.distance}
                      onChange={(e) => setLogisticsForm({...logisticsForm, distance: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Round trip distance in km"
                    />
                    {logisticsForm.distance > 0 && (
                      <p className="text-sm text-green-400 mt-1">
                        Estimated fuel compensation: {formatCurrency(calculateTransportExpense(logisticsForm.distance))}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Notes (Optional)</label>
                    <textarea
                      value={logisticsForm.notes}
                      onChange={(e) => setLogisticsForm({...logisticsForm, notes: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      rows={3}
                      placeholder="Any additional details about the ride..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddLogistics}
                    disabled={!logisticsForm.departureLocation || logisticsForm.capacity < 2}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Add Vehicle
                  </button>
                  <button
                    onClick={() => {
                      setShowLogisticsModal(false);
                      setLogisticsForm({
                        vehicleType: 'car',
                        vehicleName: '',
                        capacity: 4,
                        departureLocation: '',
                        arrivalLocation: '',
                        departureTime: '',
                        returnTime: '',
                        notes: '',
                        distance: 0,
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

          {/* Gear Assignment Modal */}
          {showGearModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Assign Gear to Event</h2>
                
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setSelectedGear([...selectedGear, { gearId: '', quantity: 1 }]);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    + Add Gear Assignment
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedGear.map((assignment, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded">
                      <select
                        value={assignment.gearId}
                        onChange={(e) => {
                          const updated = [...selectedGear];
                          updated[index].gearId = e.target.value;
                          setSelectedGear(updated);
                        }}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                      >
                        <option value="">Select gear...</option>
                        {gear.map(item => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={assignment.quantity}
                        onChange={(e) => {
                          const updated = [...selectedGear];
                          updated[index].quantity = parseInt(e.target.value) || 1;
                          setSelectedGear(updated);
                        }}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                        placeholder="Quantity"
                      />

                      <select
                        value={assignment.assignedTo || ''}
                        onChange={(e) => {
                          const updated = [...selectedGear];
                          updated[index].assignedTo = e.target.value || undefined;
                          setSelectedGear(updated);
                        }}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                      >
                        <option value="">Assign to...</option>
                        {users.filter(user => {
                          const userId = user.id || user.uid || '';
                          return event.attendees.includes(userId);
                        }).map(user => (
                          <option key={user.id || user.uid} value={user.id || user.uid}>{user.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setSelectedGear(selectedGear.filter((_, i) => i !== index));
                        }}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddGear}
                    disabled={selectedGear.length === 0 || selectedGear.some(g => !g.gearId)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Save Assignments
                  </button>
                  <button
                    onClick={() => {
                      setShowGearModal(false);
                      setSelectedGear([]);
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
                        type: e.target.value as 'transport' | 'accommodation' | 'food' | 'equipment' | 'other'
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="transport">🚗 Transport</option>
                      <option value="accommodation">🏨 Accommodation</option>
                      <option value="food">🍕 Food & Drinks</option>
                      <option value="equipment">🎸 Equipment</option>
                      <option value="other">💰 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Description *</label>
                    <input
                      type="text"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Describe the expense..."
                    />
                  </div>

                  {expenseForm.type === 'transport' ? (
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Distance (km) - Auto-calculates at {DEFAULT_TRANSPORT_RATE} DKK/km
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={expenseForm.distance}
                        onChange={(e) => setExpenseForm({...expenseForm, distance: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        placeholder="Distance in kilometers"
                      />
                      {expenseForm.distance > 0 && (
                        <p className="text-sm text-green-400 mt-1">
                          Calculated amount: {formatCurrency(calculateTransportExpense(expenseForm.distance))}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Amount (DKK) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddExpense}
                    disabled={!expenseForm.description || (expenseForm.type !== 'transport' && expenseForm.amount <= 0) || (expenseForm.type === 'transport' && expenseForm.distance <= 0)}
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
                        distance: 0,
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
                <h2 className="text-xl font-bold text-white mb-4">💰 Edit Gig Earnings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-400 text-sm font-medium mb-2">
                      Gig Earnings (DKK) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={earningsForm.gigEarnings}
                      onChange={(e) => setEarningsForm({...earningsForm, gigEarnings: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg font-medium focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                      autoFocus
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Enter the total amount earned for this gig in Danish Kroner (DKK)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateEarnings}
                    disabled={earningsForm.gigEarnings < 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Update Earnings
                  </button>
                  <button
                    onClick={() => {
                      setShowEarningsModal(false);
                      setEarningsForm({ gigEarnings: event?.gigEarnings || 0 });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Gear Assignment Modal */}
          {showGearModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">🎸 Assign Gear to Event</h2>
                
                {/* Tab Selection */}
                <div className="mb-6">
                  <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg inline-flex">
                    <button
                      onClick={() => setGearAssignmentTab('individual')}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        gearAssignmentTab === 'individual'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Individual Gear
                    </button>
                    <button
                      onClick={() => setGearAssignmentTab('boxes')}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        gearAssignmentTab === 'boxes'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Gear Boxes
                    </button>
                  </div>
                </div>

                {gearAssignmentTab === 'individual' ? (
                  /* Individual Gear Assignment */
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Select individual gear items to assign to this event. Only available gear (not in boxes) is shown.
                    </p>
                    {availableGear.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No available gear items. All gear is either in boxes or already assigned.</p>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-lg">
                        <div className="space-y-2 p-4">
                          {availableGear.map(gearItem => {
                            const isSelected = selectedGear.some(sg => sg.gearId === gearItem.id);
                            const selectedItem = selectedGear.find(sg => sg.gearId === gearItem.id);
                            
                            return (
                              <div key={gearItem.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedGear([...selectedGear, { gearId: gearItem.id!, quantity: 1 }]);
                                      } else {
                                        setSelectedGear(selectedGear.filter(sg => sg.gearId !== gearItem.id));
                                      }
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                  />
                                  <div>
                                    <div className="text-white font-medium">{gearItem.name}</div>
                                    <div className="text-sm text-gray-400">
                                      {gearItem.brand && `${gearItem.brand} `}{gearItem.model}
                                    </div>
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                      <label className="text-sm text-gray-400">Qty:</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={selectedItem?.quantity || 1}
                                        onChange={(e) => {
                                          const newQuantity = parseInt(e.target.value) || 1;
                                          setSelectedGear(selectedGear.map(sg => 
                                            sg.gearId === gearItem.id 
                                              ? { ...sg, quantity: newQuantity }
                                              : sg
                                          ));
                                        }}
                                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                      />
                                    </div>
                                    <select
                                      value={selectedItem?.assignedTo || ''}
                                      onChange={(e) => {
                                        setSelectedGear(selectedGear.map(sg => 
                                          sg.gearId === gearItem.id 
                                            ? { ...sg, assignedTo: e.target.value || undefined }
                                            : sg
                                        ));
                                      }}
                                      className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                    >
                                      <option value="">Assign to...</option>
                                      {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Gear Box Assignment */
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Select gear boxes to assign to this event. Each box contains a pre-defined set of gear.
                    </p>
                    {gearBoxes.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No gear boxes available. Create gear boxes in the Gear page first.</p>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-lg">
                        <div className="space-y-2 p-4">
                          {gearBoxes.map(gearBox => {
                            const isSelected = selectedGearBoxes.some(sgb => sgb.gearBoxId === gearBox.id);
                            const selectedBox = selectedGearBoxes.find(sgb => sgb.gearBoxId === gearBox.id);
                            const boxGear = gear.filter(g => gearBox.gearIds.includes(g.id!));
                            
                            return (
                              <div key={gearBox.id} className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-800/30 rounded">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedGearBoxes([...selectedGearBoxes, { gearBoxId: gearBox.id! }]);
                                      } else {
                                        setSelectedGearBoxes(selectedGearBoxes.filter(sgb => sgb.gearBoxId !== gearBox.id));
                                      }
                                    }}
                                    className="form-checkbox h-4 w-4 text-purple-600"
                                  />
                                  <div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                      📦 {gearBox.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {boxGear.length} item{boxGear.length !== 1 ? 's' : ''}: {boxGear.slice(0, 3).map(g => g.name).join(', ')}{boxGear.length > 3 && '...'}
                                    </div>
                                    {gearBox.description && (
                                      <div className="text-xs text-gray-500 mt-1">{gearBox.description}</div>
                                    )}
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center space-x-3">
                                    <select
                                      value={selectedBox?.assignedTo || ''}
                                      onChange={(e) => {
                                        setSelectedGearBoxes(selectedGearBoxes.map(sgb => 
                                          sgb.gearBoxId === gearBox.id 
                                            ? { ...sgb, assignedTo: e.target.value || undefined }
                                            : sgb
                                        ));
                                      }}
                                      className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                    >
                                      <option value="">Assign to...</option>
                                      {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleGearAssignment}
                    disabled={
                      (gearAssignmentTab === 'individual' && selectedGear.length === 0) ||
                      (gearAssignmentTab === 'boxes' && selectedGearBoxes.length === 0)
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Assign {gearAssignmentTab === 'individual' ? 'Gear' : 'Gear Boxes'}
                  </button>
                  <button
                    onClick={() => {
                      setShowGearModal(false);
                      setSelectedGear([]);
                      setSelectedGearBoxes([]);
                      setGearAssignmentTab('individual');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Note Modal */}
        {showNoteModal && noteModalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">
                {noteModalData.isAttending ? 'Attending' : 'Not Attending'}: {noteModalData.userName}
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  value={noteModalData.currentNote}
                  onChange={(e) => setNoteModalData({
                    ...noteModalData,
                    currentNote: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  rows={3}
                  placeholder={`Why ${noteModalData.isAttending ? 'are you attending' : 'can\'t you attend'}?`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This note will be visible to other band members when they click the note icon.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAttendanceWithNote(
                    noteModalData.userId, 
                    noteModalData.currentNote, 
                    noteModalData.isAttending
                  )}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    noteModalData.isAttending
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {noteModalData.isAttending ? 'Mark as Attending' : 'Mark as Not Attending'}
                </button>
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteModalData(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
