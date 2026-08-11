import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/session';

export async function GET(req) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ user: null });

  const user = getUserById(payload.sub);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, wishlist: user.wishlist } });
}
