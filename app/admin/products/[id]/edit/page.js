import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default function EditProductPage({ params }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Edit Product</h1>
      <ProductForm initial={product} productId={product.id} />
    </div>
  );
}
