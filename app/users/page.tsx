'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, User, getUsersByBandId, updateUsersWithBand, searchUsers, addUserToBand, hasAdminPermission } from '../../lib/userService';
import { getBandById, Band, getCurrentUserBand, updateBandHoldings } from '../../lib/bandService';
import { createActivity } from '../../lib/activityService';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../lib/ProtectedRoute';
import AuthNav from '../../lib/AuthNav';
import Image from 'next/image';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  
  // Add user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  
  // Holdings state
  const [showEditHoldings, setShowEditHoldings] = useState(false);
  const [holdingsInput, setHoldingsInput] = useState('');
  const [savingHoldings, setSavingHoldings] = useState(false);
  
  const { user: currentUser, sessionUser, signOut } = useAuth();

  useEffect(() => {
    const initializeBandAndUsers = async () => {
      const user = currentUser || sessionUser;
      if (!user) return;
      
      try {
        // Get current user's band
        const bandId = await getCurrentUserBand(user.uid);
        
        // Fetch band information
        const bandData = await getBandById(bandId);
        setBand(bandData);
        
        // Fetch users for this band
        const fetchedUsers = await getUsersByBandId(bandId);
        setUsers(fetchedUsers);
        
        // Find current user data for permission checking
        const currentUserInBand = fetchedUsers.find(u => (u.id || u.uid) === user.uid);
        setCurrentUserData(currentUserInBand || null);
      } catch (error: any) {
        console.error('Error initializing band and users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeBandAndUsers();
  }, [currentUser, sessionUser]);

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
      'Flute': '🎶',
      'Harmonica': '🎵',
      'Other': '🎵',
    };
    return emojiMap[instrument] || '🎵';
  };

  const handleSearchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await searchUsers(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddUserToBand = async (userId: string) => {
    if (!band?.id) return;

    try {
      setAddingUserId(userId);
      await addUserToBand(userId, band.id);
      
      // Refresh the users list
      const fetchedUsers = await getUsersByBandId(band.id);
      setUsers(fetchedUsers);
      
      // Remove the added user from search results
      setSearchResults(prev => prev.filter(user => (user.id || user.uid) !== userId));
      
      setError('');
    } catch (error) {
      console.error('Error adding user to band:', error);
      setError('Failed to add user to band');
    } finally {
      setAddingUserId(null);
    }
  };

  const handleEditHoldings = () => {
    setHoldingsInput(band?.currentHoldings?.toString() || '0');
    setShowEditHoldings(true);
  };

  const handleSaveHoldings = async () => {
    if (!band?.id || !currentUserData) return;

    const newAmount = parseFloat(holdingsInput);
    if (isNaN(newAmount) || newAmount < 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setSavingHoldings(true);
      
      const oldAmount = band.currentHoldings || 0;
      
      // Update the band holdings
      await updateBandHoldings(band.id, newAmount);
      
      // Log the activity
      await createActivity({
        userId: currentUserData.uid || currentUserData.id || '',
        userName: currentUserData.name,
        userPhotoURL: currentUserData.photoURL,
        bandId: band.id,
        type: 'holdings_update',
        action: `Updated band holdings from ${oldAmount.toLocaleString()} DKK to ${newAmount.toLocaleString()} DKK`,
        details: {
          oldAmount,
          newAmount,
          change: newAmount - oldAmount
        }
      });
      
      // Update the local band state
      setBand(prev => prev ? { ...prev, currentHoldings: newAmount } : null);
      
      setShowEditHoldings(false);
      setError('');
    } catch (error) {
      console.error('Error updating holdings:', error);
      setError('Failed to update holdings');
    } finally {
      setSavingHoldings(false);
    }
  };

  const isAdmin = currentUserData ? hasAdminPermission(currentUserData) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading band information...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AuthNav currentPage="users" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          {/* Band Header */}
          {band && (
            <div className="text-center mb-8 sm:mb-12">
              <div className="mb-6">
                {band.imageURL ? (
                  <Image
                    src={band.imageURL}
                    alt={band.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-30 sm:h-30 rounded-full mx-auto object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-full mx-auto flex items-center justify-center text-3xl sm:text-4xl font-bold text-black mb-4"
                       style={{background: 'var(--gold)'}}>
                    🎸
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">
                <span style={{color: 'var(--gold)'}}>{band.name}</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-4">
                {band.description}
              </p>
              <div className="flex justify-center items-center space-x-4 sm:space-x-6 text-sm text-gray-500">
                {band.genre && (
                  <span className="flex items-center">
                    🎵 {band.genre}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Band <span style={{color: 'var(--gold)'}}>Members</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 px-4">
              Meet the talented musicians that make the magic happen. Admins can manage event attendance for all members, 
              while regular members can only manage their own attendance.
            </p>
          </div>

          {/* Admin Controls - Add User Functionality */}
          {currentUserData?.permission === 'admin' && (
            <div className="mb-8">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
                    <p className="text-gray-400 text-sm">Add existing users to your band</p>
                  </div>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 w-full sm:w-auto"
                    style={{background: 'var(--gold)', color: 'black'}}
                  >
                    + Add User to Band
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add User to Band</h3>
                  <button
                    onClick={() => {
                      setShowAddUserModal(false);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSearchUsers}
                    disabled={!searchTerm.trim() || searchLoading}
                    className="w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{background: 'var(--gold)', color: 'black'}}
                  >
                    {searchLoading ? 'Searching...' : 'Search Users'}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Available Users:</h4>
                    {searchResults.map((user) => (
                      <div key={user.id || user.uid} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.instrument} • {user.role}</p>
                          </div>
                          <button
                            onClick={() => handleAddUserToBand(user.id || user.uid!)}
                            disabled={addingUserId === (user.id || user.uid)}
                            className="px-3 py-1 rounded font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            style={{background: 'var(--gold)', color: 'black'}}
                          >
                            {addingUserId === (user.id || user.uid) ? 'Adding...' : 'Add'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchTerm && searchResults.length === 0 && !searchLoading && (
                  <div className="text-center py-6">
                    <p className="text-gray-400">No users found matching your search.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Make sure the user has registered first.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Error:</h3>
            <p className="text-red-200">{error}</p>
            <p className="text-sm text-red-300 mt-2">
              Make sure you've set up your Firebase configuration and created the users first.
            </p>
          </div>
        )}

        {users.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-semibold mb-4">No Band Members Found</h3>
            <p className="text-gray-400 mb-6">
              It looks like you haven't created any band members yet.
            </p>
            <a 
              href="/setup" 
              className="inline-block px-6 py-3 text-black rounded-lg font-semibold transition-all hover:scale-105"
              style={{background: 'var(--gold)'}}
            >
              Set Up Band Members
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-900 rounded-xl p-4 sm:p-6 hover:bg-gray-800 transition-all hover:scale-105">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="relative mb-4">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto object-cover"
                        onError={(e) => {
                          console.warn('Failed to load user photo:', user.photoURL);
                          // Hide the image and show initials fallback
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-lg sm:text-xl font-bold text-black"
                      style={{
                        background: 'var(--gold)',
                        display: user.photoURL ? 'none' : 'flex'
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    {/* Instrument Emoji Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-sm sm:text-lg">{getInstrumentEmoji(user.instrument || '')}</span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-semibold truncate">{user.name}</h3>
                    {user.permission === 'admin' && (
                      <span className="text-xs bg-yellow-600 text-black px-2 py-1 rounded font-bold mx-auto sm:mx-0 w-fit">ADMIN</span>
                    )}
                  </div>
                  <p className="text-yellow-400 font-medium mb-2 text-sm sm:text-base truncate">{user.role}</p>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 truncate">{user.instrument}</p>
                  
                  {/* Permission Info */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Permissions</p>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {user.permission === 'admin' 
                        ? '👑 Can manage all events & attendees' 
                        : '👤 Can only manage own attendance'
                      }
                    </p>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Band Holdings Section */}
        {band && users.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background: 'var(--gold)'}}>
                    <span className="text-black text-xl font-bold">💳</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Band Holdings</h3>
                    <p className="text-gray-400 text-sm">Current available funds</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold" style={{color: 'var(--gold)'}}>
                      {(band.currentHoldings || 0).toLocaleString()} DKK
                    </div>
                    <p className="text-xs text-gray-500">Available funds</p>
                  </div>
                  
                  <button
                    onClick={handleEditHoldings}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Holdings Modal */}
        {showEditHoldings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Update Band Holdings</h3>
                <button
                  onClick={() => setShowEditHoldings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount in DKK
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={holdingsInput}
                  onChange={(e) => setHoldingsInput(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter current amount"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be logged in the activity feed for transparency.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditHoldings(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHoldings}
                  disabled={savingHoldings}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background: 'var(--gold)', color: 'black'}}
                >
                  {savingHoldings ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {users.length > 0 && (
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{color: 'var(--gold)'}}>
                {users.length}
              </div>
              <p className="text-gray-400">Total Members</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{color: 'var(--gold)'}}>
                {new Set(users.map(u => u.instrument)).size}
              </div>
              <p className="text-gray-400">Instruments</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{color: 'var(--gold)'}}>
                {(band?.currentHoldings || 0).toLocaleString()}
              </div>
              <p className="text-gray-400">DKK Holdings</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{color: 'var(--gold)'}}>
                100%
              </div>
              <p className="text-gray-400">Awesome</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}
