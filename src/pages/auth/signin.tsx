// src/pages/auth/signin.tsx

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#23243a] via-[#1a1b2f] to-[#2d2255] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#18192b] rounded-2xl shadow-2xl p-8 border border-[#2d2255]/40">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">Sign In to MentorAI</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d28d9] text-lg"><FaEnvelope /></span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#23243a] text-white border border-[#6d28d9]/40 focus:outline-none focus:ring-2 focus:ring-[#6d28d9] placeholder-gray-400"
              required
              autoComplete="email"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d28d9] text-lg"><FaLock /></span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#23243a] text-white border border-[#6d28d9]/40 focus:outline-none focus:ring-2 focus:ring-[#6d28d9] placeholder-gray-400"
              required
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#6d28d9] to-[#2563eb] hover:from-[#2563eb] hover:to-[#6d28d9] font-bold text-lg text-white shadow-lg transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#6d28d9] hover:underline font-semibold">Sign Up</Link>
        </div>
      </div>
    </main>
  );
}
