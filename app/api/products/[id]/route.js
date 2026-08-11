import { NextResponse } from 'next/server';
import { getProductById, upsertProduct, deleteProduct } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

async function requireAdmin(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyToken(token, true) : null;
  return payload?.role === 'admin';
}

export async function GET(_req, { params }) {
  const product = getProductById(params.id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const existing = getProductById(params.id);
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const body = await req.json();
  const updated = {
    ...existing,
    title: body.title ?? existing.title,
    category: body.category ?? existing.category,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? Number(body.compareAtPrice) : null) : existing.compareAtPrice,
    description: body.description ?? existing.description,
    images: Array.isArray(body.images) ? body.images : existing.images,
    sizes: body.sizes ?? existing.sizes,
    featured: body.featured !== undefined ? !!body.featured : existing.featured,
  };
  upsertProduct(updated);
  return NextResponse.json({ product: updated });
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const existing = getProductById(params.id);
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
