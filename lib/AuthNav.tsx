'use client';

import { useAuth } from './auth';
import { useRouter } from 'next/navigation';

interface AuthNavProps {
  currentPage?: 'dashboard' | 'users' | 'calendar' | 'gear' | 'setup';
}

export default function AuthNav({ currentPage }: AuthNavProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full" style={{background: 'var(--gold)'}}></div>
              <span className="text-xl font-bold">BandManager</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
              <a href="/login" className="hover:text-yellow-400 transition-colors">Sign In</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{background: 'var(--gold)'}}></div>
            <span className="text-xl font-bold">BandManager</span>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="/dashboard" 
              className={`hover:text-yellow-400 transition-colors ${currentPage === 'dashboard' ? 'text-yellow-400' : ''}`}
            >
              Dashboard
            </a>
            <a 
              href="/users" 
              className={`hover:text-yellow-400 transition-colors ${currentPage === 'users' ? 'text-yellow-400' : ''}`}
            >
              Band
            </a>
            <a 
              href="/calendar" 
              className={`hover:text-yellow-400 transition-colors ${currentPage === 'calendar' ? 'text-yellow-400' : ''}`}
            >
              Calendar
            </a>
            <a 
              href="/gear" 
              className={`hover:text-yellow-400 transition-colors ${currentPage === 'gear' ? 'text-yellow-400' : ''}`}
            >
              Gear
            </a>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 text-sm border border-gray-600 rounded hover:border-yellow-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
