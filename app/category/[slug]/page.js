import { getProducts } from '@/lib/db';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

export default function CategoryPage({ params }) {
  const category = decodeURIComponent(params.slug);
  const products = getProducts().filter((p) => p.category === category);
  return <CategoryClient category={category} products={products} />;
}
