import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { AUTH_COOKIE, ADMIN_COOKIE } from '@/lib/session';

const STATUS_FLOW = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export async function GET(req, { params }) {
  const order = await getOrderById(params.id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const adminPayload = adminToken ? await verifyToken(adminToken, true) : null;
  if (adminPayload?.role === 'admin') return NextResponse.json({ order });

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload || payload.sub !== order.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ order });
}

export async function PUT(req, { params }) {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const adminPayload = adminToken ? await verifyToken(adminToken, true) : null;
  if (adminPayload?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await getOrderById(params.id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const { status } = await req.json();
  if (!STATUS_FLOW.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const tracking = [...order.tracking];
  if (!tracking.some((t) => t.status === status)) {
    tracking.push({ status, date: new Date().toISOString() });
  }

  const updated = await updateOrder(params.id, { status, tracking });
  return NextResponse.json({ order: updated });
}
