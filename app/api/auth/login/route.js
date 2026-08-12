import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/session';

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, wishlist: user.wishlist } });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
