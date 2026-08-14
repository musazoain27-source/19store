'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Tag, X, Loader2 } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { formatPKR } from '@/lib/format';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code, type, value }
  const [discountChecking, setDiscountChecking] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const deliveryFee = paymentMethod === 'cod' ? 300 : 0;
  const discountAmount = appliedDiscount
    ? Math.max(0, Math.min(
        appliedDiscount.type === 'percent' ? Math.round((subtotal * appliedDiscount.value) / 100) : appliedDiscount.value,
        subtotal
      ))
    : 0;
  const total = subtotal + deliveryFee - discountAmount;

  const applyDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountChecking(true);
    setDiscountError('');
    try {
      const res = await fetch(`/api/discounts/${encodeURIComponent(discountInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid discount code');
      setAppliedDiscount(data.discount);
    } catch (err) {
      setAppliedDiscount(null);
      setDiscountError(err.message);
    } finally {
      setDiscountChecking(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput('');
    setDiscountError('');
  };

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
        body: JSON.stringify({ items, shipping: form, paymentMethod, deliveryFee, discountCode: appliedDiscount?.code }),
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
        <p className="text-white/50 mb-1">Your order <span className="font-medium text-white">{success.id}</span> has been confirmed.</p>
        <p className="text-white/50 mb-8">Total: {formatPKR(success.total)}</p>

        {paymentMethod === 'transfer' && (
          <div className="max-w-sm mx-auto mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
            <p className="text-sm text-white/70 mb-3">
              Don't forget to confirm your payment so we can start processing your order.
            </p>
            <a
              href="https://wa.me/923346008064?text=Hi%2C%20I%27ve%20sent%20payment%20for%20my%2019Store%20order.%20Here%27s%20my%20screenshot%3A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-medium text-sm px-4 py-2.5 rounded-full hover:brightness-95 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> Confirm Payment on WhatsApp
            </a>
          </div>
        )}

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
        <p className="text-white/50 mb-6">Your cart is empty.</p>
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
            <div className="bg-brand-blue/10 border border-brand-blue/30 text-sm rounded-xl p-4">
              Please <Link href="/login?redirect=/checkout" className="font-semibold underline">log in</Link> to place your order.
            </div>
          )}

          <div>
            <h2 className="font-semibold text-lg mb-4">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full Name" value={form.name} onChange={update('name')} className="input sm:col-span-2" />
              <input required placeholder="Street Address" value={form.address} onChange={update('address')} className="input sm:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={update('city')} className="input sm:col-span-2" />
              <input required placeholder="Phone Number" value={form.phone} onChange={update('phone')} className="input sm:col-span-2" />
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 border border-white/15 rounded-xl p-4 cursor-pointer has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/5 transition-colors">
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand-blue mt-0.5" />
                <div>
                  <span className="font-medium text-sm block">Cash on Delivery</span>
                  <span className="text-xs text-white/40">Pay in cash when your order arrives. A flat Rs. 300 delivery fee applies.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 border border-white/15 rounded-xl p-4 cursor-pointer has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/5 transition-colors">
                <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="accent-brand-blue mt-0.5" />
                <div>
                  <span className="font-medium text-sm block">Online Transfer (JazzCash / EasyPaisa)</span>
                  <span className="text-xs text-white/40">Send payment directly, no delivery fee.</span>
                </div>
              </label>

              {paymentMethod === 'transfer' && (
                <div className="ml-1 p-4 rounded-xl bg-white/5 border border-white/10 animate-slideDown space-y-3">
                  <p className="text-sm text-white/70">
                    Send the order total to this number via JazzCash or EasyPaisa:
                  </p>
                  <p className="text-lg font-semibold tracking-wide text-brand-blue">0334-6008064</p>
                  <p className="text-xs text-white/40">
                    After sending payment, place your order below, then tap the button to confirm on WhatsApp with a screenshot of your payment.
                  </p>
                  <a
                    href="https://wa.me/923346008064?text=Hi%2C%20I%27ve%20sent%20payment%20for%20my%2019Store%20order.%20Here%27s%20my%20screenshot%3A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-medium text-sm px-4 py-2.5 rounded-full hover:brightness-95 transition-all hover:-translate-y-0.5"
                  >
                    <MessageCircle size={18} /> Confirm Payment on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Discount Code</h2>
            {appliedDiscount ? (
              <div className="flex items-center justify-between border border-green-500/30 bg-green-500/5 rounded-xl p-4 animate-scaleIn">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-green-400" />
                  <span className="font-medium text-sm font-mono">{appliedDiscount.code}</span>
                  <span className="text-xs text-white/50">
                    ({appliedDiscount.type === 'percent' ? `${appliedDiscount.value}% off` : `${formatPKR(appliedDiscount.value)} off`})
                  </span>
                </div>
                <button type="button" onClick={removeDiscount} className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase());
                      setDiscountError('');
                    }}
                    placeholder="Enter discount code"
                    className="input flex-1 uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyDiscount}
                    disabled={discountChecking || !discountInput.trim()}
                    className="btn-secondary px-5 shrink-0"
                  >
                    {discountChecking ? <Loader2 size={18} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? 'Placing Order...' : `Place Order — ${formatPKR(total)}`}
          </button>
        </form>

        <div className="border border-white/10 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-sm">
                <span className="text-white/70">
                  {item.title} <span className="text-white/40">({item.size} × {item.qty})</span>
                </span>
                <span className="font-medium">{formatPKR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-white/10" />
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Delivery Fee</span>
            <span>{deliveryFee > 0 ? formatPKR(deliveryFee) : 'Free'}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm mb-4 text-green-400">
              <span>Discount ({appliedDiscount.code})</span>
              <span>-{formatPKR(discountAmount)}</span>
            </div>
          )}
          <hr className="my-4 border-white/10" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
