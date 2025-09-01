'use client';

import { useAuth } from './auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface AuthNavProps {
  currentPage?: 'dashboard' | 'users' | 'calendar' | 'setup';
}

export default function AuthNav({ currentPage }: AuthNavProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) {
    return (
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 sm:h-28">
            <div className="flex items-center space-x-2">
              <a href="/" className="cursor-pointer">
                <Image 
                  src="/logo.png" 
                  alt="BandManager Logo" 
                  width={112} 
                  height={112} 
                  className="w-20 h-20 sm:w-28 sm:h-28"
                />
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a 
                  href="/" 
                  className="block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md"
                >
                  Home
                </a>
                <a 
                  href="/register" 
                  className="block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md"
                >
                  Register
                </a>
                <a 
                  href="/login" 
                  className="block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md"
                >
                  Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28">
          <div className="flex items-center space-x-2">
            <a href="/dashboard" className="cursor-pointer">
              <Image 
                src="/logo.png" 
                alt="BandManager Logo" 
                width={112} 
                height={112} 
                className="w-20 h-20 sm:w-28 sm:h-28"
              />
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-red-400 hover:text-red-400 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="/dashboard" 
                className={`block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md ${currentPage === 'dashboard' ? 'text-yellow-400 bg-gray-800' : ''}`}
              >
                Dashboard
              </a>
              <a 
                href="/users" 
                className={`block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md ${currentPage === 'users' ? 'text-yellow-400 bg-gray-800' : ''}`}
              >
                Band
              </a>
              <a 
                href="/calendar" 
                className={`block px-3 py-2 hover:bg-gray-800 hover:text-yellow-400 transition-colors rounded-md ${currentPage === 'calendar' ? 'text-yellow-400 bg-gray-800' : ''}`}
              >
                Calendar
              </a>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 hover:bg-red-900 hover:text-red-300 transition-colors rounded-md border border-gray-600 mt-2 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
