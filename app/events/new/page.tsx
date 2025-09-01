'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { createEvent } from '../../../lib/eventService';
import { getUsersByBandId, User, canManageAttendee, hasAdminPermission } from '../../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../../lib/bandService';
import { createActivity } from '../../../lib/activityService';
import ProtectedRoute from '../../../lib/ProtectedRoute';
import AuthNav from '../../../lib/AuthNav';

function NewEventForm() {
  const { user, sessionUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDate = searchParams.get('date') || '';

  const [users, setUsers] = useState<User[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'rehearsal' as 'rehearsal' | 'gig',
    date: preselectedDate,
    time: '',
    location: '',
    description: '',
    attendees: [] as string[],
  });

  useEffect(() => {
    const currentUser = user || sessionUser;
    if (!authLoading && !currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser) {
      fetchData();
    }
  }, [user, sessionUser, authLoading, router]);

  const fetchData = async () => {
    const currentUser = user || sessionUser;
    if (!currentUser) return;
    
    try {
      setLoading(true);

      // Get current user's band
      const bandId = await getCurrentUserBand(currentUser.uid);
      
      // Fetch band info
      const bandData = await getBandById(bandId);
      setBand(bandData);

      // Fetch users for attendee selection
      const usersData = await getUsersByBandId(bandId);
      setUsers(usersData);

      // Auto-add current user to attendees if they're a band member
      if (currentUser) {
        const currentUserInBand = usersData.find(u => (u.id || u.uid) === currentUser.uid);
        if (currentUserInBand) {
          const currentUserId = currentUserInBand.id || currentUserInBand.uid || '';
          setEventForm(prev => ({
            ...prev,
            attendees: prev.attendees.includes(currentUserId) ? prev.attendees : [...prev.attendees, currentUserId]
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = user || sessionUser;
    if (!currentUser || !band) return;

    try {
      setSaving(true);
      
      const bandId = await getCurrentUserBand(currentUser.uid);
      const newEvent = await createEvent({
        ...eventForm,
        bandId,
        createdBy: currentUser.uid
      });

      // Track event creation activity
      if (band?.id) {
        await createActivity({
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || 'Unknown User',
          ...(currentUser.photoURL && { userPhotoURL: currentUser.photoURL }),
          bandId: band.id,
          type: 'event_create',
          action: `Created ${eventForm.type} "${eventForm.title}"`,
          details: {
            eventId: newEvent.id,
            eventTitle: eventForm.title,
            eventType: eventForm.type
          }
        });
      }

      // Navigate to the new event page
      router.push(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAttendeeToggle = (userId: string) => {
    const currentUser = user || sessionUser;
    if (!currentUser) return;

    // Get current user's data to check permissions
    const currentUserData = users.find(u => (u.id || u.uid) === currentUser.uid);
    
    // Check if current user can manage this attendee
    if (!canManageAttendee(currentUserData || null, userId)) {
      alert('You can only manage your own attendance. Admins can manage everyone\'s attendance.');
      return;
    }

    setEventForm(prev => ({
      ...prev,
      attendees: prev.attendees.includes(userId)
        ? prev.attendees.filter(id => id !== userId)
        : [...prev.attendees, userId]
    }));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <AuthNav currentPage="calendar" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading...</p>
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
            <button
              onClick={() => router.push('/calendar')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4"
            >
              ← Back to Calendar
            </button>
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-gray-400">Add a new rehearsal or gig to your calendar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Event Details */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., Weekly Rehearsal, Rock Concert"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Event Type *</label>
                  <select
                    required
                    value={eventForm.type}
                    onChange={(e) => setEventForm({...eventForm, type: e.target.value as 'rehearsal' | 'gig'})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="rehearsal">🎼 Rehearsal</option>
                    <option value="gig">🪩 Gig</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Time *</label>
                  <input
                    type="time"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., Studio A, The Rock Club, 123 Main St"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500"
                    rows={3}
                    placeholder="Additional details about the event..."
                  />
                </div>
              </div>
            </div>

            {/* Attendees Selection */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Select Attendees</h2>
                  <p className="text-gray-400 text-sm">
                    {eventForm.attendees.length} of {users.length} members selected
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

              {/* Selected Attendees */}
              {eventForm.attendees.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    Selected ({eventForm.attendees.length})
                  </h3>
                  <div className="space-y-2">
                    {users
                      .filter(bandUser => eventForm.attendees.includes(bandUser.id || bandUser.uid || ''))
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
                </div>
              )}

              {/* Available Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-4">
                  Available Members ({users.length - eventForm.attendees.length})
                </h3>
                <div className="space-y-2">
                  {users
                    .filter(bandUser => !eventForm.attendees.includes(bandUser.id || bandUser.uid || ''))
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
                {users.length - eventForm.attendees.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>All members are selected!</p>
                  </div>
                )}
              </div>

              {eventForm.attendees.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-gray-800 rounded-lg">
                  <p className="mb-2">No attendees selected yet</p>
                  <p className="text-sm">Click "Add" next to members above to include them in this event</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {saving ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/calendar')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function NewEventPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <NewEventForm />
    </Suspense>
  );
}
