'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const CATEGORIES = ['Hoodies', 'T-Shirts', 'Jackets', 'Bottoms'];

export default function Header() {
  const { count } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  const { user } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  // Proper open/close sequencing so the drawer slides in/out instead of
  // just popping in, and locks background scroll while it's open (this
  // was the cause of the "glitchy" feeling on mobile).
  const openMenu = () => {
    setMenuOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
  };
  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMenuOpen(false), 250);
  };

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
    <header
      className={`sticky top-0 z-50 bg-black/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-md shadow-black/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <button className="md:hidden p-2 -ml-2 text-white" onClick={openMenu} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image src="/logo-mark-192.png" alt="19Store logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight hidden sm:block text-white">
              19<span className="text-brand-blue">Store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c)}`}
                className="relative hover:text-brand-blue transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-brand-blue after:transition-all after:duration-300 hover:after:w-full"
              >
                {c}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2 text-white">
            <button className="p-2 hover:text-brand-blue transition-colors" onClick={() => setSearchOpen((s) => !s)} aria-label="Search">
              <Search size={20} />
            </button>
            <Link href="/wishlist" className="p-2 hover:text-brand-blue transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <Link
              href={user ? '/account' : '/login'}
              className="p-2 hover:text-brand-blue transition-colors hidden sm:block"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-brand-blue transition-colors" aria-label="Cart">
              <ShoppingBag size={20} className={bump ? 'animate-bounceSmall' : ''} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-blue text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-4 animate-slideDown">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
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
    </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className={`absolute inset-0 bg-neutral-900/60 transition-opacity duration-250 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMenu}
          />
          <div
            className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-neutral-950 border-r border-white/10 p-6 shadow-2xl overflow-y-auto transition-transform duration-250 ease-out will-change-transform ${
              menuVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-lg font-bold flex items-center gap-2 text-white">
                <span className="w-8 h-8 rounded-lg overflow-hidden inline-block">
                  <Image src="/logo-mark-192.png" alt="19Store" width={32} height={32} className="w-full h-full object-cover" />
                </span>
                19<span className="text-brand-blue">Store</span>
              </span>
              <button onClick={closeMenu} aria-label="Close menu" className="text-white/70 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-base font-medium text-white/90">
              <Link href="/" onClick={closeMenu} className="hover:text-brand-blue transition-colors">Home</Link>
              {CATEGORIES.map((c) => (
                <Link key={c} href={`/category/${encodeURIComponent(c)}`} onClick={closeMenu} className="hover:text-brand-blue transition-colors">
                  {c}
                </Link>
              ))}
              <hr className="my-2 border-white/10" />
              <Link href="/wishlist" onClick={closeMenu} className="hover:text-brand-blue transition-colors">Wishlist</Link>
              <Link href={user ? '/account' : '/login'} onClick={closeMenu} className="hover:text-brand-blue transition-colors">
                {user ? 'My Account' : 'Login / Sign Up'}
              </Link>
              <Link href="/account/orders" onClick={closeMenu} className="hover:text-brand-blue transition-colors">Order History</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
