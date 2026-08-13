'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { formatPKR } from '@/lib/format';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, loaded } = useCart();

  if (loaded && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-fadeIn">
        <ShoppingBag size={56} className="mx-auto text-black/20 mb-6" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-black/50 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="btn-primary">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <div className="grid md:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 border border-black/10 rounded-2xl p-4 animate-fadeIn">
              <div className="relative w-24 h-28 rounded-xl overflow-hidden shrink-0 bg-black/5">
                {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-black/50">Size: {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-black/30 hover:text-red-500 transition-colors h-fit"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border border-black/15 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-semibold">{formatPKR(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-black/10 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-black/60">Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-black/60">Shipping</span>
            <span className="text-black/50">Calculated at checkout</span>
          </div>
          <hr className="my-4 border-black/10" />
          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
