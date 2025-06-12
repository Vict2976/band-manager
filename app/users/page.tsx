'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, User, getUsersByBandId, updateUsersWithBand } from '../../lib/userService';
import { getBandById, Band, getCurrentUserBand } from '../../lib/bandService';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../lib/ProtectedRoute';
import AuthNav from '../../lib/AuthNav';
import Image from 'next/image';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Band Header */}
          {band && (
            <div className="text-center mb-12">
              <div className="mb-6">
                {band.imageURL ? (
                  <Image
                    src={band.imageURL}
                    alt={band.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full mx-auto object-cover mb-4"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-black mb-4"
                       style={{background: 'var(--gold)'}}>
                    🎸
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span style={{color: 'var(--gold)'}}>{band.name}</span>
              </h1>
              <p className="text-xl text-gray-400 mb-4">
                {band.description}
              </p>
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                {band.genre && (
                  <span className="flex items-center">
                    🎵 {band.genre}
                  </span>
                )}
                {band.founded && (
                  <span className="flex items-center">
                    📅 Est. {new Date(band.founded).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Band <span style={{color: 'var(--gold)'}}>Members</span>
            </h2>
            <p className="text-lg text-gray-400">
              Meet the talented musicians that make the magic happen. Admins can manage event attendance for all members, 
              while regular members can only manage their own attendance.
            </p>
          </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all hover:scale-105">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="relative mb-4">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-black"
                           style={{background: 'var(--gold)'}}>
                        {getInitials(user.name)}
                      </div>
                    )}
                    {/* Instrument Emoji Badge */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-lg">{getInstrumentEmoji(user.instrument || '')}</span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    {user.permission === 'admin' && (
                      <span className="text-xs bg-yellow-600 text-black px-2 py-1 rounded font-bold">ADMIN</span>
                    )}
                  </div>
                  <p className="text-yellow-400 font-medium mb-2">{user.role}</p>
                  <p className="text-gray-400 text-sm mb-3">{user.instrument}</p>
                  
                  {/* Permission Info */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Permissions</p>
                    <p className="text-sm text-gray-300">
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

        {/* Stats Section */}
        {users.length > 0 && (
          <div className="mt-16 grid md:grid-cols-3 gap-6">
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
