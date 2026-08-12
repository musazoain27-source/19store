'use client';
import { useEffect, useState } from 'react';
import { formatPKR } from '@/lib/format';

const STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-semibold mb-8">Orders</h1>

      <div className="space-y-4">
        {loading && <p className="text-white/40">Loading orders...</p>}
        {!loading && orders.length === 0 && <p className="text-white/40">No orders placed yet.</p>}

        {orders.map((order) => (
          <div key={order.id} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-white/50">
                  {order.shipping?.name} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{formatPKR(order.total)}</span>
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="input w-auto py-1.5 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </button>

            {expanded === order.id && (
              <div className="border-t border-white/10 p-5 animate-slideDown">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium mb-2">Items</p>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-white/60">
                          {item.title} — Size {item.size} × {item.qty} ({formatPKR(item.price * item.qty)})
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Shipping Address</p>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {order.shipping?.address}, {order.shipping?.city} {order.shipping?.postalCode}<br />
                      {order.shipping?.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
