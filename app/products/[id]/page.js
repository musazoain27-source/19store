import { getProductById, getProducts } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
