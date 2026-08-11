import { SignJWT, jwtVerify } from 'jose';

// jose is used (instead of jsonwebtoken) because it works in both the
// normal Node.js runtime (API routes) AND the Edge Runtime (middleware.js),
// so admin-route protection works correctly everywhere, including Vercel.

const encoder = new TextEncoder();

function getSecret(isAdmin) {
  const raw = isAdmin
    ? process.env.ADMIN_JWT_SECRET || 'dev_only_insecure_admin_secret_change_me'
    : process.env.JWT_SECRET || 'dev_only_insecure_secret_change_me';
  return encoder.encode(raw);
}

export async function signToken(payload, isAdmin = false) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(isAdmin));
}

export async function verifyToken(token, isAdmin = false) {
  try {
    const { payload } = await jwtVerify(token, getSecret(isAdmin));
    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain) {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain, hash) {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.compare(plain, hash);
}
