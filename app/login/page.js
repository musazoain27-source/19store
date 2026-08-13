'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // A hard navigation (not router.push) is used here on purpose: Next.js
      // prefetches "/" in the background while the visitor is still logged
      // out, caches that redirect-to-login result client-side, and then
      // router.push('/') can silently reuse that stale cached result even
      // after login succeeds. A full navigation always hits the server
      // fresh, so it correctly picks up the new auth cookie every time.
      window.location.href = params.get('redirect') || '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full animate-fadeInUp">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-2xl">
            <Image src="/logo-mark-192.png" alt="19Store" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold text-center">
            Welcome to 19<span className="text-brand-gold">Store</span>
          </h1>
          <p className="text-white/50 text-sm text-center mt-1">Log in to start shopping.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-xs text-white/30 mt-4 text-center">Demo account: demo@19store.com / demo1234</p>
        <p className="text-sm text-white/60 mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-brand-gold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
