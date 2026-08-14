import { NextResponse } from 'next/server';
import { getDiscounts, getDiscountByCode, createDiscount } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

async function requireAdmin(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyToken(token, true) : null;
  return payload?.role === 'admin';
}

// Admin only: list all discount codes.
export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const discounts = await getDiscounts();
  return NextResponse.json({ discounts });
}

// Admin only: create a new discount code.
export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const code = (body.code || '').trim().toUpperCase();
  const type = body.type === 'percent' ? 'percent' : 'fixed';
  const value = Number(body.value);

  if (!code) return NextResponse.json({ error: 'A code is required' }, { status: 400 });
  if (!value || value <= 0) return NextResponse.json({ error: 'Enter a value greater than 0' }, { status: 400 });
  if (type === 'percent' && value > 100) return NextResponse.json({ error: 'Percentage cannot exceed 100' }, { status: 400 });

  const existing = await getDiscountByCode(code);
  if (existing) return NextResponse.json({ error: 'A discount code with this name already exists' }, { status: 409 });

  const discount = {
    code,
    type,
    value,
    expiresAt: body.expiresAt || null,
    active: true,
    createdAt: new Date().toISOString(),
  };
  const created = await createDiscount(discount);
  return NextResponse.json({ discount: created }, { status: 201 });
}
