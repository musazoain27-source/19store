'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
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
      router.push(params.get('redirect') || '/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeInUp">
      <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
      <p className="text-white/50 mb-8">Log in to your 19Store account.</p>

      <form onSubmit={submit} className="space-y-4">
        <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-white/40 mt-4">Demo account: demo@19store.com / demo1234</p>
      <p className="text-sm text-white/60 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-brand-gold">Sign Up</Link>
      </p>
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
