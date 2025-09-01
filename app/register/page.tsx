'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '../../lib/userService';
import PublicRoute from '../../lib/PublicRoute';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        name: formData.name,
        email: formData.email,
        instrument: formData.instrument || undefined,
        role: formData.role || undefined,
        permission: 'member' as const,
        isActive: true,
        joinedAt: new Date(),
        updatedAt: new Date(),
      };

      await createUser(userData, formData.password);
      
      // Redirect to login with success message
      router.push('/login?registered=true');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create account. Please try again.');
      }
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
            <Image 
              src="/logo.png" 
              alt="BandManager Logo" 
              width={96} 
              height={96} 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-gray-400 mt-2">Join the BandManager community</p>
          </div>

          {/* Registration Form */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Create a password (min 6 characters)"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Instrument */}
              <div>
                <label htmlFor="instrument" className="block text-sm font-medium mb-2">
                  Primary Instrument
                </label>
                <select
                  id="instrument"
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="">Select an instrument (optional)</option>
                  <option value="Vocals">Vocals</option>
                  <option value="Guitar">Guitar</option>
                  <option value="Bass">Bass</option>
                  <option value="Drums">Drums</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Percussion">Percussion</option>
                  <option value="Violin">Violin</option>
                  <option value="Saxophone">Saxophone</option>
                  <option value="Trumpet">Trumpet</option>
                  <option value="Flute">Flute</option>
                  <option value="Harmonica">Harmonica</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g., Lead Guitarist, Backup Vocalist (optional)"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#374151' : 'var(--gold)',
                  color: loading ? '#9CA3AF' : '#000'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
