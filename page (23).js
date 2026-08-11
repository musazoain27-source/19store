'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { formatPKR } from '@/lib/format';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', address: '', city: '', postalCode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping: form, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not place order');
      setSuccess(data.order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fadeInUp">
        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-2xl font-semibold mb-2">Order Placed!</h1>
        <p className="text-black/50 mb-1">Your order <span className="font-medium text-black">{success.id}</span> has been confirmed.</p>
        <p className="text-black/50 mb-8">Total: {formatPKR(success.total)}</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/account/orders/${success.id}`} className="btn-primary">Track Order</Link>
          <Link href="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-black/50 mb-6">Your cart is empty.</p>
        <Link href="/" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {!user && !loading && (
            <div className="bg-brand-gold/10 border border-brand-gold/30 text-sm rounded-xl p-4">
              Please <Link href="/login?redirect=/checkout" className="font-semibold underline">log in</Link> to place your order.
            </div>
          )}

          <div>
            <h2 className="font-semibold text-lg mb-4">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full Name" value={form.name} onChange={update('name')} className="input sm:col-span-2" />
              <input required placeholder="Street Address" value={form.address} onChange={update('address')} className="input sm:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={update('city')} className="input" />
              <input required placeholder="Postal Code" value={form.postalCode} onChange={update('postalCode')} className="input" />
              <input required placeholder="Phone Number" value={form.phone} onChange={update('phone')} className="input sm:col-span-2" />
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 border border-black/15 rounded-xl p-4 cursor-pointer has-[:checked]:border-brand has-[:checked]:bg-black/5">
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand" />
                <span className="font-medium text-sm">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 border border-black/15 rounded-xl p-4 cursor-pointer has-[:checked]:border-brand has-[:checked]:bg-black/5">
                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-brand" />
                <span className="font-medium text-sm">Credit / Debit Card</span>
              </label>
              {paymentMethod === 'card' && (
                <div className="grid sm:grid-cols-2 gap-4 pl-1 animate-slideDown">
                  <input placeholder="Card Number" className="input sm:col-span-2" />
                  <input placeholder="MM/YY" className="input" />
                  <input placeholder="CVC" className="input" />
                  <p className="sm:col-span-2 text-xs text-black/40 flex items-center gap-1">
                    <Lock size={12} /> Demo checkout — no real payment is processed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? 'Placing Order...' : `Place Order — ${formatPKR(subtotal)}`}
          </button>
        </form>

        <div className="border border-black/10 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-sm">
                <span className="text-black/70">
                  {item.title} <span className="text-black/40">({item.size} × {item.qty})</span>
                </span>
                <span className="font-medium">{formatPKR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
