import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

function getPasswordStrength(password: string) {
  if (password.length < 6) return 'Weak';
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Strong';
  return 'Medium';
}

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      // Automatically sign in after successful registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (signInRes?.error) {
        setError('Account created, but failed to sign in automatically. Please try logging in.');
        setSuccess('');
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      setLoading(false);
      const data = await res.json();
      setError(data.message || 'Registration failed.');
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
    setLoading(false);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#23243a] via-[#1a1b2f] to-[#2d2255] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#18192b] rounded-2xl shadow-2xl p-8 border border-[#2d2255]/40">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">Sign Up for MentorAI</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d28d9] text-lg"><FaUser /></span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#23243a] text-white border border-[#6d28d9]/40 focus:outline-none focus:ring-2 focus:ring-[#6d28d9] placeholder-gray-400"
              required
              autoComplete="name"
              placeholder="Full name"
            />
          </div>
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
              autoComplete="new-password"
              placeholder="Password"
            />
            <div className={`mt-1 text-xs font-semibold ${passwordStrength === 'Strong' ? 'text-green-400' : passwordStrength === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>Password strength: {passwordStrength}</div>
          </div>
          {error && <div className="text-red-400 text-sm text-center font-semibold">{error}</div>}
          {success && <div className="text-green-400 text-sm text-center font-semibold">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#6d28d9] to-[#2563eb] hover:from-[#2563eb] hover:to-[#6d28d9] font-bold text-lg text-white shadow-lg transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#6d28d9] hover:underline font-semibold">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
