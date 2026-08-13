'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/components/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { ids, loaded } = useWishlist();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    if (ids.length === 0) {
      setProducts([]);
      setFetching(false);
      return;
    }
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products.filter((p) => ids.includes(p.id))))
      .finally(() => setFetching(false));
  }, [ids, loaded]);

  if (loaded && !fetching && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-fadeIn">
        <Heart size={56} className="mx-auto text-black/20 mb-6" />
        <h1 className="text-2xl font-semibold mb-2">Your wishlist is empty</h1>
        <p className="text-black/50 mb-8">Save items you love for later.</p>
        <Link href="/" className="btn-primary">
          Start Browsing <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="section-title mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
