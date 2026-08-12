'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPKR } from '@/lib/format';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/[0.03] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">Loading...</td></tr>
            )}
            {!loading && products.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No products yet. Add your first product.</td></tr>
            )}
            {products.map((p) => {
              const stock = Object.values(p.sizes || {}).reduce((a, b) => a + b, 0);
              return (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                    </div>
                    <span className="font-medium">{p.title}</span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{p.category}</td>
                  <td className="px-4 py-3">{formatPKR(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={stock === 0 ? 'text-red-500 font-medium' : stock <= 5 ? 'text-amber-600 font-medium' : ''}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-2 rounded-lg hover:bg-white/5 text-white/60" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
