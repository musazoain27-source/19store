'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { formatPKR } from '@/lib/format';

const STATUS_COLORS = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account/orders');
      return;
    }
    if (user) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => setOrders(data.orders || []))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-white/40">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-fadeIn">
        <Package size={56} className="mx-auto text-white/20 mb-6" />
        <h1 className="text-2xl font-semibold mb-2">No orders yet</h1>
        <p className="text-white/50 mb-8">When you place an order, it will show up here.</p>
        <Link href="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <h1 className="section-title mb-8">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="card-hover flex items-center justify-between border border-white/10 rounded-2xl p-5"
          >
            <div>
              <p className="font-semibold">{order.id}</p>
              <p className="text-sm text-white/50">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-white/5'}`}>
                {order.status}
              </span>
              <span className="font-semibold hidden sm:block">{formatPKR(order.total)}</span>
              <ChevronRight size={18} className="text-white/30" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
