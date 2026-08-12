'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      router.push('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeInUp">
      <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
      <p className="text-white/50 mb-8">Join 19Store for a faster checkout experience.</p>

      <form onSubmit={submit} className="space-y-4">
        <input required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input required type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-white/60 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-gold">Log In</Link>
      </p>
    </div>
  );
}
