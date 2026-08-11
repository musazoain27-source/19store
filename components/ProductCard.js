'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { formatPKR } from '@/lib/format';
export { formatPKR };

export default function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const totalStock = Object.values(product.sizes || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block card-hover rounded-2xl overflow-hidden bg-white border border-black/5">
        <div className="relative aspect-[3/4] overflow-hidden bg-black/5">
          <Image
            src={product.images?.[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.compareAtPrice && (
            <span className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Sale
            </span>
          )}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-semibold tracking-wide">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-1.5">{product.title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPKR(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-black/40 line-through">{formatPKR(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(product.id);
        }}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-transform hover:scale-110"
      >
        <Heart size={16} className={wishlisted ? 'fill-brand-gold text-brand-gold' : 'text-black/60'} />
      </button>
    </div>
  );
}
