"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["Outerwear", "T-Shirts", "Denim", "Knitwear", "Trousers", "Sweatshirts"];

export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-ink text-paper transition-shadow ${
        scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.25)]" : ""
      }`}
    >
      <div className="hidden md:block border-b border-white/10">
        <div className="container-store flex items-center justify-between h-9 text-[11px] tracking-widest2 uppercase text-bone/60">
          <span>Free shipping on orders over $100</span>
          <div className="flex items-center gap-5">
            <Link href="/account/orders" className="hover:text-paper transition-colors">
              Track order
            </Link>
            <Link href="/admin/login" className="hover:text-paper transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="container-store flex items-center gap-4 h-16 md:h-20">
        <button
          className="md:hidden p-2 -ml-2"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <BurgerIcon />
        </button>

        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7 ml-6 font-body text-[13px] tracking-wide uppercase">
          <Link href="/products" className="hover:text-gold transition-colors">
            Shop All
          </Link>
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="hover:text-gold transition-colors"
            >
              {c}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden lg:flex items-center ml-auto mr-2 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search products…"
            className="bg-white/5 border border-white/15 rounded-sm text-sm px-3 py-2 w-56 focus:w-72 transition-all placeholder:text-bone/40 outline-none focus:border-gold"
          />
        </form>

        <div className="flex items-center gap-4 ml-auto lg:ml-0">
          <Link
            href={user ? "/account" : "/account/login"}
            className="hidden sm:flex flex-col items-center hover:text-gold transition-colors"
            aria-label="Account"
          >
            <UserIcon />
          </Link>
          <Link href="/wishlist" className="relative hover:text-gold transition-colors" aria-label="Wishlist">
            <HeartIcon />
            {wishCount > 0 && <Badge>{wishCount}</Badge>}
          </Link>
          <Link href="/cart" className="relative hover:text-gold transition-colors" aria-label="Cart">
            <BagIcon />
            {count > 0 && <Badge>{count}</Badge>}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-ink">
          <form onSubmit={submitSearch} className="container-store py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search products…"
              className="bg-white/5 border border-white/15 rounded-sm text-sm px-3 py-2.5 w-full placeholder:text-bone/40 outline-none focus:border-gold"
            />
          </form>
          <nav className="container-store flex flex-col pb-4 text-sm uppercase tracking-wide">
            <Link href="/products" onClick={() => setMenuOpen(false)} className="py-2.5 border-b border-white/10">
              Shop All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-white/10"
              >
                {c}
              </Link>
            ))}
            <Link href={user ? "/account" : "/account/login"} onClick={() => setMenuOpen(false)} className="py-2.5">
              {user ? "My Account" : "Sign In"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Badge({ children }) {
  return (
    <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {children}
    </span>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 20s-7.2-4.4-9.6-9C.8 7.4 3 4 6.6 4c2 0 3.6 1.1 5.4 3 1.8-1.9 3.4-3 5.4-3 3.6 0 5.8 3.4 4.2 7-2.4 4.6-9.6 9-9.6 9Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 13H5L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
