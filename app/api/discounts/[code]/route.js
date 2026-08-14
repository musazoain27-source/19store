import { NextResponse } from 'next/server';
import { getDiscountByCode, updateDiscount, deleteDiscount } from '@/lib/db';
import { isDiscountUsable } from '@/lib/discount';
import { verifyToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

async function requireAdmin(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyToken(token, true) : null;
  return payload?.role === 'admin';
}

// Public: used by the checkout page to check a code before placing the
// order. Only returns the minimal info needed to show a discount preview -
// never leaks other codes or admin-only fields.
export async function GET(_req, { params }) {
  const discount = await getDiscountByCode(params.code);
  const { ok, reason } = isDiscountUsable(discount);
  if (!ok) return NextResponse.json({ error: reason }, { status: 400 });
  return NextResponse.json({ discount: { code: discount.code, type: discount.type, value: discount.value } });
}

// Admin only: toggle active/inactive (this is how a code gets "expired" on demand).
export async function PUT(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const patch = {};
  if (body.active !== undefined) patch.active = !!body.active;
  if (body.expiresAt !== undefined) patch.expiresAt = body.expiresAt;
  const updated = await updateDiscount(params.code, patch);
  if (!updated) return NextResponse.json({ error: 'Discount code not found' }, { status: 404 });
  return NextResponse.json({ discount: updated });
}

// Admin only: permanently remove a code.
export async function DELETE(req, { params }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteDiscount(params.code);
  return NextResponse.json({ ok: true });
}
