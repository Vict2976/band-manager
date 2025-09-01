'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthNav from '../../lib/AuthNav';
import Image from 'next/image';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for success message from registration
  const registrationSuccess = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <AuthNav />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Image 
                src="/logo.png" 
                alt="BandManager Logo" 
                width={80} 
                height={80} 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            {registrationSuccess && (
              <div className="bg-green-900 border border-green-700 rounded-xl p-4 mb-6">
                <p className="text-green-200 text-center">
                  ✅ Registration successful! Please sign in with your new account.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-xl p-4 mb-6">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-black font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'var(--gold)'}}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <a href="/register" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
