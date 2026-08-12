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
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-white/40">Loading order...</div>;
  }

  if (error || !order) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-white/50">{error || 'Order not found.'}</div>;
  }

  const completedStatuses = order.tracking.map((t) => t.status);
  const currentStepIndex = STEPS.reduce((idx, step, i) => (completedStatuses.includes(step) ? i : idx), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 animate-fadeIn">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white mb-6">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">{order.id}</h1>
        <span className="text-sm text-white/50">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Tracking timeline */}
      <div className="border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-6">Tracking Status</h2>
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const done = i <= currentStepIndex;
            const entry = order.tracking.find((t) => t.status === step);
            return (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {done ? (
                    <CheckCircle2 size={22} className="text-brand-gold shrink-0" />
                  ) : (
                    <Circle size={22} className="text-white/20 shrink-0" />
                  )}
                  {i < STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-brand-gold' : 'bg-white/10'}`} />}
                </div>
                <div className="pb-7">
                  <p className={`font-medium text-sm ${done ? '' : 'text-white/40'}`}>{step}</p>
                  {entry && <p className="text-xs text-white/40">{new Date(entry.date).toLocaleString()}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white/5 shrink-0">
                {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-white/50">Size {item.size} · Qty {item.qty}</p>
              </div>
              <span className="font-medium text-sm">{formatPKR(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPKR(order.total)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="border border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          {order.shipping.name}<br />
          {order.shipping.address}, {order.shipping.city} {order.shipping.postalCode}<br />
          {order.shipping.phone}
        </p>
      </div>
    </div>
  );
}
