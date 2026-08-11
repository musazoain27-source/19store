import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

export async function POST(req) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@19store.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  }

  const token = await signToken({ role: 'admin', email: adminEmail }, true);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
