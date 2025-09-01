'use client';

import { useAuth } from '../lib/auth';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 sm:h-28">
            <div className="flex items-center space-x-2">
              <a href={user ? "/dashboard" : "/"} className="cursor-pointer">
                <Image 
                  src="/logo.png" 
                  alt="BandManager Logo" 
                  width={128} 
                  height={128} 
                  className="w-24 h-24 sm:w-32 sm:h-32"
                />
              </a>
            </div>
            <div className="hidden md:flex space-x-8">
              {user ? (
                <>
                  <a href="/dashboard" className="hover:text-yellow-400 transition-colors">Dashboard</a>
                  <a href="/users" className="hover:text-yellow-400 transition-colors">Band Members</a>
                  <a href="/calendar" className="hover:text-yellow-400 transition-colors">Calendar</a>
                  <a href="/setup" className="hover:text-yellow-400 transition-colors">Setup</a>
                </>
              ) : (
                <>
                </>
              )}
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <a 
                    href="/dashboard"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-black rounded-lg font-medium transition-all hover:scale-105"
                    style={{background: 'var(--gold)'}}
                  >
                    Dashboard
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/login"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/setup"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-black rounded-lg font-medium transition-all hover:scale-105"
                    style={{background: 'var(--gold)'}}
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              Manage Your Band
              <span className="block" style={{color: 'var(--gold)'}}>Like a Pro</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Streamline rehearsals, organize gigs, and keep your band in perfect harmony. 
              Everything you need in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <a
                href="/setup"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg text-black rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-center"
                style={{background: 'var(--gold)'}}
              >
                Start Managing Today
              </a>
            </div>
            
            {/* Feature Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-16 px-4">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl" style={{color: 'var(--gold)'}}>📅</span>
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Schedule</h3>
                <p className="text-xs sm:text-sm text-gray-400">Rehearsals & Gigs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl" style={{color: 'var(--gold)'}}>👥</span>
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Members</h3>
                <p className="text-xs sm:text-sm text-gray-400">Track Attendance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl" style={{color: 'var(--gold)'}}>💰</span>
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Finance</h3>
                <p className="text-xs sm:text-sm text-gray-400">Track Earnings</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl" style={{color: 'var(--gold)'}}>📊</span>
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-400">Performance Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Everything Your Band Needs
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              From scheduling to logistics management, we've got you covered with powerful tools designed specifically for bands.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">📅</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Smart Calendar</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Organize rehearsals and gigs with an intuitive calendar view. Never miss another important date.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">✓</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Attendance Tracking</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Know who's coming to what. Track member availability and plan accordingly.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">💰</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Financial Tracking</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Track gig earnings, expenses, and split payments fairly among band members.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">💬</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Communication</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Keep everyone in the loop with built-in messaging and notifications.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">📱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Mobile Ready</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Access your band's information anywhere, anytime. Fully responsive design.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-3 sm:mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-lg sm:text-xl font-bold">🔒</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Secure & Private</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Your band's information is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="BandManager Logo" 
                width={128} 
                height={128} 
                className="w-24 h-24 sm:w-32 sm:h-32"
                />
              </div>
              <p className="text-gray-400 max-w-md text-sm sm:text-base">
                The ultimate band management platform. Keep your band organized, professional, and ready to rock.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2025 BandManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}