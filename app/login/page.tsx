'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/');
    } catch {
      setError('Wrong email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-pop-in">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl btn-grad grid place-items-center text-white text-2xl font-bold mx-auto mb-4">♪</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Band Manager</h1>
          <p className="text-[var(--muted)] mt-1.5 text-sm">Sign in to the shared band account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="bg-[var(--latina)]/10 border border-[var(--latina)]/30 rounded-xl p-3 text-sm font-medium text-[var(--latina)]">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="field mt-1 w-full px-3.5 py-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="field mt-1 w-full px-3.5 py-3 text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-grad w-full py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
