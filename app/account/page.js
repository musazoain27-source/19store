'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/account');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-black/40">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 animate-fadeIn">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-semibold">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <p className="text-black/50 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="card-hover border border-black/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <Package size={26} className="text-brand-gold" />
          <span className="font-medium">Order History</span>
        </Link>
        <Link href="/wishlist" className="card-hover border border-black/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <Heart size={26} className="text-brand-gold" />
          <span className="font-medium">Wishlist</span>
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          className="card-hover border border-black/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
        >
          <LogOut size={26} className="text-red-500" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
