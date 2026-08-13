import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getOrders, getOrdersByUser, createOrder, getProductById, upsertProduct } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { AUTH_COOKIE, ADMIN_COOKIE } from '@/lib/session';

export async function GET(req) {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const adminPayload = adminToken ? await verifyToken(adminToken, true) : null;
  if (adminPayload?.role === 'admin') {
    return NextResponse.json({ orders: await getOrders() });
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ orders: await getOrdersByUser(payload.sub) });
}

export async function POST(req) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: 'Please log in to place an order' }, { status: 401 });

  const body = await req.json();
  const { items, shipping, paymentMethod } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  if (!shipping?.name || !shipping?.address || !shipping?.city || !shipping?.phone) {
    return NextResponse.json({ error: 'Complete shipping details are required' }, { status: 400 });
  }

  // Validate stock and decrement it
  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 400 });
    const available = product.sizes?.[item.size] ?? 0;
    if (available < item.qty) {
      return NextResponse.json({ error: `Not enough stock for ${product.title} (size ${item.size})` }, { status: 400 });
    }
  }
  for (const item of items) {
    const product = await getProductById(item.productId);
    product.sizes[item.size] -= item.qty;
    await upsertProduct(product);
  }

  // Delivery fee is computed here (not trusted from the client): flat Rs.
  // 300 for Cash on Delivery, free for Online Transfer.
  const method = paymentMethod === 'transfer' ? 'transfer' : 'cod';
  const deliveryFee = method === 'cod' ? 300 : 0;
  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = itemsTotal + deliveryFee;
  const now = new Date().toISOString();
  const order = {
    id: `ORD-${nanoid(8).toUpperCase()}`,
    userId: payload.sub,
    items,
    shipping,
    paymentMethod: method,
    deliveryFee,
    total,
    status: 'Processing',
    createdAt: now,
    tracking: [
      { status: 'Order Placed', date: now },
      { status: 'Processing', date: now },
    ],
  };
  await createOrder(order);
  return NextResponse.json({ order }, { status: 201 });
}
