'use client';

import { useAuth } from '../lib/auth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full" style={{background: 'var(--gold)'}}></div>
              <span className="text-xl font-bold">BandManager</span>
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
                  <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
                </>
              )}
            </div>
            <div className="flex space-x-4">
              {user ? (
                <>
                  <a 
                    href="/dashboard"
                    className="px-4 py-2 text-sm text-black rounded-lg font-medium transition-all hover:scale-105"
                    style={{background: 'var(--gold)'}}
                  >
                    Dashboard
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/login"
                    className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/setup"
                    className="px-4 py-2 text-sm text-black rounded-lg font-medium transition-all hover:scale-105"
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Manage Your Band
              <span className="block" style={{color: 'var(--gold)'}}>Like a Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline rehearsals, organize gigs, track gear, and keep your band in perfect harmony. 
              Everything you need in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/setup"
                className="px-8 py-4 text-lg text-black rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
                style={{background: 'var(--gold)'}}
              >
                Start Managing Today
              </a>
            </div>
            
            {/* Feature Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl" style={{color: 'var(--gold)'}}>📅</span>
                </div>
                <h3 className="font-semibold mb-2">Schedule</h3>
                <p className="text-sm text-gray-400">Rehearsals & Gigs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl" style={{color: 'var(--gold)'}}>👥</span>
                </div>
                <h3 className="font-semibold mb-2">Members</h3>
                <p className="text-sm text-gray-400">Track Attendance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl" style={{color: 'var(--gold)'}}>🎸</span>
                </div>
                <h3 className="font-semibold mb-2">Gear</h3>
                <p className="text-sm text-gray-400">Equipment Tracking</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl" style={{color: 'var(--gold)'}}>📊</span>
                </div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-gray-400">Performance Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Your Band Needs
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From scheduling to gear management, we've got you covered with powerful tools designed specifically for bands.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Calendar</h3>
              <p className="text-gray-400">
                Organize rehearsals and gigs with an intuitive calendar view. Never miss another important date.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-gray-400">
                Know who's coming to what. Track member availability and plan accordingly.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">🎸</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Gear Management</h3>
              <p className="text-gray-400">
                Track who brings what equipment. Never show up to a gig without the right gear again.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Communication</h3>
              <p className="text-gray-400">
                Keep everyone in the loop with built-in messaging and notifications.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Ready</h3>
              <p className="text-gray-400">
                Access your band's information anywhere, anytime. Fully responsive design.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{background: 'var(--gold)'}}>
                <span className="text-black text-xl font-bold">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-400">
                Your band's information is protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full" style={{background: 'var(--gold)'}}></div>
                <span className="text-xl font-bold">BandManager</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The ultimate band management platform. Keep your band organized, professional, and ready to rock.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BandManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}