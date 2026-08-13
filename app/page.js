import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORY_IMAGES = {
  Hoodies: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  Jackets: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  Bottoms: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
};

export default async function HomePage({ searchParams }) {
  const search = (searchParams?.search || '').toLowerCase();
  const allProducts = await getProducts();
  let products = allProducts;

  if (search) {
    products = products.filter(
      (p) => p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
    );
  }

  const featured = products.filter((p) => p.featured);
  const categories = [...new Set(allProducts.map((p) => p.category))];

  if (search) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h1 className="section-title mb-6">
          {products.length} result{products.length !== 1 ? 's' : ''} for &ldquo;{searchParams.search}&rdquo;
        </h1>
        {products.length === 0 ? (
          <p className="text-white/50">No products matched your search. Try a different keyword.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[480px] flex items-center overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="19Store hero"
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 w-full">
          <div className="max-w-lg animate-fadeInUp">
            <p className="text-brand-gold text-sm font-semibold tracking-[0.2em] mb-3">NEW SEASON</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
              Everyday essentials, elevated.
            </h1>
            <p className="text-white/85 mb-8 text-base md:text-lg leading-relaxed">
              Discover premium fits built to last — from oversized hoodies to tailored outerwear.
            </p>
            <Link href="/category/Hoodies" className="btn-gold">
              Shop the Collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-0 md:-mt-10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/category/Jackets"
          className="group relative h-56 rounded-2xl overflow-hidden shadow-xl animate-fadeInUp"
        >
          <Image src="https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&q=80" alt="Outerwear" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute bottom-5 left-6 text-white">
            <p className="text-xs tracking-widest text-brand-gold font-semibold mb-1">LIMITED STOCK</p>
            <p className="text-xl font-semibold">Outerwear Edit</p>
          </div>
        </Link>
        <Link
          href="/category/T-Shirts"
          className="group relative h-56 rounded-2xl overflow-hidden shadow-xl animate-fadeInUp"
        >
          <Image src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80" alt="Essentials" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute bottom-5 left-6 text-white">
            <p className="text-xs tracking-widest text-brand-gold font-semibold mb-1">UP TO 20% OFF</p>
            <p className="text-xl font-semibold">Everyday Essentials</p>
          </div>
        </Link>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <Reveal>
          <h2 className="section-title mb-8">Shop by Category</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Reveal key={cat} delay={i * 80}>
              <Link href={`/category/${encodeURIComponent(cat)}`} className="group card-hover rounded-2xl overflow-hidden relative aspect-square block">
                <Image src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Hoodies} alt={cat} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <span className="text-white font-semibold text-lg tracking-wide drop-shadow-md">{cat}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Products</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
