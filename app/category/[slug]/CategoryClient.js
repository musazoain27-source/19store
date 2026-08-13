'use client';
import { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CategoryClient({ category, products }) {
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState('');
  const [sizeFilter, setSizeFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
    if (sizeFilter) list = list.filter((p) => (p.sizes?.[sizeFilter] ?? 0) > 0);

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [products, sort, maxPrice, sizeFilter]);

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-3">Max Price</p>
        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={maxPrice || 20000}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full accent-brand-blue"
        />
        <p className="text-xs text-black/50 mt-1">Up to Rs. {Number(maxPrice || 20000).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-3">Size</p>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSizeFilter(sizeFilter === s ? null : s)}
              className={`w-11 h-10 rounded-lg border text-sm font-medium transition-colors ${
                sizeFilter === s ? 'border-brand bg-brand text-black' : 'border-black/15 hover:border-brand'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {(maxPrice || sizeFilter) && (
        <button
          onClick={() => {
            setMaxPrice('');
            setSizeFilter(null);
          }}
          className="text-sm text-brand-blue font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="section-title">{category}</h1>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 border border-black/15 rounded-full px-4 py-2 text-sm font-medium"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden md:block">{FiltersPanel}</aside>

        <div>
          {filtered.length === 0 ? (
            <p className="text-black/50 py-16 text-center">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-neutral-900/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl animate-[fadeIn_0.25s_ease-out] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold text-lg">Filters</p>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </div>
  );
}
