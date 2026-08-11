import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getProducts, upsertProduct } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = (searchParams.get('search') || '').toLowerCase();
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');

  let products = getProducts();

  if (search) {
    products = products.filter(
      (p) => p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
    );
  }
  if (category) products = products.filter((p) => p.category === category);
  if (featured === 'true') products = products.filter((p) => p.featured);
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  if (sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === 'newest') products = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return NextResponse.json({ products });
}

export async function POST(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyToken(token, true) : null;
  if (payload?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title || !body.price) {
    return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
  }

  const product = {
    id: nanoid(10),
    title: body.title,
    category: body.category || 'Uncategorized',
    price: Number(body.price),
    compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
    description: body.description || '',
    images: Array.isArray(body.images) ? body.images : [],
    sizes: body.sizes || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    featured: !!body.featured,
    createdAt: new Date().toISOString(),
  };

  upsertProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}
