'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { formatPKR } from '@/lib/format';

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/account/orders/${id}`);
      return;
    }
    if (user) {
      fetch(`/api/orders/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setOrder(data.order);
        })
        .finally(() => setFetching(false));
    }
  }, [user, loading, id, router]);

  if (loading || fetching) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-black/40">Loading order...</div>;
  }

  if (error || !order) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-black/50">{error || 'Order not found.'}</div>;
  }

  const completedStatuses = order.tracking.map((t) => t.status);
  const currentStepIndex = STEPS.reduce((idx, step, i) => (completedStatuses.includes(step) ? i : idx), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 animate-fadeIn">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-black mb-6">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">{order.id}</h1>
        <span className="text-sm text-black/50">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Tracking timeline */}
      <div className="border border-black/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-6">Tracking Status</h2>
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const done = i <= currentStepIndex;
            const entry = order.tracking.find((t) => t.status === step);
            return (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {done ? (
                    <CheckCircle2 size={22} className="text-brand-blue shrink-0" />
                  ) : (
                    <Circle size={22} className="text-black/20 shrink-0" />
                  )}
                  {i < STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-brand-blue' : 'bg-black/10'}`} />}
                </div>
                <div className="pb-7">
                  <p className={`font-medium text-sm ${done ? '' : 'text-black/40'}`}>{step}</p>
                  {entry && <p className="text-xs text-black/40">{new Date(entry.date).toLocaleString()}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="border border-black/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-black/5 shrink-0">
                {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-black/50">Size {item.size} · Qty {item.qty}</p>
              </div>
              <span className="font-medium text-sm">{formatPKR(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-black/10" />
        <div className="flex justify-between text-sm mb-2">
          <span className="text-black/60">Subtotal</span>
          <span>{formatPKR(order.total - (order.deliveryFee || 0))}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-black/60">Delivery Fee</span>
          <span>{order.deliveryFee > 0 ? formatPKR(order.deliveryFee) : 'Free'}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-black/60">Payment Method</span>
          <span className="capitalize">{order.paymentMethod === 'transfer' ? 'Online Transfer' : 'Cash on Delivery'}</span>
        </div>
        <hr className="my-4 border-black/10" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPKR(order.total)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="border border-black/10 rounded-2xl p-6">
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <p className="text-sm text-black/60 leading-relaxed">
          {order.shipping.name}<br />
          {order.shipping.address}, {order.shipping.city} {order.shipping.postalCode}<br />
          {order.shipping.phone}
        </p>
      </div>
    </div>
  );
}
