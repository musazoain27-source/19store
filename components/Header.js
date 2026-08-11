'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const CATEGORIES = ['Hoodies', 'T-Shirts', 'Jackets', 'Bottoms'];

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <button className="md:hidden p-2 -ml-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image src="/logo-mark-192.png" alt="19Store logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
              19<span className="text-brand-gold">Store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="hover:text-brand-gold transition-colors">
                {c}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2 hover:text-brand-gold transition-colors" onClick={() => setSearchOpen((s) => !s)} aria-label="Search">
              <Search size={20} />
            </button>
            <Link href="/wishlist" className="p-2 hover:text-brand-gold transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <Link
              href={user ? '/account' : '/login'}
              className="p-2 hover:text-brand-gold transition-colors hidden sm:block"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-brand-gold transition-colors" aria-label="Cart">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-4 animate-slideDown">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="input pl-11"
              />
            </div>
          </form>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 animate-[fadeIn_0.25s_ease-out] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-lg font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg overflow-hidden inline-block">
                  <Image src="/logo-mark-192.png" alt="19Store" width={32} height={32} className="w-full h-full object-cover" />
                </span>
                19<span className="text-brand-gold">Store</span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-base font-medium">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              {CATEGORIES.map((c) => (
                <Link key={c} href={`/category/${encodeURIComponent(c)}`} onClick={() => setMenuOpen(false)}>
                  {c}
                </Link>
              ))}
              <hr className="my-2" />
              <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link href={user ? '/account' : '/login'} onClick={() => setMenuOpen(false)}>
                {user ? 'My Account' : 'Login / Sign Up'}
              </Link>
              <Link href="/account/orders" onClick={() => setMenuOpen(false)}>Order History</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
