import { NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/session';

export async function POST(req) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { wishlist } = await req.json();
  const user = updateUser(payload.sub, { wishlist: Array.isArray(wishlist) ? wishlist : [] });
  return NextResponse.json({ wishlist: user.wishlist });
}
