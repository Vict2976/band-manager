'use client';

import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getEventsByBandId, Event } from '../../lib/eventService';
import { getBandById, Band, getCurrentUserBand, updateBand, uploadBandPhoto } from '../../lib/bandService';
import { getUsersByBandId, updateUserProfile, uploadUserPhoto, hasAdminPermission, User } from '../../lib/userService';
import ProtectedRoute from '../../lib/ProtectedRoute';
import AuthNav from '../../lib/AuthNav';

interface UserProfile {
  name: string;
  email: string;
  role?: string;
  instrument?: string;
  photoURL?: string;
}

export default function DashboardPage() {
  const { user, sessionUser, signOut, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditBand, setShowEditBand] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    instrument: ''
  });
  const [bandEditForm, setBandEditForm] = useState({
    name: '',
    description: '',
    genre: '',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBandFile, setSelectedBandFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingBand, setUploadingBand] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bandPreviewUrl, setBandPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user || sessionUser) {
      fetchUserProfile();
    }
  }, [user, sessionUser]);

  const handleNoBand = () => {
    // User has no band, redirect to setup
    router.push('/setup');
  };

  const fetchUserProfile = async () => {
    const currentUser = user || sessionUser;
    if (!currentUser) return;
    
    try {
      // Get user profile from Firestore first
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        // Store full user data for permission checking
        setCurrentUserData({
          id: currentUser.uid,
          uid: currentUser.uid,
          name: userData.name || currentUser.displayName || currentUser.email || 'User',
          email: userData.email || currentUser.email || '',
          role: userData.role,
          instrument: userData.instrument,
          photoURL: (userData.photoURL || currentUser.photoURL) || undefined,
          permission: userData.permission,
          bandId: userData.bandId
        });
        
        setUserProfile({
          name: userData.name || currentUser.displayName || currentUser.email || 'User',
          email: userData.email || currentUser.email || '',
          role: userData.role,
          instrument: userData.instrument,
          photoURL: (userData.photoURL || currentUser.photoURL) || undefined
        });

        // Use the user's bandId if they have one
        if (userData.bandId) {
          const userBand = await getBandById(userData.bandId);
          if (userBand) {
            setBand(userBand);
            // Get events for this specific band
            const events = await getEventsByBandId(userData.bandId);
            const now = new Date();
            const upcoming = events
              .filter(event => new Date(event.date) >= now)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3);
            setUpcomingEvents(upcoming);
          } else {
            console.warn('User has bandId but band not found:', userData.bandId);
            // Redirect to setup if user's band doesn't exist
            handleNoBand();
          }
        } else {
          // User has no band, redirect to setup
          handleNoBand();
        }
      } else {
        // User document doesn't exist, redirect to setup to create profile
        console.warn('User document not found, redirecting to setup');
        handleNoBand();
      }
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Redirect to setup in case of any error
      handleNoBand();
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInstrumentEmoji = (instrument: string) => {
    const emojiMap: { [key: string]: string } = {
        'Vocals': '🎤',
        'Guitar': '🎸',
        'Bass': '🎸',
        'Drums': '🥁',
        'Keyboard': '🎹',
        'Percussion': '🥁',
        'Violin': '🎻',
        'Saxophone': '🎷',
        'Trumpet': '🎺',
        'Trombone': '🎺',
        'Clarinet': '🎶',
        'Flute': '🎶',
        'Other': '🎵'
    };
    return emojiMap[instrument] || '🎵';
  };

  const handleEditProfile = () => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name,
        role: userProfile.role || '',
        instrument: userProfile.instrument || ''
      });
      setShowEditProfile(true);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = user || sessionUser;
    if (!currentUser) return;

    try {
      setUploading(true);
      
      let photoURL = userProfile?.photoURL;
      
      // Upload new photo if selected
      if (selectedFile) {
        photoURL = await uploadUserPhoto(selectedFile, currentUser.uid);
      }

      // Update user profile
      await updateUserProfile(currentUser.uid, {
        name: editForm.name,
        role: editForm.role,
        instrument: editForm.instrument,
        photoURL
      });

      // Update local state
      setUserProfile({
        ...userProfile!,
        name: editForm.name,
        role: editForm.role,
        instrument: editForm.instrument,
        photoURL
      });

      handleCancelEdit();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditProfile(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleEditBand = () => {
    // Only admins can edit band information
    if (!hasAdminPermission(currentUserData)) {
      alert('Only band admins can edit band information.');
      return;
    }
    
    if (band) {
      setBandEditForm({
        name: band.name,
        description: band.description || '',
        genre: band.genre || '',
        location: band.location || ''
      });
      setShowEditBand(true);
      setSelectedBandFile(null);
      setBandPreviewUrl(null);
    }
  };

  const handleBandFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setSelectedBandFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setBandPreviewUrl(url);
    }
  };

  const handleBandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!band?.id) return;

    try {
      setUploadingBand(true);
      
      let imageURL = band.imageURL;
      
      // Upload new photo if selected
      if (selectedBandFile) {
        imageURL = await uploadBandPhoto(selectedBandFile, band.id);
      }

      // Update band profile
      await updateBand(band.id, {
        name: bandEditForm.name,
        description: bandEditForm.description,
        genre: bandEditForm.genre,
        location: bandEditForm.location,
        imageURL: imageURL,
        updatedAt: new Date()
      });

      // Update local state
      setBand(prev => prev ? {
        ...prev,
        name: bandEditForm.name,
        description: bandEditForm.description,
        genre: bandEditForm.genre,
        location: bandEditForm.location,
        imageURL: imageURL
      } : null);

      setShowEditBand(false);
      setSelectedBandFile(null);
      setBandPreviewUrl(null);
    } catch (error) {
      console.error('Error updating band profile:', error);
      alert('Failed to update band profile. Please try again.');
    } finally {
      setUploadingBand(false);
    }
  };

  const currentUser = user || sessionUser;
  const displayName = userProfile?.name || currentUser?.displayName || currentUser?.email;

  if (loading || profileLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AuthNav currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span style={{color: 'var(--gold)'}}>{displayName}</span>!
          </h1>
          <p className="text-xl text-gray-400">
            {band ? (
              <>Ready to rock with <span style={{color: 'var(--gold)'}}>{band.name}</span>? Here's what's happening with your band.</>
            ) : (
              <>Ready to rock? Here's what's happening with your band.</>
            )}
          </p>
        </div>

        {/* User Profile Card */}
        {userProfile && (
          <div className="bg-gray-900 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {userProfile.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-black"
                         style={{background: 'var(--gold)'}}>
                      {getInitials(userProfile.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <span className="text-lg">{getInstrumentEmoji(userProfile.instrument || '')}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
                  <p className="text-yellow-400 font-medium">{userProfile.role}</p>
                  <p className="text-gray-400">{userProfile.instrument}</p>
                  <p className="text-sm text-gray-500 mt-1">{userProfile.email}</p>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <span>✏️</span>
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Band Profile Card */}
        {band && (
          <div className="bg-gray-900 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {band.imageURL ? (
                    <img 
                      src={band.imageURL} 
                      alt={band.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-black"
                         style={{background: 'var(--gold)'}}>
                      {getInitials(band.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <span className="text-lg">🎵</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{band.name}</h2>
                  <p className="text-yellow-400 font-medium">{band.genre}</p>
                  {band.description && <p className="text-gray-400">{band.description}</p>}
                  {band.location && <p className="text-sm text-gray-500 mt-1">📍 {band.location}</p>}
                  {band.founded && (
                    <p className="text-sm text-gray-500">
                      Founded {new Date(band.founded).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
              {hasAdminPermission(currentUserData) && (
                <button
                  onClick={handleEditBand}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>✏️</span>
                  Edit Band
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a 
            href="/users"
            className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all hover:scale-105 block"
          >
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
              <span className="text-black text-xl font-bold">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Band</h3>
            <p className="text-gray-400">View your band and members</p>
          </a>

          <a 
            href="/calendar"
            className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all hover:scale-105 block"
          >
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
              <span className="text-black text-xl font-bold">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Calendar</h3>
            <p className="text-gray-400">Manage rehearsals and gigs</p>
          </a>

          <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
              <span className="text-black text-xl font-bold">🎸</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gear</h3>
            <p className="text-gray-400">Manage band equipment</p>
            <p className="text-sm text-yellow-400 mt-2">Coming soon!</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'var(--gold)'}}>
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium">Successfully signed in</p>
                  <p className="text-sm text-gray-400">Welcome to BandManager!</p>
                </div>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <p>More activity will appear here as you use the app</p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <a href="/calendar" className="text-yellow-400 hover:underline text-sm">View All</a>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">
                        {event.type === 'gig' ? '🎤' : '🎸'}
                      </span>
                      <h3 className="font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                    <p className="text-xs text-yellow-400 mt-2">
                      {event.attendees.length} member{event.attendees.length !== 1 ? 's' : ''} attending
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📅</div>
                <p>No upcoming events</p>
                <a 
                  href="/calendar" 
                  className="inline-block mt-4 px-4 py-2 text-black rounded-lg font-medium transition-all hover:scale-105"
                  style={{background: 'var(--gold)'}}
                >
                  Create First Event
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  {previewUrl || userProfile?.photoURL ? (
                    <img 
                      src={previewUrl || userProfile?.photoURL || ''} 
                      alt={userProfile?.name || 'Profile'}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto"
                         style={{background: 'var(--gold)'}}>
                      {getInitials(editForm.name || userProfile?.name || '')}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    <span>📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-green-400 mt-2">
                    New photo selected: {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Click the camera icon to upload a new photo (max 5MB)
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Your full name"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Lead Vocalist, Guitarist, Band Manager"
                />
              </div>

              {/* Instrument Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Instrument
                </label>
                <select
                  value={editForm.instrument}
                  onChange={(e) => setEditForm({ ...editForm, instrument: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Select an instrument</option>
                  <option value="Vocals">Vocals</option>
                  <option value="Guitar">Guitar</option>
                  <option value="Bass">Bass</option>
                  <option value="Drums">Drums</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Percussion">Percussion</option>
                  <option value="Violin">Violin</option>
                  <option value="Saxophone">Saxophone</option>
                  <option value="Trumpet">Trumpet</option>
                  <option value="Trombone">Trombone</option>
                  <option value="Clarinet">Clarinet</option>
                  <option value="Flute">Flute</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 text-black rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{background: uploading ? '#666' : 'var(--gold)'}}
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Band Modal */}
      {showEditBand && band && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Band Profile</h2>
              <button
                onClick={() => setShowEditBand(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBandSubmit} className="space-y-6">
              {/* Band Photo Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  {bandPreviewUrl || band.imageURL ? (
                    <img 
                      src={bandPreviewUrl || band.imageURL || ''} 
                      alt={band.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto"
                         style={{background: 'var(--gold)'}}>
                      {getInitials(bandEditForm.name || band.name)}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors">
                    <span>📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBandFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedBandFile && (
                  <p className="text-sm text-green-400 mt-2">
                    New photo selected: {selectedBandFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Click the camera icon to upload a new band photo (max 5MB)
                </p>
              </div>

              {/* Band Name */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Band Name *</label>
                <input
                  type="text"
                  value={bandEditForm.name}
                  onChange={(e) => setBandEditForm({ ...bandEditForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Genre</label>
                <input
                  type="text"
                  value={bandEditForm.genre}
                  onChange={(e) => setBandEditForm({ ...bandEditForm, genre: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Rock, Pop, Jazz, Metal"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  value={bandEditForm.description}
                  onChange={(e) => setBandEditForm({ ...bandEditForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={3}
                  placeholder="Tell people about your band..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Location</label>
                <input
                  type="text"
                  value={bandEditForm.location}
                  onChange={(e) => setBandEditForm({ ...bandEditForm, location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g., Copenhagen, Denmark"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditBand(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingBand}
                  className="flex-1 px-6 py-3 text-black rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{background: uploadingBand ? '#666' : 'var(--gold)'}}
                >
                  {uploadingBand ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
