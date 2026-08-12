import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/session';

// Converts uploaded image files to base64 data URLs and returns them.
// Images are stored directly inside product records in data/db.json, so
// no filesystem/object storage is required to run this project anywhere.
// For a production store with many large images, swap this for a real
// image host (Cloudinary, S3, Vercel Blob) and store the returned URLs
// instead of base64 strings.
export async function POST(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyToken(token, true) : null;
  if (payload?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files');

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const urls = [];
  for (const file of files) {
    if (typeof file === 'string') continue;
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString('base64');
    urls.push(`data:${file.type};base64,${base64}`);
  }

  return NextResponse.json({ urls });
}
