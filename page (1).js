import { getProducts, getOrders } from '@/lib/db';
import { formatPKR } from '@/lib/format';
import { Package, ListOrdered, DollarSign, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const products = await getProducts();
  const orders = await getOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => Object.values(p.sizes || {}).reduce((a, b) => a + b, 0) <= 5);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Total Orders', value: orders.length, icon: ListOrdered },
    { label: 'Total Revenue', value: formatPKR(totalRevenue), icon: DollarSign },
    { label: 'Low Stock Items', value: lowStock.length, icon: AlertTriangle },
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-neutral-900 border border-white/10 rounded-2xl p-5">
            <Icon size={20} className="text-brand-gold mb-3" />
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-white/50">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <Link key={o.id} href="/admin/orders" className="flex items-center justify-between text-sm hover:text-brand-gold transition-colors">
                <span className="font-medium">{o.id}</span>
                <span className="text-white/50">{o.status}</span>
                <span className="font-medium">{formatPKR(o.total)}</span>
              </Link>
            ))}
            {orders.length === 0 && <p className="text-sm text-white/40">No orders yet.</p>}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Low Stock Alerts</h2>
          <div className="space-y-3">
            {lowStock.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center justify-between text-sm hover:text-brand-gold transition-colors">
                <span className="font-medium">{p.title}</span>
                <span className="text-red-500">{Object.values(p.sizes || {}).reduce((a, b) => a + b, 0)} left</span>
              </Link>
            ))}
            {lowStock.length === 0 && <p className="text-sm text-white/40">All products are well stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
