'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Minus, Plus, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { useToast } from '@/components/ToastContext';
import { formatPKR } from '@/lib/format';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetailClient({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { showToast } = useToast();
  const router = useRouter();

  const stockForSize = size ? product.sizes?.[size] ?? 0 : null;
  const totalStock = Object.values(product.sizes || {}).reduce((a, b) => a + b, 0);

  const handleAdd = () => {
    if (!size) return setError('Please select a size');
    if (stockForSize < qty) return setError('Not enough stock for this size');
    setError('');
    addItem(product, size, qty);
    setAdded(true);
    showToast(`Added ${product.title} to cart`);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!size) return setError('Please select a size');
    if (stockForSize < qty) return setError('Not enough stock for this size');
    setError('');
    addItem(product, size, qty);
    router.push('/checkout');
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16">
      {/* Images */}
      <div className="animate-fadeIn">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 mb-3">
          <Image src={product.images?.[activeImage]} alt={product.title} fill className="object-cover" priority />
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                  activeImage === i ? 'border-brand-gold' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="animate-fadeInUp">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-2">{product.category}</p>
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{product.title}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-semibold">{formatPKR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-lg text-white/40 line-through">{formatPKR(product.compareAtPrice)}</span>
          )}
        </div>

        <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

        {/* Sizes */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">
            Size {size && <span className="text-white/40 font-normal">— {stockForSize > 0 ? `${stockForSize} in stock` : 'Out of stock'}</span>}
          </p>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map((s) => {
              const stock = product.sizes?.[s] ?? 0;
              const disabled = stock === 0;
              return (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => {
                    setSize(s);
                    setQty(1);
                    setError('');
                  }}
                  className={`w-14 h-12 rounded-xl border font-medium text-sm transition-all ${
                    disabled
                      ? 'border-white/10 text-white/25 line-through cursor-not-allowed'
                      : size === s
                      ? 'border-brand bg-brand text-white'
                      : 'border-white/15 hover:border-brand'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Quantity</p>
          <div className="inline-flex items-center border border-white/15 rounded-xl overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => (stockForSize ? Math.min(stockForSize, q + 1) : q + 1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 animate-fadeIn">{error}</p>}

        {totalStock === 0 ? (
          <div className="rounded-xl bg-white/5 text-center py-4 font-medium text-white/50 mb-4">
            This product is currently out of stock
          </div>
        ) : (
          <div className="flex gap-3 mb-4">
            <button onClick={handleAdd} className="btn-secondary flex-1">
              {added ? (
                <>
                  <Check size={18} /> Added
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <button onClick={handleBuyNow} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>
        )}

        <button
          onClick={() => toggle(product.id)}
          className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-brand transition-colors mb-8"
        >
          <Heart size={18} className={isWishlisted(product.id) ? 'fill-brand-gold text-brand-gold' : ''} />
          {isWishlisted(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>

        <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-6">
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={20} className="text-brand-gold" />
            <span className="text-xs text-white/60">Fast Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw size={20} className="text-brand-gold" />
            <span className="text-xs text-white/60">Easy Returns</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={20} className="text-brand-gold" />
            <span className="text-xs text-white/60">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
