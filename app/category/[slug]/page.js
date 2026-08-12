import { getProducts } from '@/lib/db';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }) {
  const category = decodeURIComponent(params.slug);
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.category === category);
  return <CategoryClient category={category} products={products} />;
}
