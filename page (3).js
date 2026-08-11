'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock } from 'lucide-react';

function AdminLoginForm() {
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push(params.get('from') || '/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-black/5">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-black/10 p-8 animate-scaleIn">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl overflow-hidden mb-3">
            <Image src="/logo-mark-192.png" alt="19Store" width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={16} /> Admin Login
          </h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          <input required type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-black/40 mt-6 text-center">
          Credentials are set via ADMIN_EMAIL / ADMIN_PASSWORD environment variables.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
