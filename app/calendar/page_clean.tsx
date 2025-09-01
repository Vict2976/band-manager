'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { getEventsByBandId, Event } from '../../lib/eventService';
import { getUsersByBandId, User } from '../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../lib/bandService';
import ProtectedRoute from '../../lib/ProtectedRoute';
import AuthNav from '../../lib/AuthNav';

export default function CalendarPage() {
  const { user, sessionUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      // Get the current user's band ID
      const bandId = await getCurrentUserBand(currentUser.uid);
      
      // Fetch band information
      const bandData = await getBandById(bandId);
      setBand(bandData);
      
      const [eventsData, usersData] = await Promise.all([
        getEventsByBandId(bandId),
        getUsersByBandId(bandId)
      ]);
      setEvents(eventsData);
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.message?.includes('no band associated')) {
        // If user has no band, redirect to setup
        router.push('/setup');
      } else if (error.message?.includes('index')) {
        console.log('📝 Firebase Index Required - Please create the index using the URL in the console');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateString = formatDate(date);
    return events.filter(event => event.date === dateString);
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date);
    // Navigate to new event page with preselected date
    router.push(`/events/new?date=${dateString}`);
  };

  const handleEventClick = async (event: Event) => {
    // Navigate to the event page instead of opening a modal
    router.push(`/events/${event.id}`);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading calendar...</p>
          {band && <p className="text-sm text-gray-500 mt-2">Band: {band.name}</p>}
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AuthNav currentPage="calendar" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {band ? (
                  <>
                    <span style={{color: 'var(--gold)'}}>{band.name}</span> Calendar
                  </>
                ) : (
                  <>
                    Band <span style={{color: 'var(--gold)'}}>Calendar</span>
                  </>
                )}
              </h1>
              <p className="text-gray-400">Click on any date to create an event, or click on existing events to view them</p>
              {band && (
                <p className="text-sm text-gray-500 mt-2">
                  Band: {band.name} | Events: {events.length} | Members: {users.length}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/events/new')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                + New Event
              </button>
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                ←
              </button>
              <h2 className="text-2xl font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 rounded-lg transition-colors ${
                    day 
                      ? 'bg-gray-800 hover:bg-gray-700 cursor-pointer border border-gray-700' 
                      : ''
                  }`}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div className="font-semibold mb-1">{day.getDate()}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className={`text-xs p-1 rounded text-black font-medium cursor-pointer hover:opacity-80 ${
                              event.type === 'gig' 
                                ? 'bg-yellow-400' 
                                : 'bg-blue-400'
                            }`}
                          >
                            {event.type === 'gig' ? '🪩' : '🎼'} {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm">🎼 Rehearsal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">🪩 Gig</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
