'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      // See login page for why this is a hard navigation, not router.push.
      window.location.href = '/';
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
          <h1 className="font-display text-2xl font-bold text-center">Create Your Account</h1>
          <p className="text-white/50 text-sm text-center mt-1">Join 19Store for a faster checkout.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
          <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          <input required type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-white/60 mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-gold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
