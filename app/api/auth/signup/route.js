import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getUserByEmail, createUser } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/session';

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: nanoid(10),
    name,
    email,
    passwordHash,
    wishlist: [],
    createdAt: new Date().toISOString(),
  };
  createUser(user);

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
