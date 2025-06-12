'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { getEventById, updateEvent, deleteEvent, Event, addAttendeeToEvent, removeAttendeeFromEvent } from '../../../lib/eventService';
import { getUsersByBandId, User, canManageAttendee, hasAdminPermission } from '../../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../../lib/bandService';
import { getGearByBandId, addGearToEvent, getEventGear, removeGearFromEvent, updateEventGear, Gear, EventGear } from '../../../lib/gearService';
import { getEventLogistics, createEventLogistics, updateEventLogistics, deleteEventLogistics, addPassengerToLogistics, removePassengerFromLogistics, EventLogistics, getVehicleEmoji } from '../../../lib/logisticsService';
import { getEventExpenses, createExpense, calculateEventFinancials, formatCurrency, getExpenseTypeIcon, calculateTransportExpense, DEFAULT_TRANSPORT_RATE, Expense, EventFinancials } from '../../../lib/financialService';
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
  });

  // Gear assignment state
  const [showGearModal, setShowGearModal] = useState(false);
  const [selectedGear, setSelectedGear] = useState<{gearId: string, quantity: number, assignedTo?: string}[]>([]);

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
  });

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
      });

      // Fetch users for attendee management
      const usersData = await getUsersByBandId(bandId);
      setUsers(usersData);

      // Fetch gear for gear assignment
      const gearData = await getGearByBandId(bandId);
      setGear(gearData);

      // Fetch event gear assignments
      const eventGearData = await getEventGear(eventId);
      setEventGear(eventGearData);

      // Fetch event logistics
      const logisticsData = await getEventLogistics(eventId);
      setEventLogistics(logisticsData);

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

    try {
      const isCurrentlyAttending = event.attendees.includes(userId);
      
      if (isCurrentlyAttending) {
        await removeAttendeeFromEvent(event.id!, userId);
        setEvent({
          ...event,
          attendees: event.attendees.filter(id => id !== userId)
        });
        setEventForm({
          ...eventForm,
          attendees: eventForm.attendees.filter(id => id !== userId)
        });
      } else {
        await addAttendeeToEvent(event.id!, userId);
        setEvent({
          ...event,
          attendees: [...event.attendees, userId]
        });
        setEventForm({
          ...eventForm,
          attendees: [...eventForm.attendees, userId]
        });
      }
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

  const getEventTypeIcon = (type: string) => {
    return type === 'gig' ? '🎤' : '🎸';
  };

  const getEventTypeColor = (type: string) => {
    return type === 'gig' ? 'bg-yellow-600' : 'bg-blue-600';
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
      });

      // Refresh logistics data
      if (!event || !event.id) return;
      const logisticsData = await getEventLogistics(event.id);
      setEventLogistics(logisticsData);
      
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
      });
      setShowLogisticsModal(false);
      alert('Vehicle logistics added successfully!');
    } catch (error) {
      console.error('Error adding logistics:', error);
      alert('Failed to add vehicle logistics. Please try again.');
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

          {/* Gear Section */}
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

            {eventGear.length === 0 ? (
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventGear.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item.gear.name}</h3>
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
            )}
          </div>

          {/* Logistics Section */}
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
