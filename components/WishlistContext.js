'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = '19store_wishlist_guest';

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadGuest = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setIds(user.wishlist || []);
      setLoaded(true);
    } else {
      setIds(loadGuest());
      setLoaded(true);
    }
  }, [user, authLoading, loadGuest]);

  const persist = useCallback(
    async (next) => {
      setIds(next);
      if (user) {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist: next }),
        });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    },
    [user]
  );

  const toggle = useCallback(
    (productId) => {
      const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
      persist(next);
    },
    [ids, persist]
  );

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, loaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
