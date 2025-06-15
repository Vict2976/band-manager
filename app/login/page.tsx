'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import PublicRoute from '../../lib/PublicRoute';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Pre-fill with band member emails for easy testing
  const bandMembers = [
    { name: 'Sarah', email: 'sarah@bandmanager.com' },
    { name: 'Victor', email: 'victor@bandmanager.com' },
    { name: 'Marius', email: 'marius@bandmanager.com' },
    { name: 'Kasper', email: 'kasper@bandmanager.com' },
    { name: 'Oliver', email: 'oliver@bandmanager.com' },
    { name: 'Tobias', email: 'tobias@bandmanager.com' },
    { name: 'Adam', email: 'adam@bandmanager.com' },
    { name: 'Rune', email: 'rune@bandmanager.com' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password, rememberMe);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <PublicRoute>
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-full" style={{background: 'var(--gold)'}}></div>
            <span className="text-3xl font-bold">BandManager</span>
          </div>
          <p className="text-gray-400">Sign in to access your band</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 text-yellow-400"
                />
                <span className="text-sm text-gray-400">Remember me for 30 days</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-black rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{background: loading ? '#666' : 'var(--gold)'}}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
    </PublicRoute>
  );
}
